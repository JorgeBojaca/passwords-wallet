import { buildTimeValue } from '@testing-library/user-event/dist/utils';
import { useCallback, useState } from 'react';

export const useConsole = (inpCommands) => {
  const [commands] = useState(inpCommands);
  const [currentCommand, setCurrentCommand] = useState({
    command: [],
    arg: '',
  });

  //Recursivo ;)
  const getOptions = useCallback((options, values) => {
    if (!options || options.length === 0) {
      return [];
    }
    const command = options.find((o) => o.id === values[0]);
    if (!command) return [];
    let newValues = [...values];
    newValues.splice(0, 1);
    return [command.id, ...getOptions(command?.options, newValues)];
  }, []);

  const evalLine = useCallback(
    (line) => {
      const values = line.content.join('').split(' ');
      const commandEnter = getOptions(commands, values);
      // values[commandEnter.length] -->parametro ingresado despues del comando
      if (commandEnter.length > 0) {
        setCurrentCommand({
          command: commandEnter,
          arg: values[commandEnter.length],
        });
        return true;
      }
      setCurrentCommand({ command: [], arg: '' });

      return false;
    },
    [commands, getOptions]
  );
  return { commands, currentCommand, evalLine };
};
