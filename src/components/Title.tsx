import React from "react";

export const Title = () => (
  <div>
    <h1 className="text-4xl">Puckmote </h1>
    <p>
      An{" "}
      <a
        className="text-blue-500 hover:underline"
        href="https://www.espruino.com/"
      >
        Espruino
      </a>{" "}
      IR controller
    </p>
    <p>
      with codes from{" "}
      <a
        className="text-blue-500 hover:underline"
        href="https://github.com/probonopd/irdb"
      >
        irdb
      </a>
    </p>
  </div>
);
