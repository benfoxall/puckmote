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
      <h1 className="text-4xl p-4">Puckmote</h1>
      <h1 className="text-2xl p-4">Samsung</h1>
      <div className="flex flex-wrap p-4">
        {Object.entries(SamsungTV).map(([name, prontoHex]) => (
          <button key={name} onClick={() => run(prontoHex)} className="flex whitespace-nowrap items-center justify-center rounded-full bg-purple-700 hover:bg-red-700 text-white p-3 m-2 h-10 hover:bg-red-700">
            {name}
          </button>
        ))}
      </div>
    </>
  );
};
