/* Shared resource index and deterministic browsing helpers. */
(function(root){
'use strict';
const topics={daily:'日常生活',fashion:'时尚穿搭',growth:'个人成长',opinion:'观点表达',culture:'文化体验',food:'美食购物',city:'城市旅行',nature:'自然风光',emotion:'情感关系',work:'学习工作'};
let pending;
function load(){if(!pending)pending=fetch('data/candidates.json').then(r=>{if(!r.ok)throw Error('资源索引未能载入');return r.json()}).then(data=>{if(!Array.isArray(data)||!data.length||!data.every(c=>/^yt-[\w-]{11}$/.test(c.id)&&/^[\w-]{11}$/.test(c.sourceId)))throw Error('资源索引格式有误');return data}).catch(e=>{pending=null;throw e});return pending}
function durationLabel(seconds){if(!Number.isFinite(seconds)||seconds<=0)return '时长待核对';const n=Math.floor(seconds),h=Math.floor(n/3600),m=Math.floor(n%3600/60),s=String(n%60).padStart(2,'0');return h?`${h}:${String(m).padStart(2,'0')}:${s}`:`${m}:${s}`}
function spreadTopics(data){const groups=new Map();for(const c of data){if(!groups.has(c.category))groups.set(c.category,[]);groups.get(c.category).push(c)}const out=[],lists=[...groups.values()];for(let i=0;lists.some(x=>i<x.length);i++)for(const group of lists)if(group[i])out.push(group[i]);return out}
function filter(data,options={}){const {category='all',level='all',accent='all',term='',savedIds=[],onlySaved=false,sort='featured'}=options,saved=new Set(savedIds),terms=term.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);let out=data.filter(c=>(category==='all'||category===c.category)&&(level==='all'||level===(c.cefr||'pending'))&&(accent==='all'||accent===(c.accent||'unknown'))&&(!onlySaved||saved.has(c.id))&&terms.every(t=>[c.title,c.creator,c.description,topics[c.category]].join(' ').toLocaleLowerCase().includes(t)));if(sort==='short')out.sort((a,b)=>(a.duration||Infinity)-(b.duration||Infinity));else if(sort==='progress')out.sort((a,b)=>Number(saved.has(b.id))-Number(saved.has(a.id)));else out=spreadTopics(out);return out}
const api={topics,load,durationLabel,filter,spreadTopics};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.VlogResources=api;
})(typeof globalThis!=='undefined'?globalThis:this);
