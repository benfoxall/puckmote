import React, { useState } from "react";
import { Device } from "./components/Device";
import { FindDevices } from "./components/FindDevices";
import { Title } from "./components/Title";

export const App = () => {
  const [deviceList, setDeviceList] = useState<string[]>([]);

  return (
    <div className="m-5 font-mono max-w-5xl">
      <div className="grid md:grid-flow-col gap-8">
        <Title />
        <FindDevices setDevices={setDeviceList} />
      </div>

      <hr className="my-5" />

      {deviceList.map((path) => (
        <Device key={path} path={path} />
      ))}
    </div>
  );
};
