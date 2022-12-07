import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import FullScreenSpinner from '../components/FullScreenSpinner';

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  return <FullScreenSpinner />;
};

export default Home;
