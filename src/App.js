import React from 'react';
import { useSelector } from 'react-redux';
import { LoaderConsole } from './LoaderConsole/LoaderConsole';
import { LoginConsole } from './LoginConsole/LoginConsole';
import Wallet from './Wallet/Wallet';

export const App = () => {
  const { uid } = useSelector(({ auth }) => auth);

  return (
    <>
      <LoaderConsole />
      {uid ? <Wallet /> : <LoginConsole />}
    </>
  );
};
