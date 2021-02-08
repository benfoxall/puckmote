import React, { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Puck from './puck.js';

import { PuckREPL } from './PuckSocket'


// write progress (global)
const useWriteProgress = () => {
  const [value, setValue] = useState<{ value: number, total: number }>(null);

  useEffect(() => {

    Puck.writeProgress = (value: number, total: number) => {
      setValue(total ? { value, total } : null)
    }

    return () => delete Puck.writeProgress;

  }, [])

  return value;
}


interface IPuckContext {
  repl?: PuckREPL;
  start: (code?: string) => void;
  stop: () => void;
}

export const PuckContext = React.createContext<IPuckContext>({
  start: () => { throw new Error("not implemented") },
  stop: () => { throw new Error("not implemented") }
})

export const PuckProvider: FC = ({ children }) => {

  const [repl, setRepl] = useState<PuckREPL>()

  const start = useCallback((code?: string) => {
    const _repl = repl || new PuckREPL();

    if (_repl !== repl) {
      setRepl(_repl);
    }

    if (code) return _repl.eval(code)
  }, [repl])


  const stop = useCallback(() => {

    if (repl) {
      repl.close();
      setRepl(undefined)
    }

  }, [repl])


  return <PuckContext.Provider value={{
    repl, start, stop
  }}>{children}</PuckContext.Provider>

}


export const usePuckConnection = () => Puck;

export const usePuckRepl = () => {
  const { start, repl } = useContext(PuckContext);

  return useCallback((code: string) => {
    if (repl) {
      return repl.eval(code)
    } else {
      return Promise.resolve(start(code))
    }
  }, [repl, start])
}


export const PuckStatus = () => {

  const prog = useWriteProgress()
  const { start, stop, repl } = useContext(PuckContext);

  return <div className="flex float-right">
    {prog && <div className="m-4">
      {prog.value} / {prog.total}
    </div>}
    {repl &&
      <button className="p-4 m-2 bg-blue-500 rounded-full" onClick={stop}>Stop</button>
    }
  </div>
}
