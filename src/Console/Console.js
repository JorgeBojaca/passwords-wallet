import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ContentLine } from '../ContentLine/ContentLine';
import { Line } from '../Line/Line';
import { addNewLinesDisp } from '../reducers/consoleSlice';

export const Console = ({
  intro = '',
  lines = [],
  setIsExecuting,
  isExecuting,
  evalLine,
  commandResult,
  preLine = '↪passwall@:/# ',
}) => {
  const initialLines = useMemo(() => {
    return intro.split('\n').reduce((p, c) => {
      if (p.length > 0) {
        return [...p, { content: c === '' ? [' '] : [...c.split('')] }];
      }
      return [{ content: [...c.split('')] }];
    }, []);
  }, [intro]);
  const [preLineTxt, setPreLineTxt] = useState(preLine);
  const ref = useRef();
  const refContainer = useRef();
  const [content, setContent] = useState([]);
  const [content2, setContent2] = useState('');
  const [positionXInp, setPositionXInp] = useState('0px');

  const [refPosition, setRefPosition] = useState();

  const dispatch = useDispatch();

  const [focus, setFocus] = useState({
    position: 0,
    isFocused: false,
    lineHistoryPosition: 0,
  });
  const backgroundColor = useSelector(({ ui }) => ui.backgroundColor);
  const [caretBlinking] = useState(true);
  const caretType = 'box';

  const stopExec = () => {
    setIsExecuting(false);
  };
  const continueExec = () => {
    setIsExecuting(true);
  };

  useEffect(() => {
    if (lines.length === 0) {
      dispatch(addNewLinesDisp({ newLines: initialLines }));
    }
  }, [initialLines, lines, dispatch]);

  const toContent = (val) => ({ content: val?.split('') });

  useEffect(() => {
    let contExec = true;
    let payload;
    if (commandResult.msg) {
      const newMsgs = commandResult.msg
        .split('\n')
        .map((msg) => toContent(msg));
      contExec = !commandResult.block;
      payload = {
        config: {
          current: content.length > 0 ? content : null,
          preLineTxt,
          isHidden: commandResult.option === 'HIDE_CURRENT',
        },
        newLines: [...newMsgs],
      };
    } else if (commandResult.block === false) {
      contExec = true;
      payload = {
        config: {
          current: content.length > 0 ? content : null,
          preLineTxt,
          isHidden: commandResult.option === 'HIDE_CURRENT',
        },
      };
    }
    if (payload) {
      dispatch(addNewLinesDisp(payload));
    }
    setFocus((f) => ({
      ...f,
      lineHistoryPosition: 0,
    }));

    setContent([]);
    setContent2('');
    updatePosition(true);

    if (contExec) {
      continueExec();
      setPreLineTxt(preLine);
    } else {
      setPreLineTxt('');
    }
    // eslint-disable-next-line
  }, [commandResult]);

  useEffect(() => {
    if (focus.lineHistoryPosition !== 0) {
      const linesHistory = lines.filter((l) => l.toHistory);
      const lineFound =
        linesHistory[linesHistory.length + focus.lineHistoryPosition];
      setContent(lineFound.content);
      setContent2(lineFound.content.join(''));
      setFocus((f) => ({ ...f, position: lineFound.content.length }));
    } else {
      setContent([]);
      setContent2('');
      setFocus((f) => ({ ...f, position: 0 }));
      updatePosition(true);
    }
  }, [focus.lineHistoryPosition, lines]);

  useEffect(() => {
    if (!focus.isFocused) {
      continueExec();
      ref.current?.focus();
      setFocus((f) => ({ ...f, isFocused: true }));
    }
  }, [focus.isFocused]);
  useLayoutEffect(() => {
    refContainer.current.scrollTop = refContainer.current.scrollHeight;
  }, [lines]);

  const handleInput = ({ target }) => {
    if (isExecuting) {
      if (target.value.length >= 0) {
        let value = [...target.value.split('')];
        let val = value.pop() || '';
        val = val === '—' ? '--' : val; //Ajuste para Safari ios
        value = [...value, val];

        if (content2.length < target.value.length) {
          setFocus((f) => ({ ...f, position: f.position + 1 }));
        }
        setContent(value);
        setContent2(value.join(''));
        updatePosition();
      }
    }
  };
  const updatePosition = (reset) => {
    if (reset) {
      setPositionXInp('0px');
    }
    if (refPosition?.current) {
      setPositionXInp(refPosition.current.getBoundingClientRect().x + 'px');
    }
  };

  const handleSpecialKeyDown = ({ key }) => {
    if (!isExecuting) return;
    if (key === 'Backspace') {
      if (content.length > 0 && focus.position > 0) {
        setFocus((f) => ({ ...f, position: f.position - 1 }));
        updatePosition();
      }
    } else if (key === 'ArrowLeft') {
      if (focus.position > 0) {
        setFocus((f) => ({ ...f, position: f.position - 1 }));
      }
    } else if (key === 'ArrowRight') {
      if (focus.position < content.length) {
        setFocus((f) => ({ ...f, position: f.position + 1 }));
      }
    } else if (key === 'ArrowDown') {
      if (focus.lineHistoryPosition < 0) {
        setFocus((f) => ({
          ...f,
          lineHistoryPosition: f.lineHistoryPosition + 1,
        }));
      }
    } else if (key === 'ArrowUp') {
      if (
        focus.lineHistoryPosition <= 0 &&
        Math.abs(focus.lineHistoryPosition) <
          lines.filter((ln) => ln.toHistory).length
      ) {
        setFocus((f) => ({
          ...f,
          lineHistoryPosition: f.lineHistoryPosition - 1,
        }));
      }
    } else if (key === 'Enter') {
      const isCommand = evalLine({ content });
      if (!isCommand) {
        updatePosition(true);
        dispatch(
          addNewLinesDisp({
            config: {
              current: content,
              preLineTxt,
              contExec: true,
              isHidden: false,
            },
          })
        );
        setFocus((f) => ({
          ...f,
          position: 0,
          lineHistoryPosition: 0,
        }));
      } else {
        stopExec();
      }
    }
  };

  return (
    <div
      ref={refContainer}
      className="login__container"
      style={{ backgroundColor }}
      onClick={() => setFocus((f) => ({ ...f, isFocused: false }))}
    >
      <div className="login__main">
        {lines
          .filter((line) => !line.isHidden)
          .map(({ content, preLineTxt }, idx) => (
            <Line key={idx} text={content} textInit={preLineTxt} />
          ))}
        <div
          className="login__custom_textarea"
          onBlur={() => {
            setFocus((f) => ({ ...f, isFocused: false }));
          }}
          tabIndex="0"
        >
          <ContentLine tabIndex={0} text={preLineTxt} />
          {content.length === 0 ? (
            <CustomCaret
              type={caretType}
              blink={caretBlinking}
              show={isExecuting}
              setRefPosition={setRefPosition}
            />
          ) : (
            <>
              {content.map((k, idx) => {
                let className = '';
                if (idx === focus.position) {
                  className += caretBlinking ? 'focus blinking' : 'focus';
                }
                return (
                  <ContentLine
                    key={idx}
                    tabIndex={idx}
                    text={k}
                    isPass={false}
                    className={className}
                  />
                );
              })}

              {focus.position === content.length && (
                <CustomCaret
                  type={caretType}
                  blink={caretBlinking}
                  show={isExecuting}
                  setRefPosition={setRefPosition}
                />
              )}
            </>
          )}
        </div>
        <input
          className="login__hidden_input"
          type="text"
          ref={ref}
          onChange={handleInput}
          onBlur={stopExec}
          onKeyDown={handleSpecialKeyDown}
          value={content2}
          style={{ left: positionXInp }}
        />
      </div>
    </div>
  );
};

const CustomCaret = ({ type, blink, show, setRefPosition }) => {
  const ref = useRef();
  useEffect(() => {
    if (ref) {
      setRefPosition(ref);
    }
  }, [ref, setRefPosition]);
  const getClasses = () => {
    let className = 'login__custom_caret';
    switch (type) {
      case 'box':
        className += ' caret_type_box';
        break;
      case 'line':
        className += ' caret_type_line';
        break;
      default:
        break;
    }
    return blink ? className + ' caret_blinking' : className;
  };
  return (
    <>
      {show && (
        <span ref={ref} className={getClasses()}>
          {type === 'line' && '|'}
        </span>
      )}
    </>
  );
};

Console.propTypes = {
  setIsExecuting: PropTypes.func.isRequired,
  isExecuting: PropTypes.bool.isRequired,
  evalLine: PropTypes.func.isRequired,
  commandResul: PropTypes.object,
};
