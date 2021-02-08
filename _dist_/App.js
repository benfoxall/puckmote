import React from "../web_modules/react.js";
import {PuckProvider, PuckStatus, usePuckRepl} from "./react-puck.js";
import {SamsungTV} from "./data.js";
import {pronto as pronto2} from "./lib/pronto.js";
const Wrapped = () => {
  const repl = usePuckRepl();
  const run = (prontoHex) => {
    const times = pronto2(prontoHex);
    repl(`
      LED2.set();
    `);
    repl(`
        Puck.IR([${times.join(", ")}]);

        setTimeout(() => LED2.reset(), 100)
    `);
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "container mx-auto max-w-md p-8 m-8 bg-gray-200 shadow-2xl rounded"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "m-4"
  }, /* @__PURE__ */ React.createElement(PuckStatus, null)), /* @__PURE__ */ React.createElement("h1", {
    className: "text-4xl m-4"
  }, "Puckmote"), /* @__PURE__ */ React.createElement("h1", {
    className: "text-2xl m-4"
  }, "Samsung"), /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-wrap m-2 max-w-4xl"
  }, Object.entries(SamsungTV).map(([name, prontoHex]) => /* @__PURE__ */ React.createElement("button", {
    key: name,
    onClick: () => run(prontoHex),
    className: "flex whitespace-nowrap items-center justify-center rounded-full bg-green-300 p-4 m-1 h-6 hover:bg-green-700 focus:bg-green-700 transition-all text-l font-bold"
  }, name))));
};
export const App = () => /* @__PURE__ */ React.createElement(PuckProvider, null, /* @__PURE__ */ React.createElement(Wrapped, null));
