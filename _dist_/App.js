import React from "../web_modules/react.js";
import {SamsungTV} from "./data.js";
import {pronto as pronto2} from "./lib/pronto.js";
export const App = () => {
  const run = (prontoHex) => {
    const times = pronto2(prontoHex);
    Puck.write(`
        LED2.set();

        Puck.IR([${times.join(", ")}]);

        setTimeout(() => LED2.reset(), 100)
    `);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", {
    className: "text-4xl m-4 text-gray-900 dark:text-white"
  }, "Puckmote"), /* @__PURE__ */ React.createElement("h1", {
    className: "text-2xl m-4"
  }, "Samsung"), /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-wrap m-2 max-w-4xl"
  }, Object.entries(SamsungTV).map(([name, prontoHex]) => /* @__PURE__ */ React.createElement("button", {
    key: name,
    onClick: () => run(prontoHex),
    className: "flex whitespace-nowrap items-center justify-center rounded-full bg-blue-500 hover:bg-red-700 text-white p-3 m-2 h-10 hover:bg-blue-700 focus:bg-blue-700 transition-all "
  }, name))));
};
