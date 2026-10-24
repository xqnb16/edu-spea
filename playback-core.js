/* Media readiness and cancellation are distinct from codec errors. */
(function(root){
'use strict';
const pendingSeeks=new WeakMap();
function errorMessage(error,mediaError){
  const name=error?.name,code=mediaError?.code;
  if(name==='AbortError'||code===1)return '播放已中断，点击播放按钮可重新开始。';
  if(name==='NotAllowedError')return '浏览器暂未允许播放，请点击视频画面上的播放按钮。';
  if(code===2)return '视频下载遇到网络问题，请重新加载视频。';
  if(code===3)return '浏览器未能解码这段视频，请重新加载，或换一个浏览器试试。';
  if(code===4||name==='NotSupportedError')return '未能读取可播放的视频源，请重新加载视频；也可能是连接或登录状态失效。';
  return '视频暂时未能开始播放，请重新加载后再试。';
}
function seekWhenReady(video,start,isCurrent=()=>true){
  pendingSeeks.get(video)?.();
  let cancelled=false;
  const cancel=()=>{cancelled=true;video.removeEventListener('loadedmetadata',apply);if(pendingSeeks.get(video)===cancel)pendingSeeks.delete(video)};
  const apply=()=>{
    if(cancelled)return;
    if(isCurrent()){
      const at=Number.isFinite(video.duration)?Math.min(start,Math.max(0,video.duration-.001)):start;
      if(Math.abs(video.currentTime-at)>.015)video.currentTime=at;
    }
    cancel();
  };
  pendingSeeks.set(video,cancel);
  if(video.readyState>=1)apply();else video.addEventListener('loadedmetadata',apply,{once:true});
  return cancel;
}
async function play(video,{start,rate=1,isCurrent=()=>true,onState=()=>{}}){
  let cancel=()=>{};
  try{
    if(video.error)video.load();
    cancel=seekWhenReady(video,start,isCurrent);
    video.playbackRate=rate;
    if(video.readyState<1)onState('loading','正在载入视频，准备好后开始播放…');
    // Call play in the click's activation, rather than awaiting a network event first.
    await video.play();
    if(!isCurrent())return {state:'cancelled'};
    onState('playing');return {state:'playing'};
  }catch(error){
    if(!isCurrent())return {state:'cancelled'};
    const state=error?.name==='AbortError'?'interrupted':'error';
    const message=errorMessage(error,video.error);
    onState(state,message);return {state,message};
  }finally{cancel()}
}
// Migrate the old auto-pausing default once; preserve subsequent explicit choices.
function normalizePrefs(saved={}){
 const prefs={theme:'light',gap:2,repeats:0,scope:'continuous',captions:'both',...saved};
 if(prefs.playbackVersion!==3&&prefs.scope==='single')prefs.scope='continuous';
 if(!['continuous','single','shadow'].includes(prefs.scope))prefs.scope='continuous';
 prefs.playbackVersion=3;return prefs;
}
function shouldPauseAtSentenceEnd(time,end,scope,loop){return (scope!=='continuous'||loop)&&time>=end}
// In caption gaps, prepare the upcoming sentence; keep the last cue at the end.
function lineForPosition(lines,time){
 if(!lines.length||!Number.isFinite(time))return -1;
 const at=lines.findIndex(line=>time<line.end);
 return at<0?lines.length-1:at;
}
const api={errorMessage,seekWhenReady,play,normalizePrefs,shouldPauseAtSentenceEnd,lineForPosition};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PlaybackCore=api;
})(typeof window!=='undefined'?window:globalThis);
