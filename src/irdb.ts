import { useEffect, useState } from "react";

const ENDPOINT = 'https://cdn.jsdelivr.net/gh/probonopd/irdb@master/codes/index';

const re = /^(?<manufacturer>.+)\/(?<devicetype>.+)\/(?<device>.+),(?<subdevice>.+)\.csv$/

interface Device {
  manufacturer: string;
  devicetype: string;
  device: string;
  subdevice: string;
}

type IIRDBDATA = {
  [manufacturer: string]: {
    [devicetype: string]: [device: string, subdevice: string][]
  }
}


const fetchIRDBData = async () => {

  const res = await fetch(ENDPOINT)
  const text = await res.text()


  const data: IIRDBDATA = {}

  for (const line of text.split("\n")) {
    const match = line.match(re)
    if (match) {
      const device = match.groups as any as Device

      const man = data[device.manufacturer] ||= {}
      const dev = man[device.devicetype] ||= []
      dev.push([device.device, device.subdevice])

    }
  }

  return data;

}

export const useIRDBData = () => {
  const [data, setData] = useState<IIRDBDATA>({})

  useEffect(() => {
    fetchIRDBData().then(setData)
  }, [])

  return data
}
