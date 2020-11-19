import React from "react";

import { SamsungTV } from "./data";

export const App = () => {
  const run = (hex: string) => {
    console.log("HEY", hex);
  };

  return (
    <>
      <h1>Samsung</h1>

      {Object.entries(SamsungTV).map(([name, prontoHex]) => (
        <button onClick={() => run(prontoHex)}>{name}</button>
      ))}
    </>
  );
};
