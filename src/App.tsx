import React, { useEffect } from "react";
import { PuckProvider, PuckStatus, usePuckConnection, usePuckRepl } from './react-puck'

import { SamsungTV } from "./data";
import { pronto } from "./lib/pronto";


const Wrapped = () => {
  const repl = usePuckRepl();

  const run = (prontoHex: string) => {
    const times = pronto(prontoHex);

    repl(`
      LED2.set();
    `);

    repl(`
        Puck.IR([${times.join(", ")}]);

        setTimeout(() => LED2.reset(), 100)
    `);
  };

  return (
    <div className="container mx-auto max-w-xl p-8 bg-gray-200">
      <div className="m-4 float-righxt">
        <PuckStatus />
      </div>
      <h1 className="text-4xl m-4">Puckmote</h1>
      <h1 className="text-2xl m-4">Samsung</h1>
      <div className="flex flex-wrap m-2 max-w-4xl">
        {Object.entries(SamsungTV).map(([name, prontoHex]) => (
          <button key={name} onClick={() => run(prontoHex)} className="flex whitespace-nowrap items-center justify-center rounded-full bg-green-300 p-4 m-1 h-6 hover:bg-green-700 focus:bg-green-700 transition-all text-l font-bold">
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export const App = () => <PuckProvider><Wrapped /></PuckProvider>
