(function(root){
'use strict';
function visible(courses,mode='videos',customId){return courses.filter(c=>!c.hideFromHome&&(mode==='demos'?!c.media&&c.id!==customId:!!c.media||c.id===customId))}
function partLabel(c){return c.part&&c.parts?String(c.part).padStart(2,'0')+' / '+String(c.parts).padStart(2,'0'):''}
function duration(seconds){if(!Number.isFinite(seconds))return '';return Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0')}
function page(courses,{all=false,page=1,columns=3}={}){const size=Math.max(1,Math.min(3,Math.trunc(columns)||1))*6,pages=Math.max(1,Math.ceil(courses.length/size)),current=all?Math.max(1,Math.min(pages,Math.trunc(page)||1)):1;return{items:courses.slice((current-1)*size,current*size),total:courses.length,size,pages,current}}
const api={visible,partLabel,duration,page};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.VideoCatalogCore=api;
})(typeof window!=='undefined'?window:globalThis);
