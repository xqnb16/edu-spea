'use strict';
/* Bind real course files to the existing learning modes without replacing their behavior. */
(function(){
const originalRoute=route,originalHeader=renderHeader,sessionFiles=new Map();
const status=document.createElement('p');status.id='mediaLoadStatus';status.className='media-load-status';status.setAttribute('role','status');status.hidden=true;$('.media-box').after(status);
// Keep the legacy Blob fallback; new HD files use the private ranged endpoint.
const media=CourseMedia.create(video,{buffered:true,onStatus:message=>{status.hidden=!message;status.textContent=message;if(video.dataset.mediaSourceMode==='error')$('#retryVideo').hidden=false}});
let qualityPreference='';try{qualityPreference=localStorage.getItem('vlog-video-quality')||''}catch{}
const qualityLabel=document.createElement('label');qualityLabel.className='quality-option';qualityLabel.hidden=true;
qualityLabel.innerHTML='清晰度 <select id="videoQuality" aria-label="视频清晰度"></select>';$('.player-options').insertBefore(qualityLabel,$('#loop'));
const qualitySelect=qualityLabel.querySelector('select');
function choices(course){return CourseQuality.variants(course,window.VlogHD||{})}
function selected(course){return CourseQuality.pick(choices(course),qualityPreference)}
const switcher=CourseQuality.createSwitcher({video,loader:media,stop:()=>stopPlayback(),seek:PlaybackCore.seekWhenReady,resume:at=>playVideoLine(readGeneration,()=>{},at),isCurrent:()=>view==='lesson',onState:state=>{qualitySelect.setAttribute('aria-busy',String(state==='loading'));if(state==='error')toast('清晰度切换未完成，可重试或选择其他清晰度。')}});
qualitySelect.onchange=()=>{const course=currentCourse(),choice=choices(course).find(v=>v.id===qualitySelect.value);if(!choice)return;qualityPreference=choice.id;try{localStorage.setItem('vlog-video-quality',choice.id)}catch{}videoURL=choice.url;switcher.set(choice)};
const originalPlay=playVideoLine;
playVideoLine=function(generation,onState=()=>{},start=lines[index].start){
 if(media.pending){onState('loading','正在缓冲视频，准备好后跳到所选位置…');return media.ready.then(ok=>{if(generation!==readGeneration||view!=='lesson')return;if(ok)return originalPlay(generation,onState,start);onState('error',status.textContent);toast(status.textContent)})}
 return originalPlay(generation,onState,start);
};
$('#retryVideo').onclick=()=>{if(!videoURL)return;const choice=choices(currentCourse()).find(v=>v.url===videoURL);stopPlayback();media.load(videoURL,{buffered:choice?.buffered??true});playLine()};
window.removeEventListener('hashchange',originalRoute);
route=function(){
  let id='';try{id=decodeURIComponent(location.hash.replace(/^#\/lesson\//,''))}catch{}
  const course=catalog.find(c=>c.id===id);
  if(videoURL.startsWith('blob:'))sessionFiles.set(videoLessonId,videoURL);
  if(course?.media){
    const choice=selected(course);
    if(videoLessonId!==id||videoURL!==choice.url||media.source!==choice.url){switcher.cancel();stopPlayback();videoURL=choice.url;videoLessonId=id;video.poster='assets/'+course.photo+'.jpg';media.load(videoURL,{buffered:choice.buffered})}
  }else if(sessionFiles.has(id)){
    switcher.cancel();media.cancel();status.hidden=true;
    if(videoLessonId!==id){stopPlayback();videoURL=sessionFiles.get(id);videoLessonId=id;video.src=videoURL;video.removeAttribute('poster');video.load()}
  }else if(catalog.some(c=>c.media&&c.id===videoLessonId)&&location.hash.startsWith('#/lesson/')){
    switcher.cancel();media.cancel();status.hidden=true;
    stopPlayback();videoURL='';videoLessonId='';video.removeAttribute('src');video.removeAttribute('poster');video.load();
  }
  if(!location.hash.startsWith('#/lesson/')){switcher.cancel();media.cancel();status.hidden=true}
  originalRoute();
  if(course?.media)PlaybackCore.seekWhenReady(video,lines[index].start,()=>lessonId===course.id&&videoLessonId===course.id)
};
renderHeader=function(){originalHeader();const c=currentCourse();qualityLabel.hidden=true;if(!c.media)return;
  const options=choices(c),choice=selected(c);qualityLabel.hidden=options.length<2;qualitySelect.innerHTML=options.map(v=>`<option value="${v.id}">${esc(v.label)}</option>`).join('');qualitySelect.value=choice.id;
  $('#lessonBadge').textContent=(c.kind==='continuous'?'连贯 Vlog':'真实 Vlog')+(VideoCatalogCore.partLabel(c)?' · '+VideoCatalogCore.partLabel(c):'');
  const time=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0'),sourceTimes=c.sourceSegments?.map(s=>time(s.start)+'–'+time(s.end)).join(' / ')||time(c.sourceStart)+'–'+time(c.sourceEnd);$('#mediaCaption').textContent=c.creator+' · 原片 '+sourceTimes+' · 字幕整理版，待原声复核';
  $('#currentHint').textContent=lines[index].note;
};
window.addEventListener('hashchange',route);route();
window.addEventListener('pagehide',()=>{switcher.cancel();media.cancel()});
})();
