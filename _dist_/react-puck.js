import React, {useCallback, useContext, useEffect, useState} from "../web_modules/react.js";
import Puck from "./puck.js";
import {PuckREPL} from "./PuckSocket.js";
const useWriteProgress = () => {
  const [value, setValue] = useState(null);
  useEffect(() => {
    Puck.writeProgress = (value2, total) => {
      setValue(total ? {value: value2, total} : null);
    };
    return () => delete Puck.writeProgress;
  }, []);
  return value;
};
export const PuckContext = React.createContext({
  start: () => {
    throw new Error("not implemented");
  },
  stop: () => {
    throw new Error("not implemented");
  }
});
export const PuckProvider = ({children}) => {
  const [repl, setRepl] = useState();
  const start = useCallback((code) => {
    const _repl = repl || new PuckREPL();
    if (_repl !== repl) {
      setRepl(_repl);
    }
    if (code)
      return _repl.eval(code);
  }, [repl]);
  const stop = useCallback(() => {
    if (repl) {
      repl.close();
      setRepl(void 0);
    }
  }, [repl]);
  return /* @__PURE__ */ React.createElement(PuckContext.Provider, {
    value: {
      repl,
      start,
      stop
    }
  }, children);
};
export const usePuckConnection = () => Puck;
export const usePuckRepl = () => {
  const {start, repl} = useContext(PuckContext);
  return useCallback((code) => {
    if (repl) {
      return repl.eval(code);
    } else {
      return Promise.resolve(start(code));
    }
  }, [repl, start]);
};
export const PuckStatus = () => {
  const prog = useWriteProgress();
  const {start, stop, repl} = useContext(PuckContext);
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex float-right"
  }, prog && /* @__PURE__ */ React.createElement("div", {
    className: "m-4"
  }, prog.value, " / ", prog.total), repl && /* @__PURE__ */ React.createElement("button", {
    className: "p-4 m-2 bg-blue-500 rounded-full",
    onClick: stop
  }, "Stop"));
};
