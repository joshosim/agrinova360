import { Loading } from '@/components/Loading';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const Router = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {user ? <AppStack /> : <AuthStack />}
    </>
  );
};

export default Router