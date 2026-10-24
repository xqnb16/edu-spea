/* The imported English–Chinese lexicon is served from this Site, never a third-party lookup endpoint. */
(function(){
'use strict';
let pending;
async function load(){if(!pending)pending=(async()=>{const response=await fetch('data/english-chinese.json.gz');if(!response.ok)throw Error('词库未载入');if(!('DecompressionStream'in window))throw Error('浏览器不支持词库解压，请更新浏览器');const data=await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).json();if(data.schema!==1||!data.entries)throw Error('词库格式错误');return data})().catch(error=>{pending=null;throw error});return pending}
window.EduDictionary={lookup:async word=>WordCore.resolve(await load(),word),load};
})();
