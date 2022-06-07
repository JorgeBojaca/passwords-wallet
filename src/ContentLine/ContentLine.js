export const ContentLine = ({ text = [' '], className, isPass }) => {
  let content = typeof text === 'string' ? text.split('') : text;
  if (isPass) {
    content = content.map(() => '*');
  }
  return (
    <>
      {!content ? (
        <></>
      ) : (
        <>
          {content.map((char, idx) => (
            <span key={idx} className="login__content_line">
              {char !== ' ' ? (
                <span className={'login__content_line_char ' + className}>
                  {char}
                </span>
              ) : (
                <span className={'login__content_line_char ' + className}>
                  &nbsp;
                </span>
              )}
            </span>
          ))}
        </>
      )}
    </>
  );
};
