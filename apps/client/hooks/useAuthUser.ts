// import { useQuery } from '@tanstack/react-query';
import { ROLE } from '@wallet-collector/generated/zeus';
import { useCallback, useEffect, useState } from 'react';
import { tquery } from '../tgql';

interface IAuthUser {
  email: string;
  id: string;
  roles?: ROLE[] | undefined;
  username: string;
}

const useAuthUser = () => {
  const [authUser, setAuthUser] = useState<IAuthUser | null | undefined>(
    undefined
  );
  const [refetcher, setRefetcher] = useState(false);

  const refetch = useCallback(() => setRefetcher((v) => !v), []);

  const authFn = () =>
    tquery({
      currentUser: { email: true, id: true, roles: true, username: true },
    })
      .then((res) => res.currentUser)
      .then(setAuthUser)
      .catch(() => setAuthUser(null));

  useEffect(() => {
    authFn();
  }, [refetcher]);

  useEffect(() => {
    const id = setInterval(authFn, 5000);
    return () => clearInterval(id);
  }, []);

  return { authUser, setAuthUser, refetch };
};

export default useAuthUser;
