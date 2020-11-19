import React from "react";

import { SamsungTV } from "./data";
import { pronto } from "./lib/pronto";

export const App = () => {
  const run = (prontoHex: string) => {
    const times = pronto(prontoHex);

    //@ts-ignore
    Puck.write(`
        LED2.set();

        Puck.IR([${times.join(", ")}]);

        setTimeout(() => LED2.reset(), 100)
    `);
  };

  return (
    <>
      <h1>Samsung</h1>

      {Object.entries(SamsungTV).map(([name, prontoHex]) => (
        <button key={name} onClick={() => run(prontoHex)}>
          {name}
        </button>
      ))}
    </>
  );
};
