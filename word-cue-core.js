/* Word indices use the same tokenizer as the rendered transcript. */
(function(root){
'use strict';
const pattern=/[A-Za-z]+(?:['’][A-Za-z]+)?|\d+/g;
function tokens(text){return String(text).match(pattern)||[]}
function wordAtTime(line,time){
 if(time<line.start||time>=line.end)return -1;
 if(line.wordTimes?.length===tokens(line.en).length)return line.wordTimes.findIndex(c=>time>=c[0]&&time<c[1]);
 const count=tokens(line.en).length;
 return count?Math.min(count-1,Math.floor((time-line.start)/(line.end-line.start)*count)):-1;
}
function waveWindow(samples,time,step=.1,count=25){
 if(!samples?.length)return Array(count).fill(.12);
 const center=Math.floor(time/step),half=Math.floor(count/2);
 return Array.from({length:count},(_,i)=>Math.max(.08,Number(samples[center+i-half])||0));
}
const api={tokens,wordAtTime,waveWindow};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WordCueCore=api;
})(typeof window!=='undefined'?window:globalThis);
