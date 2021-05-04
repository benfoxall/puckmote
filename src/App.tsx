import React, { ChangeEventHandler, FC, useEffect, useState } from "react";
import { FindDevices } from "./components/FindDevices";

import { IFunction, fetchFunctions, useAsync, fetchIndex } from "./irdb";
import { EncodeIR } from "./wasm/EncodeIR";

const Puck = (window as any).Puck;
Puck.debug = 3;

export const App = () => {
  const [deviceList, setDeviceList] = useState<string[]>([]);

  return (
    <div className="m-5 font-mono">
      <h1 className="text-4xl">Puckmote </h1>
      <p>
        Use an{" "}
        <a
          className="text-blue-500 hover:underline"
          href="https://www.espruino.com/"
        >
          Espruino
        </a>{" "}
        as a IR control
      </p>
      <p>
        with codes from{" "}
        <a
          className="text-blue-500 hover:underline"
          href="https://github.com/probonopd/irdb"
        >
          irdb
        </a>
      </p>

      <FindDevices setDevices={setDeviceList} />

      <ul>
        {deviceList.map((path) => (
          <li key={path}>
            <div className="mx-2 mt-8 p-2 rounded text-right opacity-20">
              {path}
            </div>
            <div className="dark:bg-gray-800 bg-white p-2 rounded">
              <Device path={path} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Device: FC<{
  path: string;
}> = ({ path }) => {
  const funtions = useAsync(() => fetchFunctions(path), [path]);

  if (funtions) {
    return (
      <nav className="flex flex-wrap">
        {funtions.map((row, i) => (
          <Button key={i} {...row} />
        ))}
      </nav>
    );
  } else {
    return <p>–</p>;
  }
};

let last: IFunction = null;

const Button: FC<IFunction> = (props) => {
  const [active, setActive] = useState(false);

  const click = async () => {
    setActive(true);

    if (last === props) {
      await Puck.write(
        "repeat();\nLED2.set();setTimeout(() => LED2.reset(), 500)\n"
      );
      setActive(false);
      return;
    }

    const result: string = await EncodeIR(
      props.protocol,
      parseInt(props.device, 10),
      parseInt(props.subdevice, 10),
      parseInt(props.function, 10)
    );

    const millis = result
      .split(" ")
      .map(parseFloat)
      .map((v) => v / 1000)
      .map((v) => v.toFixed(1));

    await Puck.write(`    
    LED3.set();
    function repeat() {
      Puck.IR([${millis.join(",")}])
    };
    repeat();
    LED3.reset();
    `);

    last = props;

    setActive(false);
  };

  return (
    <button
      className={
        "m-2 p-2 text-white rounded shadow transition-colors " +
        (active
          ? "bg-blue-500"
          : "bg-gray-900 hover:bg-black focus:bg-black focus:text-pink-500 hover:text-pink-500 focus:text-pink-500")
      }
      type="button"
      onClick={click}
    >
      {props.functionname}
    </button>
  );
};
