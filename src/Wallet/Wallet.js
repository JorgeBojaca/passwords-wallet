import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import aes from 'crypto-js/aes';

import { fetchApps, saveApp } from '../reducers/walletSlice';
import { logoutFirebase } from '../reducers/authSlice';
import PassApp from './PassApp';
import './Wallet.css';

const Wallet = () => {
  const [inputCipher, setInputCipher] = useState('');
  const [inputName, setInputName] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [uid, apps, backgroundColor] = useSelector((state) => [
    state.auth.uid,
    state.wallet.apps,
    state.ui.backgroundColor,
  ]);
  const [resetBy, setResetBy] = useState(-1);
  const [showAdd, setShowAdd] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!uid) return;
    dispatch(fetchApps(uid));
  }, [dispatch, uid]);

  useEffect(() => {
    if (showAdd === null) {
      if (apps.length > 0) {
        setShowAdd(-1);
      } else {
        setShowAdd(1);
      }
    }
  }, [apps.length, showAdd]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = prompt('KEY');
    if (!key) {
      alert('key es obligatorio');
      return;
    }
    const cipher = aes.encrypt(
      JSON.stringify({ val: inputCipher }),
      uid + key + uid
    );
    dispatch(saveApp({ name: inputName, value: cipher.toString() }));
    setInputName('');
    setInputCipher('');
    setShowAdd(0);
  };
  const handleClick = (e, idx) => {
    e.stopPropagation();
    setResetBy(idx);
  };
  const handleMouseInfo = () => {
    setShowInfo((shI) => !shI);
  };

  return (
    <div
      className="wallet"
      onMouseLeave={() => {
        setResetBy(-1);
      }}
      onClick={() => {
        setResetBy(-1);
        setShowDelete(false);
      }}
    >
      <main style={{ backgroundColor }} className="wallet-main">
        <div>
          <h1 className="inline">Passwords Wallet</h1>
          {
            <button
              title={showAdd ? 'Esconder form' : 'Nueva contraseña'}
              className="wallet-btn inline"
              onClick={() => {
                setShowAdd((s) => (s <= 0 ? 1 : 0));
              }}
            >
              {showAdd <= 0 ? '+' : '^'}
            </button>
          }
        </div>
        <button
          tittle="Cerrar sesión"
          style={{ position: 'absolute', top: '0', right: '0' }}
          className="wallet-btn"
          onClick={() => {
            dispatch(logoutFirebase());
          }}
        >
          X
        </button>
        {showInfo && (
          <span className="wallet-hover-info">
            **Recuerde que la KEY que se le pedirá se la debe aprender ya que es
            el acceso único a la contraseña, no la guardaremos por lo cual no se
            puede recuperar**
          </span>
        )}
        {showAdd === 1 && (
          <div
            className="wallet-form_container"
            style={{ position: 'relative' }}
          >
            <h3>Guardar Contraseña</h3>
            <div style={{ marginBottom: '10px', textAlign: 'start' }}>
              Escriba la contraseña que desea guardar.
              <div
                onMouseEnter={handleMouseInfo}
                onMouseLeave={handleMouseInfo}
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                  position: 'relative',
                }}
              >
                (i)
              </div>
            </div>

            <form className="wallet-form" onSubmit={(e) => handleSubmit(e)}>
              <input
                name="name"
                className="wallet-input"
                autoComplete="off"
                placeholder="Nombre"
                onChange={({ target: { value } }) => setInputName(value)}
                value={inputName}
              />
              <input
                name="cipher"
                className="wallet-input"
                autoComplete="off"
                placeholder="Contraseña"
                onChange={({ target: { value } }) => setInputCipher(value)}
                value={inputCipher}
              />
              <button className="wallet-btn" type="submit">
                Guardar
              </button>
            </form>
          </div>
        )}
        {apps.length > 0 && (
          <div
            className={
              showAdd === 0
                ? 'wallet-app_container_form_hidden'
                : showAdd === 1
                ? 'wallet-app_container_form_showed'
                : ''
            }
          >
            <h3 style={{ display: 'inline-block' }}>Contraseñas Guardadas</h3>
            <button
              title="Eliminar contraseña"
              className="wallet-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowDelete(true);
                setResetBy(-1);
              }}
            >
              -
            </button>
            <div className="wallet-app_container">
              {apps.map((app, idx) => (
                <PassApp
                  key={app.name}
                  app={app}
                  resetBy={resetBy}
                  setResetBy={setResetBy}
                  showDelete={showDelete}
                  setShowDelete={setShowDelete}
                  idx={idx}
                  onClick={(e, id = idx) => {
                    handleClick(e, id);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wallet;
