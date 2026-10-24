(function(root){
'use strict';
// Only one timer; every blocking state cancels it and restarts a full interval.
function rotation({count,onChange,onStateChange=()=>{},schedule=setTimeout,cancel=clearTimeout,delay=5000}){
 let index=0,timer=null,disposed=false;const blockers=new Set();
 function clear(){if(timer!==null){cancel(timer);timer=null}}
 function arm(){clear();if(!disposed&&!blockers.size&&count>1)timer=schedule(()=>{timer=null;show(index+1,false)},delay);onStateChange({running:timer!==null,paused:blockers.has('manual')||blockers.has('user')})}
 function show(next,manual=true){if(disposed)return;index=((next%count)+count)%count;if(manual)blockers.add('manual');onChange(index,manual);arm()}
 return{show,next:()=>show(index+1),previous:()=>show(index-1),block(key,value){if(value)blockers.add(key);else blockers.delete(key);arm()},resume(){blockers.delete('manual');blockers.delete('user');arm()},pause(){blockers.add('user');arm()},start:arm,dispose(){disposed=true;clear()},get index(){return index},get paused(){return blockers.has('manual')||blockers.has('user')}};
}
const api={rotation};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EduHeroCore=api;
})(typeof window!=='undefined'?window:globalThis);
