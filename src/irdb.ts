import { useEffect, useState } from "react";
import Papa from "papaparse";

const ENDPOINT = "https://cdn.jsdelivr.net/gh/probonopd/irdb@master/codes/";

const re = /^(?<manufacturer>.+)\/(?<devicetype>.+)\/(?<device>.+),(?<subdevice>.+)\.csv$/;

interface REGroups extends RegExpMatchArray {
  groups: {
    manufacturer: string;
    devicetype: string;
    device: string;
    subdevice: string;
  };
}

type IIRDBDATA = {
  [manufacturer: string]: {
    [devicetype: string]: [device: string, subdevice: string][];
  };
};

const fetchIRDBIndex = async () => {
  const res = await fetch(ENDPOINT + "index");
  const text = await res.text();

  const data: IIRDBDATA = {};

  for (const line of text.split("\n")) {
    const match = line.match(re) as REGroups;
    if (match) {
      const device = match.groups;

      const man = (data[device.manufacturer] ||= {});
      const dev = (man[device.devicetype] ||= []);
      dev.push([device.device, device.subdevice]);
    }
  }

  return data;
};

export const useIRDBData = () => {
  const [data, setData] = useState<IIRDBDATA>({});

  useEffect(() => {
    fetchIRDBIndex().then(setData);
  }, []);

  return data;
};

// INPUT SOURCE,NECx2,7,7,1
export interface CSVRow {
  device: string;
  function: string;
  functionname: string;
  protocol: string;
  subdevice: string;
}

export const fetchIRDBDevice = async (
  manufacturer: string,
  devicetype: string,
  device: string,
  subdevice: string
): Promise<CSVRow[]> => {
  const path = `${ENDPOINT}${manufacturer}/${devicetype}/${device},${subdevice}.csv`;

  return new Promise((resolve) => {
    Papa.parse<CSVRow>(path, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete(result) {
        resolve(result.data);
      },
    });
  });
};
