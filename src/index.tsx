import React from "react";
import { render } from "react-dom";
import { App } from "./App";

render(<App />, document.querySelector("#root"));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
