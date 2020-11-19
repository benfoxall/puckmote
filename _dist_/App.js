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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", null, "Samsung"), Object.entries(SamsungTV).map(([name, prontoHex]) => /* @__PURE__ */ React.createElement("button", {
    key: name,
    onClick: () => run(prontoHex)
  }, name)));
};
