import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import './LoaderConsole.css';

export const LoaderConsole = ({ phrase = 'LOADING WALLET' }) => {
  const { backgroundColor, loader } = useSelector(({ ui }) => ui);
  // const { backgroundColor } = useSelector(({ ui }) => ui);
  // const loader = true;
  const largeSizeW = useMemo(
    () => phrase.split(' ').reduce((p, c) => (c.length > p ? c.length : p), 0),
    [phrase]
  );

  const addSpaces = (word, size) => {
    const missing = size - word.length;
    let newWord = word;
    for (let i = 0; i < missing; i++) {
      if (i % 2 === 0) {
        newWord = newWord + ' ';
      } else {
        newWord = ' ' + newWord;
      }
    }
    return newWord;
  };
  const words = useMemo(() => {
    let aux = [];
    let auxWords = phrase.split(' ');
    for (let i = 0; i < auxWords.length; i++) {
      if (aux.length === 0) {
        aux.push(auxWords[i]);
      } else {
        const currWord = aux[aux.length - 1];
        if (`${currWord} ${auxWords[i]}`.length <= largeSizeW) {
          aux[aux.length - 1] = `${currWord} ${auxWords[i]}`;
        } else {
          aux[aux.length - 1] = addSpaces(currWord, largeSizeW);
          aux.push(auxWords[i]);
        }
      }
    }
    aux[aux.length - 1] = addSpaces(aux[aux.length - 1], largeSizeW);
    return aux.join('').split('');
  }, [phrase, largeSizeW]);

  let i = 0;
  return (
    <>
      {loader && (
        <div className="loader_console__container" style={{ backgroundColor }}>
          <div className="loader_console__loading_line">
            {words.map((l, idx) => {
              const atrs =
                l === ' '
                  ? { cls: `loader${i}`, val: '' }
                  : { cls: `loader${++i}`, val: l };
              return (
                <div key={idx} className={atrs.cls}>
                  {atrs.val}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
