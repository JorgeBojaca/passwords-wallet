import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LoaderConsole } from './LoaderConsole/LoaderConsole';
import { LoginCaptcha } from './LoginCaptcha/LoginCaptcha';
// import { LoginConsole } from './LoginConsole/LoginConsole';
import Wallet from './Wallet/Wallet';

export const App = () => {
  const { uid } = useSelector(({ auth }) => auth);
  useEffect(() => {
    const recap = sessionStorage.getItem('recap');
    if (!uid && recap) {
      sessionStorage.removeItem('recap');
      window.location.reload();
    }
  }, [uid]);

  return (
    <>
      <LoaderConsole />
      {uid ? <Wallet /> : <LoginCaptcha />}
      {/* {uid ? <Wallet /> : <LoginConsole />} */}
    </>
  );
};
