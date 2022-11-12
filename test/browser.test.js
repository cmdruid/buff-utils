!function(e){"use strict";const t={null:e=>null===e,undefined:e=>void 0===e,hex:e=>function(e){switch(!0){case"string"!=typeof e:case/[^0-9a-fA-F]/.test(e):case e.length%2!=0:return!1;default:return!0}}(e),string:e=>"string"==typeof e,infinity:e=>e===1/0,bigint:e=>"bigint"==typeof e,number:e=>"number"==typeof e,class:e=>"object"==typeof e?.prototype&&e.toString().startsWith("class"),function:e=>"function"==typeof e,uint8:e=>e instanceof Uint8Array,uint16:e=>e instanceof Uint16Array,uint32:e=>e instanceof Uint32Array,buffer:e=>e instanceof ArrayBuffer,array:e=>Array.isArray(e),object:e=>"object"==typeof e};var n={of:e=>{for(const[n,r]of Object.entries(t))if(!0===r(e))return n;return"unknown"},array:{isString:e=>e.every((e=>t.string(e))),isNumber:e=>e.every((e=>t.number(e))),isBigint:e=>e.every((e=>t.bigint(e)))},is:t};const r=/[\p{Lu}]/u,s=/[\p{Ll}]/u,o=/^[\p{Lu}](?![\p{Lu}])/gu,i=/([\p{Alpha}\p{N}_]|$)/u,c=/[_.\- ]+/,a=new RegExp("^"+c.source),l=new RegExp(c.source+i.source,"gu"),u=new RegExp("\\d+"+i.source,"gu");function f(e,t){if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");if(t={pascalCase:!1,preserveConsecutiveUppercase:!1,...t},0===(e=Array.isArray(e)?e.map((e=>e.trim())).filter((e=>e.length)).join("-"):e.trim()).length)return"";const n=!1===t.locale?e=>e.toLowerCase():e=>e.toLocaleLowerCase(t.locale),i=!1===t.locale?e=>e.toUpperCase():e=>e.toLocaleUpperCase(t.locale);if(1===e.length)return c.test(e)?"":t.pascalCase?i(e):n(e);return e!==n(e)&&(e=((e,t,n)=>{let o=!1,i=!1,c=!1;for(let a=0;a<e.length;a++){const l=e[a];o&&r.test(l)?(e=e.slice(0,a)+"-"+e.slice(a),o=!1,c=i,i=!0,a++):i&&c&&s.test(l)?(e=e.slice(0,a-1)+"-"+e.slice(a-1),c=i,i=!1,o=!0):(o=t(l)===l&&n(l)!==l,c=i,i=n(l)===l&&t(l)!==l)}return e})(e,n,i)),e=e.replace(a,""),e=t.preserveConsecutiveUppercase?((e,t)=>(o.lastIndex=0,e.replace(o,(e=>t(e)))))(e,n):n(e),t.pascalCase&&(e=i(e.charAt(0))+e.slice(1)),((e,t)=>(l.lastIndex=0,u.lastIndex=0,e.replace(l,((e,n)=>t(n))).replace(u,(e=>t(e)))))(e,i)}var p="@cmdcode/bytes-utils";const g="src/index.js";let y;async function d(e){y=e;const t=f(String("/"+p).split("/").at(-1)),n=await async function(e){if("undefined"!=typeof window)return window[e];const t=process?.argv&&process.argv.length>2?process.argv.slice(2,3):g;if(String(t).includes("main"))throw new Error("Unable to run tests on a commonJs module!");return console.log(`Testing package: ${t}`),import("../"+t).then((e=>e.default?e.default:e))}(t);w(n)}function w(e,t=[]){for(const[r,s]of Object.entries(e))if(n.is.class(s)){const e=[...t,r];b(s,e),w(s,e),console.log("Registering tests for class:",r)}else if(n.is.function(s))h(r,s,t);else if(n.is.object(s)){w(s,[...t,r])}else console.log(t,s)}function b(e,t){const n=[...t,"new"];for(const t of Object.getOwnPropertyNames(e.prototype))h(t,e,n)}function h(e,t,n){const r=`./src/${n.join("/").toLowerCase()}/${e}.test.js`;import(r).then((e=>function(e,t,n){y.test(`Testing: ${n}`,(n=>{e(n,t)}))}(e.default,t,r))).catch((e=>e))}e("Testing API",(async e=>{await d(e)}))}(tape);
