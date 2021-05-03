import React, { ChangeEventHandler, FC, useEffect, useState } from "react";
import { PuckProvider, PuckStatus, usePuckRepl } from "./react-puck";

import { SamsungTV } from "./data";
import { CSVRow, fetchIRDBDevice, useIRDBData } from "./irdb";
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
          <button
            key={name}
            onClick={() => run(prontoHex)}
            className="flex whitespace-nowrap items-center justify-center rounded bg-green-300 p-4 m-1 h-6 hover:bg-green-700 focus:bg-green-700 transition-all text-l font-bold"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export const AppV1 = () => (
  <PuckProvider>
    <Wrapped />
  </PuckProvider>
);

import { EncodeIR } from "./wasm/EncodeIR";
EncodeIR("NECx1", 0, 191, 3).then(console.log);

export const AppV2 = () => {
  const manufacturers = useIRDBData();
  const [manufacturer, setManufacturer] = useState<string>();
  const changeManufacturer: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setManufacturer(e.target.value);

  const types = manufacturers[manufacturer];
  const [type, setType] = useState<string>();
  const changeType: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setType(e.target.value);

  const devices = types?.[type];

  const submit = (e) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <form className="m-5 font-mono" onSubmit={submit}>
      <select
        className="bg-gray-800 m-2 p-2 rounded"
        onChange={changeManufacturer}
        name="m"
        value={manufacturer}
      >
        <option>…</option>
        {Object.keys(manufacturers).map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>

      {types && (
        <select
          className="bg-gray-800 m-2 p-2 rounded block"
          onChange={changeType}
          name="t"
          value={type}
        >
          <option>…</option>
          {Object.keys(types).map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      )}

      <ul>
        {devices?.map(([dev, subdev], i) => (
          <li key={i}>
            <div className="mx-2 mt-8 p-2 rounded text-right opacity-20">
              {dev} | {subdev}
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <Device
                manufacturer={manufacturer}
                devicetype={type}
                device={dev}
                subdevice={subdev}
              />
            </div>
          </li>
        ))}
      </ul>
    </form>
  );
};

const Device: FC<{
  manufacturer: string;
  devicetype: string;
  device: string;
  subdevice: string;
}> = ({ manufacturer, devicetype, device, subdevice }) => {
  const [butts, setButts] = useState<CSVRow[]>();

  useEffect(() => {
    setButts([]);
    fetchIRDBDevice(manufacturer, devicetype, device, subdevice).then(setButts);
  }, [manufacturer, devicetype, device, subdevice]);

  if (butts) {
    return (
      <nav className="flex flex-wrap">
        {butts.map((row, i) => (
          <button
            key={i}
            className="m-2 p-2 bg-gray-900 rounded shadow hover:text-pink-500 focus:text-pink-500 hover:bg-black focus:bg-black"
            type="button"
            onClick={() => {
              console.log("TODO: ", row);

              // D, S, F
              EncodeIR(
                row.protocol,
                parseInt(row.device, 10),
                parseInt(row.subdevice, 10),
                parseInt(row.function, 10)
              ).then(console.log);
            }}
          >
            {row.functionname}
          </button>
        ))}
      </nav>
    );
  } else {
    return <p>data</p>;
  }
};

export const App = AppV2;
