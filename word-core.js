(function(root){
'use strict';
function normalize(word){return String(word||'').trim().toLowerCase().replace(/’/g,"'").replace(/^[^a-z]+|[^a-z']+$/g,'')}
function resolve(data,word){if(/[<>]/.test(String(word)))return null;const term=normalize(word);if(!/^[a-z]+(?:'[a-z]+)*$/.test(term))return null;const key=Object.hasOwn(data.entries,term)?term:(data.aliases&&Object.hasOwn(data.aliases,term)?data.aliases[term]:null);const row=key&&Object.hasOwn(data.entries,key)&&data.entries[key];return row?{word:term,lemma:key,phonetic:row[0]||'',meaning:row[1]||'',pos:row[2]||''}:null}
function savedWords(vocabulary,cards=[]){const result=Object.create(null);for(const [key,value]of Object.entries(vocabulary||{})){if(!value||typeof value!=='object')continue;const word=normalize(value.word||key);if(word)result[word]={...value,word}}for(const c of cards){if(c?.type!=='word')continue;const word=normalize(c.en);if(word&&!result[word])result[word]={word,meaning:c.zh||'',context:c.context||'',title:c.title||'',lessonId:c.lessonId||'',time:''}}return result}
function filterSaved(words,{term='',sort='recent'}={}){const q=String(term).trim().toLowerCase();return Object.values(words).filter(w=>[w.word,w.meaning,w.context,w.title].join(' ').toLowerCase().includes(q)).sort(sort==='alpha'?(a,b)=>a.word.localeCompare(b.word):(a,b)=>String(b.time||'').localeCompare(String(a.time||'')))}
const api={normalize,resolve,savedWords,filterSaved};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WordCore=api;
})(typeof window!=='undefined'?window:globalThis);
