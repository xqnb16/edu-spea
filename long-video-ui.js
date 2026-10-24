'use strict';
(function(){
const box=document.createElement('details');box.id='continuousPractice';box.className='series-editorial';box.hidden=true;$('#lessonView .workspace').after(box);let shown='';
function render(){const c=currentCourse();box.hidden=c.kind!=='continuous';if(box.hidden){shown='';return}if(shown===c.id)return;shown=c.id;const clips=(c.practiceClipIds||[]).map(id=>catalog.find(x=>x.id===id)).filter(Boolean);box.innerHTML=`<summary>${clips.length?'分段练习与素材说明':'素材与字幕说明'}</summary>${clips.length?`<p>这段视频保留完整观看节奏；想集中练一小段，也可以使用下面的短片。原来的学习记录继续保留。</p><nav class="series-chapter-nav" aria-label="这段视频的短片练习">${clips.map(x=>`<a href="#/lesson/${x.id}">${esc(x.cn)} <span aria-hidden="true">→</span></a>`).join('')}</nav>`:''}<p>${esc(c.editorialNote||'连贯精选版；源字幕经整理，仍待逐句听辨复核。')}</p>`;}
const header=renderHeader;renderHeader=function(){header();render()};if(view==='lesson')renderHeader();
})();
