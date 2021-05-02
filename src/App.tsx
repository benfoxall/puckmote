import React, { ChangeEventHandler, useState } from "react";
import { PuckProvider, PuckStatus, usePuckRepl } from './react-puck'

import { SamsungTV } from "./data";
import { useIRDBData } from "./irdb";
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
    <div className="container mx-auto max-w-md p-8 m-8 bg-gray-200 text-black shadow-2xl rounded">
      <div className="m-4">
        <PuckStatus />
      </div>
      <h1 className="text-4xl m-4">Puckmote</h1>
      <h1 className="text-2xl m-4">Samsung</h1>
      <div className="flex flex-wrap m-2 max-w-4xl">
        {Object.entries(SamsungTV).map(([name, prontoHex]) => (
          <button key={name} onClick={() => run(prontoHex)} className="flex whitespace-nowrap items-center justify-center rounded bg-green-300 p-4 m-1 h-6 hover:bg-green-700 focus:bg-green-700 transition-all text-l font-bold">
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}


export const AppV1 = () => <PuckProvider>
  <Wrapped />
</PuckProvider>


export const AppV2 = () => {

  const manufacturers = useIRDBData()
  const [manufacturer, setManufacturer] = useState<string>()
  const changeManufacturer: ChangeEventHandler<HTMLSelectElement> = (e) => setManufacturer(e.target.value)

  const types = manufacturers[manufacturer]
  const [type, setType] = useState<string>()
  const changeType: ChangeEventHandler<HTMLSelectElement> = (e) => setType(e.target.value)

  const items = types?.[type]


  return <form className="m-5">
    <select className="bg-gray-800 m-2 p-2 rounded" onChange={changeManufacturer} value={manufacturer}>
      <option>…</option>
      {Object.keys(manufacturers).map
        (name => <option key={name}>{name}</option>)}
    </select>


    {types &&
      <select className="bg-gray-800 m-2 p-2 rounded block" onChange={changeType} value={type}>
        {Object.keys(types).map
          (name => <option key={name}>{name}</option>)}
      </select>
    }

    <ul className="bg-gray-800 m-2 my-8 p-2 rounded">
      {items?.map(([dev, subdev], i) => <li key="i">{dev}, {subdev}</li>)}
    </ul>

  </form>

}



export const App = AppV1