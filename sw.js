if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return s[e]||(r=new Promise(async r=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=r}else importScripts(e),r()})),r.then(()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]})},r=(r,s)=>{Promise.all(r.map(e)).then(e=>s(1===e.length?e[0]:e))},s={require:Promise.resolve(r)};self.define=(r,i,d)=>{s[r]||(s[r]=Promise.resolve().then(()=>{let s={};const o={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return s;case"module":return o;default:return e(r)}})).then(e=>{const r=d(...e);return s.default||(s.default=r),s})}))}}define("./sw.js",["./workbox-69b5a3b7"],(function(e){"use strict";self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.precacheAndRoute([{url:"__snowpack__/env.js",revision:"303f8e8516cdfb0a447e7a9dc7c57a3b"},{url:"_dist_/App.js",revision:"e3cf09c55a54e58dd50a8e9f4c0bba35"},{url:"_dist_/data.js",revision:"5fecc02a28c84054b68177f89d34d854"},{url:"_dist_/index.js",revision:"d18dfda41ede44a1f22737e1d4d2508d"},{url:"_dist_/lib/pronto.js",revision:"77b5de3025ec041dc0caa39f6ae93648"},{url:"_dist_/puck.js",revision:"d2bb3ea9185aacb9dcce2f31868fe957"},{url:"_dist_/react-puck.js",revision:"5b76b0eef9af8a2300673e0553f609f9"},{url:"index.html",revision:"8d58575a6f39cff6914c6cf352787078"},{url:"web_modules/common/index-e66f0a38.js",revision:"ee270837be8919fda4983b1daa884888"},{url:"web_modules/import-map.json",revision:"047bf1284780f83cb4918c8bc421d682"},{url:"web_modules/react-dom.js",revision:"048dfd07c3966f28523e43e149ff2445"},{url:"web_modules/react.js",revision:"9883504f72ecae55eac5d03dc01f6649"}],{})}));
//# sourceMappingURL=sw.js.map
