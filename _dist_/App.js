import React, {useEffect, useState} from "../web_modules/react.js";
import {PuckProvider, PuckStatus, usePuckRepl} from "./react-puck.js";
import {SamsungTV} from "./data.js";
import {fetchIRDBDevice, useIRDBData} from "./irdb.js";
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
    className: "container mx-auto max-w-md p-8 m-8 bg-gray-200 text-black shadow-2xl rounded"
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
    className: "flex whitespace-nowrap items-center justify-center rounded bg-green-300 p-4 m-1 h-6 hover:bg-green-700 focus:bg-green-700 transition-all text-l font-bold"
  }, name))));
};
export const AppV1 = () => /* @__PURE__ */ React.createElement(PuckProvider, null, /* @__PURE__ */ React.createElement(Wrapped, null));
import {EncodeIR as EncodeIR2} from "./wasm/EncodeIR.js";
EncodeIR2("NECx1", 0, 191, 3).then(console.log);
export const AppV2 = () => {
  const manufacturers = useIRDBData();
  const [manufacturer, setManufacturer] = useState();
  const changeManufacturer = (e) => setManufacturer(e.target.value);
  const types = manufacturers[manufacturer];
  const [type, setType] = useState();
  const changeType = (e) => setType(e.target.value);
  const devices = types?.[type];
  const submit = (e) => {
    e.preventDefault();
    console.log("submit");
  };
  return /* @__PURE__ */ React.createElement("form", {
    className: "m-5 font-mono",
    onSubmit: submit
  }, /* @__PURE__ */ React.createElement("select", {
    className: "bg-gray-800 m-2 p-2 rounded",
    onChange: changeManufacturer,
    name: "m",
    value: manufacturer
  }, /* @__PURE__ */ React.createElement("option", null, "\u2026"), Object.keys(manufacturers).map((name) => /* @__PURE__ */ React.createElement("option", {
    key: name
  }, name))), types && /* @__PURE__ */ React.createElement("select", {
    className: "bg-gray-800 m-2 p-2 rounded block",
    onChange: changeType,
    name: "t",
    value: type
  }, /* @__PURE__ */ React.createElement("option", null, "\u2026"), Object.keys(types).map((name) => /* @__PURE__ */ React.createElement("option", {
    key: name
  }, name))), /* @__PURE__ */ React.createElement("ul", null, devices?.map(([dev, subdev], i) => /* @__PURE__ */ React.createElement("li", {
    key: i
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mx-2 mt-8 p-2 rounded text-right opacity-20"
  }, dev, " | ", subdev), /* @__PURE__ */ React.createElement("div", {
    className: "bg-gray-800 p-2 rounded"
  }, /* @__PURE__ */ React.createElement(Device, {
    manufacturer,
    devicetype: type,
    device: dev,
    subdevice: subdev
  }))))));
};
const Device = ({manufacturer, devicetype, device, subdevice}) => {
  const [butts, setButts] = useState();
  useEffect(() => {
    setButts([]);
    fetchIRDBDevice(manufacturer, devicetype, device, subdevice).then(setButts);
  }, [manufacturer, devicetype, device, subdevice]);
  if (butts) {
    return /* @__PURE__ */ React.createElement("nav", {
      className: "flex flex-wrap"
    }, butts.map((row, i) => /* @__PURE__ */ React.createElement("button", {
      key: i,
      className: "m-2 p-2 bg-gray-900 rounded shadow hover:text-pink-500 focus:text-pink-500 hover:bg-black focus:bg-black",
      type: "button",
      onClick: () => {
        console.log("TODO: ", row);
        EncodeIR2(row.protocol, parseInt(row.device, 10), parseInt(row.subdevice, 10), parseInt(row.function, 10)).then(console.log);
      }
    }, row.functionname)));
  } else {
    return /* @__PURE__ */ React.createElement("p", null, "data");
  }
};
export const App = AppV2;
