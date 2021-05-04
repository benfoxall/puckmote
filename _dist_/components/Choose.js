import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useAsync, fetchIndex} from "../irdb.js";
export const Choose = ({onChoose: setDevices}) => {
  const manufacturers = useAsync(fetchIndex, []) || {};
  const [manufacturer, setManufacturer] = useState();
  const changeManufacturer = (e) => setManufacturer(e.target.value);
  const types = manufacturers[manufacturer];
  const [type, setType] = useState();
  const changeType = (e) => {
    setType(e.target.value);
  };
  const devices = types && types[type];
  useEffect(() => setDevices(devices || []), [devices]);
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
    className: "flex flex-col md:flex-row gap-8",
    onSubmit: submit
  }, /* @__PURE__ */ React.createElement("label", {
    className: "block"
  }, /* @__PURE__ */ React.createElement("div", null, "Manufacturer"), /* @__PURE__ */ React.createElement("select", {
    className: "dark:bg-gray-800 p-2 rounded",
    onChange: changeManufacturer,
    name: "m",
    value: manufacturer
  }, /* @__PURE__ */ React.createElement("option", null), Object.keys(manufacturers).map((name) => /* @__PURE__ */ React.createElement("option", {
    key: name
  }, name)))), types && /* @__PURE__ */ React.createElement("label", {
    className: "block"
  }, /* @__PURE__ */ React.createElement("div", null, "Device Type"), /* @__PURE__ */ React.createElement("select", {
    className: "dark:bg-gray-800 p-2 rounded block",
    onChange: changeType,
    name: "t",
    value: type
  }, /* @__PURE__ */ React.createElement("option", null), Object.keys(types).map((name) => /* @__PURE__ */ React.createElement("option", {
    key: name
  }, name)))));
};
