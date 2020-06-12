import React, { createContext } from 'react';
import { Redirect } from 'react-router-dom';

import { User } from '@/models/User';
import { useCurrentUserState } from '@/store/currentUser';
import { AsyncState } from '@/store/utils';
import { FC } from '@/typings/components';

type AuthGuardProps = {
  user: AsyncState<User | null>;
};

export const AuthGuardContext = createContext(true);

export const PureAuthGuard: FC<AuthGuardProps> = ({ children, user }) => {
  const isUserLoaded = user.status !== 'idle' && user.status !== 'loading';
  const doesUserExist = user.data;

  if (isUserLoaded) {
    throw new Error('AuthGuard can be used only inside routes wrapped in the WaitForUser component');
  }

  if (!doesUserExist) {
    return <Redirect to="/" />;
  }

  return <AuthGuardContext.Provider value>{children}</AuthGuardContext.Provider>;
};

export const AuthGuard: FC = ({ children }) => {
  const currentUser = useCurrentUserState();

  return <PureAuthGuard user={currentUser}>{children}</PureAuthGuard>;
};
