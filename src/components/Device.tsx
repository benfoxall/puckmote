import React, { FC, useEffect, useRef, useState } from "react";

import { IFunction, fetchDevice, useAsync } from "../irdb";
import { EncodeIR } from "../wasm/EncodeIR";

const Puck = (window as any).Puck;
Puck.debug = 3;

interface Props {
  path: string;
}

export const Device: FC<Props> = ({ path }) => {
  const fns = useAsync(() => fetchDevice(path), [path]);
  const [fn, setFn] = useState<IFunction>();

  const trigger = async (fn: IFunction, send: boolean) => {
    setFn(fn);

    if (send) await emit(fn);
  };

  return (
    <>
      <div className="m-2 mt-8 flex justify-between gap-4 flex-col md:flex-row">
        <div>
          <FnVis fn={fn} />
        </div>
        <div className="opacity-20">{path}</div>
      </div>

      <div className="dark:bg-gray-800 bg-white p-2 rounded">
        {fns && (
          <nav className="flex flex-wrap">
            {fns.map((fn, i) => (
              <Button key={i} fn={fn} trigger={trigger} />
            ))}
          </nav>
        )}
      </div>
    </>
  );
};

interface ButtonProps {
  fn: IFunction;
  trigger: (fn: IFunction, emit?: boolean) => Promise<void>;
}

const Button: FC<ButtonProps> = ({ fn, trigger }) => {
  const [active, setActive] = useState(false);

  const click = async () => {
    setActive(true);

    await trigger(fn, true);

    setActive(false);
  };

  const enter = () => trigger(fn, false);

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
      onMouseEnter={enter}
    >
      {fn.functionname}
    </button>
  );
};

const FnVis: FC<{ fn?: IFunction }> = ({ fn }) => {
  const [m, setM] = useState<number[]>([]);

  useEffect(() => {
    if (fn) decode(fn).then(setM);
  }, [fn]);

  let x = 0;
  const scale = 3; //hackkk

  const text = fn
    ? `${fn.protocol} ${fn.device} ${fn.subdevice} ${fn.function}`
    : "–";

  return (
    <div className="flex flex-col">
      <div>{text}</div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="5"
        style={{ width: "100%" }}
      >
        {m.map((val, i) => {
          const p = x;

          x += val;

          if (i % 2) return null;

          return (
            <rect
              key={i}
              x={p * scale}
              width={val * scale}
              fill="currentColor"
              height="10"
            />
          );
        })}
      </svg>
    </div>
  );
};

///

const decode = async (fn: IFunction) => {
  const result: string = await EncodeIR(
    fn.protocol,
    parseInt(fn.device, 10),
    parseInt(fn.subdevice, 10),
    parseInt(fn.function, 10)
  );

  return result
    .split(" ")
    .map(parseFloat)
    .map((v) => v / 1000);
};

// the last pressed button
let last: IFunction = null;

const emit = async (fn: IFunction) => {
  if (last === fn) {
    await Puck.write(
      "repeat();\nLED2.set();setTimeout(() => LED2.reset(), 500)\n"
    );
  } else {
    last = fn;

    const millis = await decode(fn);

    await Puck.write(`    
        LED3.set();
        function repeat() {
          Puck.IR([${millis.map((n) => n.toFixed(2)).join(",")}])
        };
        repeat();
        LED3.reset();
      `);
  }
};
