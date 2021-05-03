import { DependencyList, useEffect, useState } from "react";
import Papa from "papaparse";

const ENDPOINT = "https://cdn.jsdelivr.net/gh/probonopd/irdb@master/codes/";

const indexRE = /^(.+)\/(.+)\/(.+),(.+)\.csv$/;

interface IIndex {
  [manufacturer: string]: {
    [devicetype: string]: [device: string, subdevice: string][];
  };
}

export interface IFunction {
  functionname: string;
  protocol: string;
  device: string;
  subdevice: string;
  function: string;
}

export const fetchIndex = async () => {
  const res = await fetch(ENDPOINT + "index");
  const text = await res.text();

  const accumulate: IIndex = {};

  for (const line of text.split("\n")) {
    const match = line.match(indexRE);
    if (match) {
      const [, manufacturer, devicetype, device, subdevice] = match;

      const man = (accumulate[manufacturer] ||= {});
      const dev = (man[devicetype] ||= []);
      dev.push([device, subdevice]);
    }
  }

  return accumulate;
};

export const fetchFunctions = async (
  manufacturer: string,
  devicetype: string,
  device: string,
  subdevice: string
): Promise<IFunction[]> => {
  const path = `${ENDPOINT}${manufacturer}/${devicetype}/${device},${subdevice}.csv`;

  return new Promise((resolve) => {
    Papa.parse<IFunction>(path, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete(result) {
        resolve(result.data);
      },
    });
  });
};

export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList = []) {
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    setState(null);

    let live = true;

    fn().then((v) => live && setState(v));

    return () => void (live = false);
  }, deps);

  return state;
}
