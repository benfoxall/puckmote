import React, {useState} from "../_snowpack/pkg/react.js";
import {Device} from "./components/Device.js";
import {Choose} from "./components/Choose.js";
import {Title} from "./components/Title.js";
export const App = () => {
  const [deviceList, setDeviceList] = useState([]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "m-5 font-mono max-w-5xl"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col md:flex-row gap-8"
  }, /* @__PURE__ */ React.createElement(Title, null), /* @__PURE__ */ React.createElement(Choose, {
    onChoose: setDeviceList
  })), deviceList.map((path) => /* @__PURE__ */ React.createElement(Device, {
    key: path,
    path
  })));
};
