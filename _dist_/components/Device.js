import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {fetchDevice, useAsync} from "../irdb.js";
import {EncodeIR} from "../wasm/EncodeIR.js";
const Puck = window.Puck;
Puck.debug = 3;
export const Device = ({path}) => {
  const fns = useAsync(() => fetchDevice(path), [path]);
  const [fn, setFn] = useState();
  const trigger = async (fn2, send) => {
    setFn(fn2);
    if (send)
      await emit(fn2);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "m-2 mt-8 flex justify-between gap-4 flex-col md:flex-row"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(FnVis, {
    fn
  })), /* @__PURE__ */ React.createElement("div", {
    className: "opacity-20"
  }, path)), /* @__PURE__ */ React.createElement("div", {
    className: "dark:bg-gray-800 bg-white p-2 rounded"
  }, fns && /* @__PURE__ */ React.createElement("nav", {
    className: "flex flex-wrap"
  }, fns.map((fn2, i) => /* @__PURE__ */ React.createElement(Button, {
    key: i,
    fn: fn2,
    trigger
  })))));
};
const Button = ({fn, trigger}) => {
  const [active, setActive] = useState(false);
  const click = async () => {
    setActive(true);
    await trigger(fn, true);
    setActive(false);
  };
  const enter = () => trigger(fn, false);
  return /* @__PURE__ */ React.createElement("button", {
    className: "m-2 p-2 text-white rounded shadow transition-colors " + (active ? "bg-blue-500" : "bg-gray-900 hover:bg-black focus:bg-black focus:text-pink-500 hover:text-pink-500 focus:text-pink-500"),
    type: "button",
    onClick: click,
    onMouseEnter: enter
  }, fn.functionname);
};
const FnVis = ({fn}) => {
  const [m, setM] = useState([]);
  useEffect(() => {
    if (fn)
      decode(fn).then(setM);
  }, [fn]);
  let x = 0;
  const scale = 3;
  const text = fn ? `${fn.protocol} ${fn.device} ${fn.subdevice} ${fn.function}` : "–";
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col"
  }, /* @__PURE__ */ React.createElement("div", null, text), /* @__PURE__ */ React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "5",
    style: {width: "100%"}
  }, m.map((val, i) => {
    const p = x;
    x += val;
    if (i % 2)
      return null;
    return /* @__PURE__ */ React.createElement("rect", {
      key: i,
      x: p * scale,
      width: val * scale,
      fill: "currentColor",
      height: "10"
    });
  })));
};
const decode = async (fn) => {
  const result = await EncodeIR(fn.protocol, parseInt(fn.device, 10), parseInt(fn.subdevice, 10), parseInt(fn.function, 10));
  return result.split(" ").map(parseFloat).map((v) => v / 1e3);
};
let last = null;
const emit = async (fn) => {
  if (last === fn) {
    await Puck.write("repeat();\nLED2.set();setTimeout(() => LED2.reset(), 500)\n");
  } else {
    last = fn;
    const millis = await decode(fn);
    await Puck.write(`    
        LED3.set();
        function repeat() {
          Puck.IR([${millis.map((n) => n.toFixed(2)).join(",")}])
        };
        repeat();
        LED3.reset();
      `);
  }
};
