import { useCallback, useEffect, useRef, useState } from 'react';
import enc_utf8 from 'crypto-js/enc-utf8';
import aes from 'crypto-js/aes';
import { useDispatch, useSelector } from 'react-redux';
import { removeApp } from '../reducers/walletSlice';

const PassApp = ({
  app,
  resetBy,
  idx,
  onClick,
  setResetBy,
  showDelete,
  setShowDelete,
}) => {
  const ref = useRef();
  const [opt, setOpt] = useState(0);
  const [key, setKey] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { uid } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (opt !== 0 && opt !== 3 && idx !== resetBy) {
      //Oculta la contraseña inmediatamente id despues del llamado de resetBy
      setOpt(3);
    }
    setIsCopied(false);
  }, [resetBy, setOpt, idx, opt]);

  useEffect(() => {
    if (ref.current && opt === 1) {
      ref.current.focus();
    }
  }, [opt]);

  const handleClick = (e) => {
    onClick(e);
    setShowDelete(false);
    if (opt === 0 || opt > 2) {
      setOpt(1);
    } else if (opt === 2) {
      setOpt(3);
      setResetBy(-1);
      setKey('');
    }
  };
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (opt === 1 && key !== '') {
        setOpt(2);
      }
    },
    [opt, key]
  );
  const getPass = () => {
    const cipher = aes.decrypt(app.value, uid + key + uid).toString(enc_utf8);
    if (!cipher) return '😥';
    const objCipher = JSON.parse(cipher);
    return objCipher.val;
  };
  return (
    <>
      <div
        title={app.name}
        className={`wallet-app ${
          opt === 0
            ? 'wallet-app__init'
            : opt === 1
            ? 'wallet-app_inp'
            : opt === 2
            ? 'wallet-app_show_pass '
            : opt === 3
            ? 'wallet-app_hide_pass'
            : ''
        }`}
        onClick={handleClick}
      >
        {showDelete && (
          <span
            className="wallet-app_deleting_btn"
            title="Eliminar"
            onClick={(e) => {
              e.stopPropagation();
              const res = window.confirm(
                `¿Está seguro q desea eliminar la contraseña para ${app.name}?`
              );
              if (res) {
                dispatch(removeApp(app.id));
              }
            }}
          >
            x
          </span>
        )}

        {opt === 1 ? (
          <>
            <form onSubmit={handleSubmit}>
              <input
                ref={ref}
                placeholder="Escriba su KEY..."
                className="wallet-app-input"
                style={{ zIndex: '150' }}
                onChange={(e) =>
                  setKey(() => (e.target.value ? e.target.value : ''))
                }
              ></input>
            </form>
            <div
              className="wallet-app__background-input-act"
              onClick={() => {
                setOpt(0);
                setResetBy(-1);
              }}
            ></div>
          </>
        ) : opt === 2 ? (
          <>
            <strong>{getPass()}</strong>
            {!isCopied ? (
              <button
                style={{
                  position: 'absolute',
                  right: 0,
                  cursor: 'pointer',
                  fontSize: 'small',
                }}
                className="wallet-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard
                    .writeText(getPass())
                    .then(() => setIsCopied(true));
                }}
              >
                copy
              </button>
            ) : (
              <span className="wallet-app_check"></span>
            )}
          </>
        ) : (
          app.name
        )}
      </div>
    </>
  );
};

export default PassApp;
