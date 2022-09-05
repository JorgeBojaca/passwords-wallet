import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginWithGoogle } from '../reducers/authSlice';

export const LoginCaptcha = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const recap = document.querySelector('#recap');
    recap.style.display = 'block';
  }, []);

  return (
    <div
      style={{
        backgroundColor: 'black',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <button
        style={{ display: 'none' }}
        data-recap="1"
        onClick={() => {
          dispatch(loginWithGoogle());
        }}
      >
        RECAP
      </button>
    </div>
  );
};
