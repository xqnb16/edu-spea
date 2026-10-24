/* Media file catalogue. Source page URLs are never treated as playable files. */
(function(root){
'use strict';
function normalizeSource(value){
 if(!value||typeof value!=='object'||typeof value.url!=='string')return null;
 const raw=value.url.trim();let url;try{url=new URL(raw,'https://media-catalog.invalid/')}catch{return null}
 const coursePath=/^\/api\/video\/courses\/[a-z0-9-]+\/(720|1080)p-[a-f0-9]{12}\.mp4$/.test(raw);
 const relative=coursePath||/^\/?media\/[a-zA-Z0-9_./%-]+(?:\?[^#]*)?$/.test(raw)&&!raw.split(/[/?]/).includes('..');
 if(!relative&&(!/^https:\/\//i.test(raw)||url.protocol!=='https:'))return null;
 if(relative&&!coursePath&&!url.pathname.startsWith('/media/'))return null;
 if(url.username||url.password)return null;
 if(/(^|\.)(youtube\.com|youtu\.be|youtube-nocookie\.com|googlevideo\.com)$/i.test(url.hostname))return null;
 const ext=url.pathname.match(/\.(mp4|webm|ogv)$/i)?.[1]?.toLowerCase();if(!ext)return null;
 return {url:raw,type:ext==='mp4'?'video/mp4':ext==='webm'?'video/webm':'video/ogg',label:typeof value.label==='string'?value.label.slice(0,100):'站内视频源'};
}
function validateManifest(input,knownIds){if(input?.version!==1||!input.sources||typeof input.sources!=='object'||Array.isArray(input.sources))throw Error('视频源清单格式应为 version: 1 和 sources 对象。');const out={},ids=knownIds?new Set(knownIds):null;for(const [id,value]of Object.entries(input.sources)){if(!/^yt-[\w-]{11}$/.test(id)||ids&&!ids.has(id))throw Error('清单中有未知资源 ID：'+id);const source=normalizeSource(value);if(!source)throw Error('视频源需为 MP4、WebM 或 OGV 文件地址：'+id);out[id]=source}return out}
function formatTime(value){if(!Number.isFinite(value)||value<0)return '0:00';const n=Math.floor(value),h=Math.floor(n/3600),m=Math.floor(n%3600/60),s=String(n%60).padStart(2,'0');return h?`${h}:${String(m).padStart(2,'0')}:${s}`:`${m}:${s}`}
const api={normalizeSource,validateManifest,formatTime};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NativeMediaCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
