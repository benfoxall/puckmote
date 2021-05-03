## Source

https://github.com/probonopd/MakeHex/blob/master/EncodeIR.cpp

## Changes (notes)

`Makefile`

```Makefile
encodeir-wasm:
	emcc -c EncodeIR.cpp
	emcc -c IRP.cpp
	emcc EncodeIR.o IRP.o --bind -oEncodeIR.js
```

`EncodeIR.js`

Manually added at top

```js
let onRuntimeInitialized;
const ready = new Promise((resolve) => (onRuntimeInitialized = resolve));

let printer = () => {};
var Module = {
  print(val) {
    printer(val);
  },
  onRuntimeInitialized,
};

export const EncodeIR = async (protocol, D, S, F) => {
  await ready;

  let v = "";
  printer = (val) => (v = val);
  const r = Module.encode(protocol, D, S, F);

  if (r === 0) {
    return v;
  } else {
    throw new Error(v);
  }
};
```
