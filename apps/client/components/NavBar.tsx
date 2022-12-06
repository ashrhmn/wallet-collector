import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import useAuthUser from '../hooks/useAuthUser';

const NavBar = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { authUser, refetch } = useAuthUser();

  const handleLogoutClick = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    await queryClient.invalidateQueries(['auth-user']);
    router.push('/login');
  };

  useEffect(() => {
    refetch();
  }, [refetch, router.asPath]);

  return (
    <div className="bg-gray-300 fixed l-0 r-0 t-0 h-16 w-full flex items-center justify-between px-5">
      <div>Logo</div>
      {authUser === null && (
        <div>
          <Link href={'/login'}>Sign In</Link>
        </div>
      )}
      {authUser === undefined && <div>Loading...</div>}
      {authUser && (
        <div className="flex items-center gap-4">
          <Link href={`/dashboard`}>Dashboard</Link>
          <h1>{authUser.username || authUser.email}</h1>
          <button
            onClick={handleLogoutClick}
            className="text-red-700 border-2 border-red-700 rounded p-1 hover:bg-red-700 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
