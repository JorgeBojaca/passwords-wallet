import { ContentLine } from '../ContentLine/ContentLine';

export const Line = ({ textInit, text }) => {
  let contentLine;
  if (typeof text === 'string') {
    contentLine = textInit ? textInit + text : text;
  } else if (typeof textInit === 'string') {
    contentLine = [...textInit.split(''), ...text];
  } else {
    contentLine = text;
  }
  return (
    <>
      <div className="login__content_line">
        <ContentLine text={contentLine} />
      </div>
    </>
  );
};
