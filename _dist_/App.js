import React, {useEffect, useState} from "../web_modules/react.js";
import {fetchIRDBDevice, useIRDBData} from "./irdb.js";
import {EncodeIR as EncodeIR2} from "./wasm/EncodeIR.js";
const Puck = window.Puck;
export const App = () => {
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
  useEffect(() => {
    const current = new URLSearchParams(location.search);
    if (current.has("m")) {
      setManufacturer(current.get("m"));
    }
    if (current.has("t")) {
      setType(current.get("t"));
    }
  }, []);
  useEffect(() => {
    let params = new URLSearchParams();
    if (manufacturer) {
      params.set("m", manufacturer);
    }
    if (type) {
      params.set("t", type);
    }
    const q = params.toString();
    history.pushState({manufacturer, type}, `${manufacturer} / ${type}`, q.length ? `?${q}` : ".");
  }, [manufacturer, type]);
  return /* @__PURE__ */ React.createElement("form", {
    className: "m-5 font-mono",
    onSubmit: submit
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-4xl"
  }, "Puckmote "), /* @__PURE__ */ React.createElement("p", null, "Universal IR control for", " ", /* @__PURE__ */ React.createElement("a", {
    className: "text-blue-500 hover:underline",
    href: "https://www.espruino.com/"
  }, "Espruino")), /* @__PURE__ */ React.createElement("p", null, "With codes from", " ", /* @__PURE__ */ React.createElement("a", {
    className: "text-blue-500 hover:underline",
    href: "https://github.com/probonopd/irdb"
  }, "irdb")), /* @__PURE__ */ React.createElement("label", {
    className: "my-5 block"
  }, /* @__PURE__ */ React.createElement("div", null, "Manufacturer"), /* @__PURE__ */ React.createElement("select", {
    className: "dark:bg-gray-800 p-2 rounded",
    onChange: changeManufacturer,
    name: "m",
    value: manufacturer
  }, /* @__PURE__ */ React.createElement("option", null), Object.keys(manufacturers).map((name) => /* @__PURE__ */ React.createElement("option", {
    key: name
  }, name)))), types && /* @__PURE__ */ React.createElement("label", {
    className: "my-5 block"
  }, /* @__PURE__ */ React.createElement("div", null, "Device Type"), /* @__PURE__ */ React.createElement("select", {
    className: "dark:bg-gray-800 p-2 rounded block",
    onChange: changeType,
    name: "t",
    value: type
  }, /* @__PURE__ */ React.createElement("option", null), Object.keys(types).map((name) => /* @__PURE__ */ React.createElement("option", {
    key: name
  }, name)))), /* @__PURE__ */ React.createElement("ul", null, devices?.map(([dev, subdev], i) => /* @__PURE__ */ React.createElement("li", {
    key: i
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mx-2 mt-8 p-2 rounded text-right opacity-20"
  }, dev, " | ", subdev), /* @__PURE__ */ React.createElement("div", {
    className: "dark:bg-gray-800 bg-white p-2 rounded"
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
    }, butts.map((row, i) => /* @__PURE__ */ React.createElement(Button, {
      key: i,
      ...row
    })));
  } else {
    return /* @__PURE__ */ React.createElement("p", null, "\u2013");
  }
};
const Button = (props) => {
  const [active, setActive] = useState(false);
  const click = async () => {
    setActive(true);
    const result = await EncodeIR2(props.protocol, parseInt(props.device, 10), parseInt(props.subdevice, 10), parseInt(props.function, 10));
    const millis = result.split(" ").map(parseFloat).map((v) => v / 1e3).map((v) => v.toFixed(1));
    await Puck.write("LED3.set()\n");
    await Puck.write(`Puck.IR([${millis.join(",")}])
`);
    await Puck.write("LED3.reset()\n");
    setActive(false);
  };
  return /* @__PURE__ */ React.createElement("button", {
    className: "m-2 p-2 text-white rounded shadow transition-colors " + (active ? "bg-blue-500" : "bg-gray-900 hover:bg-black focus:bg-black focus:text-pink-500 hover:text-pink-500 focus:text-pink-500"),
    type: "button",
    onClick: click
  }, props.functionname);
};
