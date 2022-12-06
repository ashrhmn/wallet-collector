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
  // useEffect(() => {
  //   if (authUserStatus === 'success') router.push('/dashboard');
  // }, [authUserStatus, router]);
  const [username, setUsername] = useState('ash');
  const [password, setPassword] = useState('ash');
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
    // console.log({ accessToken, refreshToken });
    queryClient.invalidateQueries(['auth-user']);
    router.push('/dashboard');
  };

  // if (authUserStatus === 'error' || !!failureCount)
  if (authUser === null)
    return (
      <div>
        <div>
          <div>
            <h1>Username or Email</h1>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <h1>Password</h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  return <div>Loading...</div>;
};

export default LoginPage;
