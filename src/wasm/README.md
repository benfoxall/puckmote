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


CPP changes to `EncodeIR.cpp`


```diff
diff --git a/EncodeIR.cpp b/EncodeIR.cpp
index 8e6560f..376d6be 100644
--- a/EncodeIR.cpp
+++ b/EncodeIR.cpp
@@ -2,6 +2,10 @@
 
 #include "StdAfx.h"
 #include "IRP.h"
+#include <emscripten/bind.h>
+
+using namespace emscripten;
+
 
 struct protdef {
 	const char *prot;
@@ -643,28 +647,19 @@ struct protdef protdefs[] = {
 	}
 };
 
-int main(int argc, char** argv)
-{
-	if (argc != 5)
-	{
-usage:
-		printf("Usage: encodeir <protocol> <device> <subdevice> <function>\n");
-		return -1;
-	}
-
+int encodeIR(std::string protocol, int D, int S, int F) {
 	char irp[1024] = "";
 
 	// Handle D, S, F
-	int D = atoi(argv[2]);
-	int S = atoi(argv[3]);
-	int F = atoi(argv[4]);
 	if (S >= 0)
 		sprintf(irp, "Device=%d.%d\nFunction=%d\n", D, S, F);
 	else
 		sprintf(irp, "Device=%d\nFunction=%d\n", D, F);
 
 	// Search for protocol
-	char *prot = argv[1];
+	
+	char * prot = new char [protocol.length()+1];
+	std::strcpy (prot, protocol.c_str());
 	int p = -1;
 	for (int i = 0; i < count(protdefs); i++)
 		if (strcmp(prot, protdefs[i].prot) == 0) {
@@ -723,3 +718,8 @@ usage:
 	
 	return 0;
 }
+
+
+EMSCRIPTEN_BINDINGS(encodeIR) {
+  function("encode", &encodeIR);
+}
```
