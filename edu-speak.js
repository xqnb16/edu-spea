'use strict';
/* Independently authored presentation; routing, progress and media stay with the learning app. */
(function(){
const hero=document.querySelector('#homeHero');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const slides=[...hero.querySelectorAll('[data-hero-slide]')],dots=[...hero.querySelectorAll('[data-hero-index]')],pause=hero.querySelector('#heroPause');
function syncPause(state){pause.setAttribute("aria-pressed",String(state.paused));const label=state.paused?"继续自动轮播":"暂停自动轮播";pause.setAttribute("aria-label",label);pause.textContent=label;hero.dataset.rotating=String(state.running)}
const rotation=EduHeroCore.rotation({count:slides.length,onStateChange:syncPause,onChange(index,manual){slides.forEach((slide,n)=>{slide.classList.toggle('is-active',n===index);slide.inert=n!==index;slide.setAttribute('aria-hidden',String(n!==index));const img=slide.querySelector('img');if(n===index||n===(index+1)%slides.length)img.loading='eager'});dots.forEach((dot,n)=>dot.setAttribute('aria-pressed',String(n===index)));hero.querySelector('#heroCount').textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');if(manual)hero.querySelector('#heroAnnouncement').textContent='第 '+(index+1)+' 张，'+slides[index].querySelector('.hero-slide-title').textContent}});
dots.forEach(dot=>dot.addEventListener('click',()=>rotation.show(Number(dot.dataset.heroIndex),false)));
pause.addEventListener('click',()=>{if(rotation.paused)rotation.resume();else rotation.pause()});
hero.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();rotation.show(rotation.index+(event.key==='ArrowLeft'?-1:1),false)});
hero.addEventListener('focusin',()=>rotation.block('focus',true));hero.addEventListener('focusout',()=>requestAnimationFrame(()=>rotation.block('focus',hero.contains(document.activeElement))));
let touch=null;hero.addEventListener('touchstart',event=>{if(event.touches.length!==1)return;touch={x:event.touches[0].clientX,y:event.touches[0].clientY};rotation.block('touch',true)},{passive:true});
hero.addEventListener('touchend',event=>{const point=event.changedTouches[0];if(touch&&point){const dx=point.clientX-touch.x,dy=point.clientY-touch.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.3)rotation.show(rotation.index+(dx<0?1:-1),false)}touch=null;rotation.block('touch',false)},{passive:true});
hero.addEventListener('touchcancel',()=>{touch=null;rotation.block('touch',false)},{passive:true});
function visibility(){rotation.block('page',document.hidden);rotation.block('route',!document.body.classList.contains('is-home'))}
document.addEventListener('visibilitychange',visibility);window.addEventListener('hashchange',visibility);reduce.addEventListener('change',()=>{if(reduce.matches)rotation.pause()});
if('IntersectionObserver'in window)new IntersectionObserver(entries=>rotation.block('offscreen',!entries[0].isIntersecting),{threshold:.2}).observe(hero);
if(reduce.matches)rotation.pause();visibility();rotation.start();
// The selected lens moves within the existing navigation, not over its hit areas.
function lensGroup(group,selector){
 const lens=document.createElement('span');lens.className='lens-indicator';lens.setAttribute('aria-hidden','true');group.prepend(lens);group.classList.add('lens-group');let pending=0;
 function move(){pending=0;const active=group.querySelector(selector);if(!active||!group.clientWidth){lens.style.opacity='0';return}const a=active.getBoundingClientRect(),g=group.getBoundingClientRect();lens.style.width=a.width+'px';lens.style.height=a.height+'px';lens.style.transform='translate3d('+(a.left-g.left+group.scrollLeft)+'px,'+(a.top-g.top+group.scrollTop)+'px,0)';lens.style.opacity='1'}
 function update(){if(!pending)pending=requestAnimationFrame(move)}
 new MutationObserver(update).observe(group,{subtree:true,attributes:true,attributeFilter:['aria-current','aria-selected','aria-pressed']});new ResizeObserver(update).observe(group);group.addEventListener('scroll',update,{passive:true});window.addEventListener('hashchange',update);document.fonts?.ready.then(update);update();
}
const nav=document.querySelector('.site-header nav');if(nav)lensGroup(nav,'a[aria-current="page"]');
if(nav){function hint(){const more=nav.scrollWidth-nav.clientWidth-nav.scrollLeft>3;nav.dataset.more=String(more);nav.setAttribute('aria-label',nav.scrollWidth>nav.clientWidth+3?'全站导航，可左右滑动':'全站导航')}new ResizeObserver(hint).observe(nav);nav.addEventListener('scroll',hint,{passive:true});hint()}
const tabs=document.querySelector('.practice-column .tabs');if(tabs)lensGroup(tabs,'[aria-selected="true"]');
const library=document.querySelector('.resource-switch');if(library)lensGroup(library,'button[aria-pressed="true"]');
// Give the existing theme button a compact lens without changing saved preferences.
document.querySelectorAll('[data-theme-toggle]').forEach(button=>{button.classList.add('lens-theme');function paint(){const dark=button.getAttribute('aria-pressed')==='true';const label=dark?'日间模式':'夜间模式';button.setAttribute('aria-label',label);button.title=label;button.innerHTML=dark?'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"/></svg>'}new MutationObserver(paint).observe(button,{attributes:true,attributeFilter:['aria-pressed']});paint()});
window.addEventListener('pagehide',()=>rotation.block('bfcache',true));window.addEventListener('pageshow',()=>rotation.block('bfcache',false));
})();
