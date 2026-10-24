(function(root){
'use strict';
function variants(course,manifest={}){
 if(!course?.media)return [];
 const hd=(manifest[course.id]||[]).filter(v=>['720','1080'].includes(v.id)&&(root.DeploymentCore?root.DeploymentCore.trustedVideo(v.url,root.EduSpeakConfig?.mediaOrigin):/^\/api\/video\/courses\/[a-z0-9-]+\/(720|1080)p-[a-f0-9]{12}\.mp4$/.test(v.url)));
 const baseline=course.media.quality==='720'?{id:'720',label:'720p 高清',url:course.media.url,buffered:false}:{id:'360',label:hd.length?'360p 流畅':'360p',url:course.media.url,buffered:true};
 return [...hd.map(v=>({...v,buffered:false})),...hd.some(v=>v.id===baseline.id)?[]:[baseline]];
}
function pick(options,preference){return options.find(v=>v.id===preference)||options.find(v=>v.id==='720')||options[0]}
function createSwitcher({video,loader,stop,seek,resume,isCurrent=()=>true,onState=()=>{}}){
 let generation=0,snapshot=null,cleanup=()=>{};
 function cancel(){generation++;snapshot=null;cleanup();cleanup=()=>{}}
 async function set(variant){
  snapshot ||= {position:video.currentTime||0,playing:!video.paused,rate:video.playbackRate||1};
  const state=snapshot,current=++generation;cleanup();stop();onState('loading');
  const valid=()=>current===generation&&isCurrent();
  const ready=await loader.load(variant.url,{buffered:variant.buffered});
  if(!valid())return false;
  if(!ready){onState('error');return false}
  function restore(){if(!valid())return;cleanup();snapshot=null;seek(video,state.position,valid);video.playbackRate=state.rate;if(state.playing)resume(state.position);onState('ready')}
  function failed(){if(valid()){cleanup();onState('error')}}
  cleanup=()=>{video.removeEventListener('loadedmetadata',restore);video.removeEventListener('error',failed)};
  if(video.readyState>=1)restore();else{video.addEventListener('loadedmetadata',restore,{once:true});video.addEventListener('error',failed,{once:true})}
  return true;
 }
 return {set,cancel};
}
const api={variants,pick,createSwitcher};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CourseQuality=api;
})(typeof window!=='undefined'?window:globalThis);
