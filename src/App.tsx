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
      <h1 className="text-4xl m-4 text-gray-900 dark:text-white">Puckmote</h1>
      <h1 className="text-2xl m-4">Samsung</h1>
      <div className="flex flex-wrap m-2 max-w-4xl">
        {Object.entries(SamsungTV).map(([name, prontoHex]) => (
          <button key={name} onClick={() => run(prontoHex)} className="flex whitespace-nowrap items-center justify-center rounded-full bg-blue-500 hover:bg-red-700 text-white p-3 m-2 h-10 hover:bg-blue-700 focus:bg-blue-700 transition-all ">
            {name}
          </button>
        ))}
      </div>
    </>
  );
};
