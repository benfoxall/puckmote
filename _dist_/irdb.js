import {useEffect, useState} from "../web_modules/react.js";
const ENDPOINT = "https://cdn.jsdelivr.net/gh/probonopd/irdb@master/codes/index";
const re = /^(?<manufacturer>.+)\/(?<devicetype>.+)\/(?<device>.+),(?<subdevice>.+)\.csv$/;
const fetchIRDBData = async () => {
  const res = await fetch(ENDPOINT);
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
    fetchIRDBData().then(setData);
  }, []);
  return data;
};
