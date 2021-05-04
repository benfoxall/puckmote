import React, { ChangeEventHandler, FC, useEffect, useState } from "react";

import { useAsync, fetchIndex } from "../irdb";

interface Props {
  setDevices: (devices: string[]) => void;
}

export const FindDevices: FC<Props> = ({ setDevices }) => {
  const manufacturers = useAsync(fetchIndex, []) || {};

  const [manufacturer, setManufacturer] = useState<string>();
  const changeManufacturer: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setManufacturer(e.target.value);

  const types = manufacturers[manufacturer];
  const [type, setType] = useState<string>();
  const changeType: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setType(e.target.value);
  };

  const devices = types && types[type];

  useEffect(() => setDevices(devices || []), [devices]);

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
    <form className="flex space-x-4" onSubmit={submit}>
      <label className="block">
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
        <label className="block">
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
    </form>
  );
};
