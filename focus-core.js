(function(root){
'use strict';
function videoHeight({height,width,overhead,mobile}){
 const natural=width*9/16;
 // Captions may grow; on a phone they must not squeeze the picture into a strip.
 if(mobile)return Math.round(Math.max(96,Math.min(natural,height*(height<500?.56:.48),430)));
 return Math.round(Math.max(96,Math.min(natural,520,height-overhead-28)));
}
const api={videoHeight};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FocusCore=api;
})(typeof window!=='undefined'?window:globalThis);
