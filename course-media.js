/* Check the hosted media response before relying on HTTP seeking. */
(function(root){
'use strict';
function create(video,{fetcher=fetch,urls=URL,onStatus=()=>{},buffered=false}={}){
 let generation=0,controller=null,objectURL='',source='',pending=false,ready=Promise.resolve(false);
 function cancel(){generation++;controller?.abort();controller=null;source='';pending=false;if(objectURL){if(video.getAttribute('src')===objectURL){video.pause();video.removeAttribute('src');video.load()}urls.revokeObjectURL(objectURL);objectURL=''}}
 function load(url,{buffered:forceBuffer=buffered}={}){
  cancel();source=url;pending=true;const current=generation;controller=new AbortController();const signal=controller.signal;
  video.pause();video.removeAttribute('src');video.load();video.dataset.mediaSourceMode='loading';onStatus('正在准备视频…');
  ready=(async()=>{
   try{
    const response=await fetcher(url,{headers:forceBuffer?{}:{Range:'bytes=0-0'},credentials:'same-origin',signal});
    if(current!==generation){await response.body?.cancel();return false}
    const type=response.headers.get('content-type')||'';
    if(!response.ok||(!type.startsWith('video/')&&!type.includes('application/octet-stream')))throw Error('视频文件暂未能载入，请重新加载。');
    let playable=url,mode='stream';
    if(!forceBuffer&&response.status===206&&/^bytes 0-0\/\d+$/i.test(response.headers.get('content-range')||'')){
     await response.body?.cancel();
    }else if(response.status===200){
     // A 200 response to a Range request cannot provide reliable random reads.
     // Buffer this one course, then use a Blob URL with a fully seekable timeline.
     const total=Number(response.headers.get('content-length'))||0,reader=response.body.getReader(),chunks=[];let received=0,last=-1;
     for(;;){const {done,value}=await reader.read();if(done)break;if(current!==generation){await reader.cancel();return false}chunks.push(value);received+=value.byteLength;const percent=total?Math.min(100,Math.floor(received/total*20)*5):-1;if(percent!==last||last===-1){last=percent;onStatus(total?`正在缓冲视频 ${percent}% · 完成后可任意拖动`:'正在缓冲视频 · 完成后可任意拖动')}}
     if(current!==generation)return false;
     objectURL=urls.createObjectURL(new Blob(chunks,{type:type.startsWith('video/')?type:'video/mp4'}));playable=objectURL;mode='buffered';
    }else throw Error('视频文件的分段响应不完整，请重新加载。');
    if(current!==generation)return false;
    pending=false;video.dataset.mediaSourceMode=mode;video.preload='auto';video.src=playable;video.load();onStatus('');return true;
   }catch(error){if(current!==generation||signal.aborted)return false;pending=false;video.dataset.mediaSourceMode='error';onStatus(error.message||'视频加载失败，请重新加载。');return false}
  })();return ready;
 }
 return {load,cancel,get source(){return source},get pending(){return pending},get ready(){return ready}};
}
const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CourseMedia=api;
})(typeof window!=='undefined'?window:globalThis);
