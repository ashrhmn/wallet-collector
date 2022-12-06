import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import useAuthUser from '../hooks/useAuthUser';
import { tquery } from '../tgql';

const LoginPage = () => {
  const { authUser } = useAuthUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (authUser) router.push('/dashboard');
  }, [authUser, router]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    const {
      login: { accessToken, refreshToken },
    } = await toast.promise(
      tquery({
        login: [
          { password, usernameOrEmail: username },
          { accessToken: true, refreshToken: true },
        ],
      }),
      { error: '', loading: '', success: '' }
    );
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    queryClient.invalidateQueries(['auth-user']);
    router.push('/dashboard');
  };

  if (authUser === null)
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <div className="border-2 rounded border-gray-300 p-3">
          <div className="flex flex-col mt-2">
            <h1>Username or Email</h1>
            <input
              className="border-2 border-gray-300 rounded w-80 p-1"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-2">
            <h1>Password</h1>
            <input
              className="border-2 border-gray-300 rounded w-80 p-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-700 text-white p-2 rounded"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  return <div>Loading...</div>;
};

export default LoginPage;
