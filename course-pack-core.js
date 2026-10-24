(function(root){
'use strict';
const normalize=s=>String(s??'').toLowerCase().replace(/[‘’]/g,"'").trim().replace(/[.,!?;:]+$/,'').replace(/\s+/g,' ').trim();
const check=(answer,accepted)=>accepted.some(s=>normalize(s)===normalize(answer));
function grade(questions,answers){const missing=questions.flatMap((_,i)=>Number.isInteger(answers?.[i])&&answers[i]>=0&&answers[i]<questions[i].options.length?[]:[i]);return {missing,score:questions.reduce((n,q,i)=>n+Number(answers?.[i]===q.answer),0),total:questions.length}}
function completion(state){return [0,1,2,3].filter(i=>state?.steps?.[i]===true).length}
const api={normalize,check,grade,completion};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CoursePackCore=api;
})(typeof window!=='undefined'?window:globalThis);
