import {useEffect, useState} from "../_snowpack/pkg/react.js";
import Papa from "../_snowpack/pkg/papaparse.js";
const ENDPOINT = "https://cdn.jsdelivr.net/gh/probonopd/irdb@master/codes/";
const indexRE = /^(.+)\/(.+)\/(.+),(.+)\.csv$/;
export const fetchIndex = async () => {
  const res = await fetch(ENDPOINT + "index");
  const text = await res.text();
  const accumulate = {};
  for (const line of text.split("\n")) {
    const match = line.match(indexRE);
    if (match) {
      const [, manufacturer, devicetype, device, subdevice] = match;
      const man = accumulate[manufacturer] ||= {};
      const dev = man[devicetype] ||= [];
      dev.push([device, subdevice]);
    }
  }
  return accumulate;
};
export const fetchFunctions = async (manufacturer, devicetype, device, subdevice) => {
  const path = `${ENDPOINT}${manufacturer}/${devicetype}/${device},${subdevice}.csv`;
  return new Promise((resolve) => {
    Papa.parse(path, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete(result) {
        resolve(result.data);
      }
    });
  });
};
export function useAsync(fn, deps = []) {
  const [state, setState] = useState(null);
  useEffect(() => {
    setState(null);
    let live = true;
    fn().then((v) => live && setState(v));
    return () => void (live = false);
  }, deps);
  return state;
}
