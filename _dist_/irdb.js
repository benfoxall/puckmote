import {useEffect, useState} from "../web_modules/react.js";
import Papa from "../web_modules/papaparse.js";
const ENDPOINT = "https://cdn.jsdelivr.net/gh/probonopd/irdb@master/codes/";
const re = /^(?<manufacturer>.+)\/(?<devicetype>.+)\/(?<device>.+),(?<subdevice>.+)\.csv$/;
const fetchIRDBIndex = async () => {
  const res = await fetch(ENDPOINT + "index");
  const text = await res.text();
  const data = {};
  for (const line of text.split("\n")) {
    const match = line.match(re);
    if (match) {
      const device = match.groups;
      const man = data[device.manufacturer] ||= {};
      const dev = man[device.devicetype] ||= [];
      dev.push([device.device, device.subdevice]);
    }
  }
  return data;
};
export const useIRDBData = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    fetchIRDBIndex().then(setData);
  }, []);
  return data;
};
export const fetchIRDBDevice = async (manufacturer, devicetype, device, subdevice) => {
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
