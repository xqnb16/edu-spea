'use strict';
// Progressive material feedback only: native clicks, focus, video and text gestures remain in charge.
(function(){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 const selector='.site-header nav a,.category-filters button,.resource-switch>button,.practice-column .tabs button,.ui-unified .button,.ui-unified .icon-button,.home-theme,.lyric-star';
 const animations=new WeakMap();let held=null,lit=null,pending=0,point=null;
 function control(event){const el=event.target.closest?.(selector);return el&&!el.closest('#homeHero')&&!el.matches(':disabled,[aria-disabled=true]')?el:null}
 function cancel(el){animations.get(el)?.cancel();animations.delete(el)}
 function prepare(el){el.classList.add('motion-lens');if(!el.querySelector(':scope>.motion-glint')){const light=document.createElement('span');light.className='motion-glint';light.setAttribute('aria-hidden','true');el.append(light)}}
 function unlight(){if(lit)lit.classList.remove('is-lens-lit');lit=null;point=null;if(pending)cancelAnimationFrame(pending);pending=0}
 function light(event){if(!fine.matches||reduce.matches)return;const el=control(event);if(!el){unlight();return}if(lit!==el){unlight();lit=el;prepare(el);el.classList.add('is-lens-lit')}point={x:event.clientX,y:event.clientY};if(!pending)pending=requestAnimationFrame(()=>{pending=0;if(!lit||!point)return;const r=lit.getBoundingClientRect();lit.style.setProperty('--light-x',((point.x-r.left)/r.width*100).toFixed(1)+'%');lit.style.setProperty('--light-y',((point.y-r.top)/r.height*100).toFixed(1)+'%')})}
 function release(cancelled=false){const el=held;held=null;if(!el)return;el.classList.remove('is-lens-held');if(reduce.matches||!el.isConnected)return;cancel(el);const a=el.animate([{scale:'1.025 .96'},{scale:cancelled?'1 1':'0.993 1.018',offset:.58},{scale:'1 1'}],{duration:cancelled?160:360,easing:'cubic-bezier(.22,.8,.3,1)'});animations.set(el,a);a.onfinish=()=>animations.delete(el)}
 document.addEventListener('pointermove',light,{passive:true});
 document.addEventListener('pointerout',event=>{if(lit&&!lit.contains(event.relatedTarget))unlight()},{passive:true});
 document.addEventListener('pointerdown',event=>{release(true);const el=control(event);if(!el)return;prepare(el);held=el;cancel(el);if(!reduce.matches)el.classList.add('is-lens-held')},{passive:true});
 document.addEventListener('pointerup',()=>release(),{passive:true});
 document.addEventListener('pointercancel',()=>release(true),{passive:true});
 window.addEventListener('blur',()=>{release(true);unlight()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){release(true);unlight()}});
 reduce.addEventListener('change',()=>{release(true);unlight();document.querySelectorAll('.motion-lens').forEach(cancel)});
 // Keyboard actions get the same brief acknowledgement, without moving focus.
 document.addEventListener('keyup',event=>{if(!['Enter',' '].includes(event.key)||reduce.matches)return;const el=control(event);if(!el)return;prepare(el);cancel(el);const a=el.animate([{scale:'.98'},{scale:'1.015'},{scale:'1'}],{duration:240});animations.set(el,a);a.onfinish=()=>animations.delete(el)});
 document.addEventListener('click',event=>{
  const tab=event.target.closest?.('.practice-column .tabs button');
  if(tab&&!reduce.matches)requestAnimationFrame(()=>{const panel=document.querySelector('#practice');if(!panel)return;cancel(panel);const a=panel.animate([{opacity:.5,translate:'0 5px'},{opacity:1,translate:'0 0'}],{duration:220,easing:'ease-out'});animations.set(panel,a);a.onfinish=()=>animations.delete(panel)});
  // A light burst confirms saving, never cancellation. The app owns the saved state.
  const star=event.target.closest?.('.lyric-star');
  if(star&&!reduce.matches)requestAnimationFrame(()=>{if(star.isConnected&&star.getAttribute('aria-pressed')==='true'){star.classList.remove('is-lens-saved');void star.offsetWidth;star.classList.add('is-lens-saved')}});
 },true);
})();
