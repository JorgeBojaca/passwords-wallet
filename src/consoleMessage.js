export const consoleMessage = (title, body) => {
  const titleStyles = `
  box-sizing: border-box;
  color: red;
  font-size: 5rem;
  font-weight: bold;
  margin: 0 auto;
  `;
  const bodyStyles = `
  background-color: black;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  line-height:2.1rem;
  width: 100vw;
  `;
  console.log(`%c${title}`, titleStyles);
  console.log(`%c${body}`, bodyStyles);
};
