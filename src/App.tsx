import React, { ChangeEventHandler, FC, useEffect, useState } from "react";

import { IFunction, fetchFunctions, useAsync, fetchIndex } from "./irdb";
import { EncodeIR } from "./wasm/EncodeIR";

const Puck = (window as any).Puck;
Puck.debug = 3;

export const App = () => {
  const manufacturers = useAsync(fetchIndex, []) || {};

  const [manufacturer, setManufacturer] = useState<string>();
  const changeManufacturer: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setManufacturer(e.target.value);

  const types = manufacturers[manufacturer];
  const [type, setType] = useState<string>();
  const changeType: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setType(e.target.value);

  const devices = types && types[type];

  const submit = (e) => {
    e.preventDefault();
    console.log("submit");
  };

  useEffect(() => {
    const current = new URLSearchParams(location.search);
    if (current.has("m")) {
      setManufacturer(current.get("m"));
    }
    if (current.has("t")) {
      setType(current.get("t"));
    }
  }, []);

  useEffect(() => {
    let params = new URLSearchParams();

    if (manufacturer) {
      params.set("m", manufacturer);
    }
    if (type) {
      params.set("t", type);
    }

    const q = params.toString();

    history.pushState(
      { manufacturer, type },
      `${manufacturer} / ${type}`,
      q.length ? `?${q}` : "."
    );
  }, [manufacturer, type]);

  return (
    <form className="m-5 font-mono" onSubmit={submit}>
      <h1 className="text-4xl">Puckmote </h1>
      <p>
        Universal IR control for{" "}
        <a
          className="text-blue-500 hover:underline"
          href="https://www.espruino.com/"
        >
          Espruino
        </a>
      </p>
      <p>
        With codes from{" "}
        <a
          className="text-blue-500 hover:underline"
          href="https://github.com/probonopd/irdb"
        >
          irdb
        </a>
      </p>

      <label className="my-5 block">
        <div>Manufacturer</div>
        <select
          className="dark:bg-gray-800 p-2 rounded"
          onChange={changeManufacturer}
          name="m"
          value={manufacturer}
        >
          <option></option>
          {Object.keys(manufacturers).map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </label>

      {types && (
        <label className="my-5 block">
          <div>Device Type</div>
          <select
            className="dark:bg-gray-800 p-2 rounded block"
            onChange={changeType}
            name="t"
            value={type}
          >
            <option></option>
            {Object.keys(types).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
      )}

      <ul>
        {devices &&
          devices.map(([dev, subdev], i) => (
            <li key={i}>
              <div className="mx-2 mt-8 p-2 rounded text-right opacity-20">
                {dev} | {subdev}
              </div>
              <div className="dark:bg-gray-800 bg-white p-2 rounded">
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
  const funtions = useAsync(
    () => fetchFunctions(manufacturer, devicetype, device, subdevice),
    [manufacturer, devicetype, device, subdevice]
  );

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
