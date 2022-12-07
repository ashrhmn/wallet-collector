import useAuthUser from '../../hooks/useAuthUser';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import FullScreenSpinner from '../FullScreenSpinner';

const AuthLayout = ({ children }: { children: ReactElement }) => {
  const { authUser } = useAuthUser();
  const router = useRouter();
  useEffect(() => {
    if (authUser === null) router.push('/login');
  }, [authUser, router]);
  if (authUser === undefined) return <FullScreenSpinner />;
  if (authUser) return <>{children}</>;
  return <></>;
};

export default AuthLayout;
