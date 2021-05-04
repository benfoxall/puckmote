import React, { useState } from "react";
import { Device } from "./components/Device";
import { Choose } from "./components/Choose";
import { Title } from "./components/Title";

export const App = () => {
  const [deviceList, setDeviceList] = useState<string[]>([]);

  return (
    <div className="m-5 font-mono max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        <Title />
        <Choose onChoose={setDeviceList} />
      </div>

      {deviceList.map((path) => (
        <Device key={path} path={path} />
      ))}
    </div>
  );
};
