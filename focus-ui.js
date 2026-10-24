'use strict';
/* Keep one complete video/caption group in view; exercises follow it. */
(function(){
// Routes already choose their own entry position; do not restore an old caption offset.
if('scrollRestoration' in history)history.scrollRestoration='manual';
const column=$('.media-column'),practice=$('.practice-column'),player=$('.player');
const focus=document.createElement('section');focus.className='lesson-focus';focus.tabIndex=-1;focus.setAttribute('aria-label','视频与同步双语字幕');
focus.innerHTML='<div class="focus-heading"><a id="focusBack" href="#/">← 视频首页</a><span id="focusTitle"></span></div>';
column.prepend(focus);
for(const selector of ['.media-box','#mediaLoadStatus','.lesson-seek','.player-actions','.audio-readout','#liveSubtitles','#captionPrivacy'])focus.append($(selector));
// Attribution and all detailed playback controls remain available in the settings.
$('.playback-settings-panel').append($('#mediaCaption'));
focus.after(player);
for(const selector of ['.lesson-note','.lesson-assessment','.import-shortcut']){const node=column.querySelector(selector);if(node)practice.append(node)}
let pending=0,first=true,lastHeight=0;
function fit(){
 pending=0;if(view!=='lesson')return;
 const media=video.hidden?$('#demoCover'):video;
 const height=window.visualViewport?.height||innerHeight,width=focus.clientWidth;
 if(!width)return;
 const overhead=focus.getBoundingClientRect().height-media.getBoundingClientRect().height;
 const next=FocusCore.videoHeight({height,width,overhead,mobile:innerWidth<=760});
 if(Math.abs(next-lastHeight)>=1){focus.style.setProperty('--focus-video-height',next+'px');lastHeight=next}
 document.documentElement.style.setProperty('--focus-caption-space',Math.ceil(focus.getBoundingClientRect().height+16)+'px');
}
function schedule(){if(!pending)pending=requestAnimationFrame(fit)}
new ResizeObserver(schedule).observe($('#liveSubtitles'));
new ResizeObserver(schedule).observe(focus);
window.addEventListener('resize',schedule);window.visualViewport?.addEventListener('resize',schedule);
document.fonts?.ready.then(schedule);video.addEventListener('loadedmetadata',schedule);
const header=renderHeader;renderHeader=function(){header();const c=currentCourse();$('#focusTitle').textContent=c.cn||c.title;$('#focusBack').href='#/videos';schedule()};
const beforeView=LearningUI.onView;LearningUI.onView=function(next){beforeView(next);document.body.classList.toggle('lesson-is-open',next==='lesson');if(next==='lesson')schedule()};
function reveal(moveFocus=true){fit();if(moveFocus)focus.focus({preventScroll:true});focus.scrollIntoView({block:'start',behavior:'instant'});schedule()}
window.addEventListener('click',e=>{
 if(view==='lesson'&&e.target.closest('[data-mode],#lessonStudyGuide>summary')){reveal(false);return}
 if(view!=='lesson'||(innerWidth>760&&innerHeight>500))return;
 if(e.target.closest('[data-line]'))reveal();
 else if(e.target.closest('.lesson-focus .player-actions'))reveal(false);
});
const previous=route;window.removeEventListener('hashchange',previous);
route=function(){
 let incoming='';try{incoming=decodeURIComponent(location.hash.replace(/^#\/lesson\//,''))}catch{}
 const entering=location.hash.startsWith('#/lesson/')&&(first||view!=='lesson'||incoming!==lessonId);
 if(entering)LearningUI.beginLessonPractice();
 previous();first=false;
 if(entering&&view==='lesson')reveal();
};
window.addEventListener('hashchange',route);route();
})();
