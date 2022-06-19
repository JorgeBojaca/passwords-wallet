import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Console } from '../Console/Console';
import { useConsole } from '../hooks/useConsole';
import { loginWithGoogle, logoutFirebase } from '../reducers/authSlice';
import { clearConsole } from '../reducers/consoleSlice';
import './LoginConsole.css';

export const LoginConsole = () => {
  const dispatch = useDispatch();
  const { status, block } = useSelector(({ auth }) => auth);
  const { lines } = useSelector(({ console }) => console);

  const [isExecuting, setIsExecuting] = useState(true);
  const [commandResult, setCommandResult] = useState('');
  const { currentCommand, evalLine } = useConsole([
    {
      id: 'passw',
      name: 'Password Wallet',
      options: [
        {
          name: 'Login',
          id: 'login',
          options: [
            { name: 'Google', id: '--google' },
            { name: 'Email', id: '--email' },
          ],
        },
        { name: 'Logout', id: 'logout' },
      ],
    },
    { id: 'clear', name: 'Clear console' },
  ]);
  useEffect(() => {
    if (status || block !== '') {
      setCommandResult({
        msg: status,
        block,
      });
    }
  }, [status, block]);

  useEffect(() => {
    if (currentCommand.command.length > 0) {
      setIsExecuting(false);
      const { command, arg } = currentCommand;
      const type = command.join(' ');
      switch (type) {
        case 'passw login --google':
          dispatch(loginWithGoogle());
          break;
        case 'passw login --email':
          if (arg) {
            setCommandResult({
              msg: '¡Email agragado correctamente!',
              block: false,
            });
          } else {
            setCommandResult({
              msg: 'Escribe un correo válido después de --email ',
              block: false,
            });
          }

          break;
        case 'passw login --password':
          setCommandResult({
            msg: '¡Ingrese su contraseña!',
            block: false,
          });
          break;
        case 'passw logout':
          dispatch(logoutFirebase());
          setCommandResult({
            block: false,
          });
          break;

        case 'clear':
          dispatch(clearConsole());
          setCommandResult({
            block: false,
            option: 'HIDE_CURRENT',
          });
          break;

        default:
          setCommandResult({
            block: false,
          });

          break;
      }
    }
  }, [currentCommand, dispatch]);

  return (
    <>
      <Console
        intro={'<<Passwords Wallet>>\n'}
        lines={lines}
        setIsExecuting={setIsExecuting}
        isExecuting={isExecuting}
        evalLine={evalLine}
        commandResult={commandResult}
      />
    </>
  );
};
