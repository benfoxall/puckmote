if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise(async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()})),s.then(()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]})},s=(s,r)=>{Promise.all(s.map(e)).then(e=>r(1===e.length?e[0]:e))},r={require:Promise.resolve(s)};self.define=(s,c,d)=>{r[s]||(r[s]=Promise.resolve().then(()=>{let r={};const i={uri:location.origin+s.slice(1)};return Promise.all(c.map(s=>{switch(s){case"exports":return r;case"module":return i;default:return e(s)}})).then(e=>{const s=d(...e);return r.default||(r.default=s),r})}))}}define("./sw.js",["./workbox-0fadee50"],(function(e){"use strict";self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.precacheAndRoute([{url:"__snowpack__/env.js",revision:"303f8e8516cdfb0a447e7a9dc7c57a3b"},{url:"_dist_/App.js",revision:"0f0b740ccc0307bdd1a2f0df73103efe"},{url:"_dist_/index.js",revision:"d18dfda41ede44a1f22737e1d4d2508d"},{url:"_dist_/irdb.js",revision:"9cdcc3e6ecaea4a10ebe0acd4f8e315f"},{url:"_dist_/wasm/EncodeIR.js",revision:"254b2b62f55ca880e42542f4cc476c23"},{url:"index.html",revision:"1e62246ac933a9f4e7a14269c8768d0f"},{url:"web_modules/common/_commonjsHelpers-eb5a497e.js",revision:"7565eaf1d1bd054fa664bd5b46f90321"},{url:"web_modules/common/index-d0e3fe20.js",revision:"656c3f6f4e4ee9961bd7d77c19d87f07"},{url:"web_modules/import-map.json",revision:"25aef362890ff194fed76dfec61efc84"},{url:"web_modules/papaparse.js",revision:"5786cac6a8f53411b54d78a151cc8ec2"},{url:"web_modules/react-dom.js",revision:"5aebf6d9c7282e4defbe68170ac87c7c"},{url:"web_modules/react.js",revision:"53f405ad98fc6436503ce7c46d2bfcae"}],{}),e.registerRoute(/cdn\.jsdelivr\.net/,new e.CacheFirst,"GET")}));
//# sourceMappingURL=sw.js.map
