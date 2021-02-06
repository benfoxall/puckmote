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
    className: "text-4xl p-4"
  }, "Puckmote"), /* @__PURE__ */ React.createElement("h1", {
    className: "text-2xl p-4"
  }, "Samsung"), /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-wrap p-4"
  }, Object.entries(SamsungTV).map(([name, prontoHex]) => /* @__PURE__ */ React.createElement("button", {
    key: name,
    onClick: () => run(prontoHex),
    className: "flex whitespace-nowrap items-center justify-center rounded-full bg-purple-700 hover:bg-red-700 text-white p-3 m-2 h-10 hover:bg-red-700"
  }, name))));
};
