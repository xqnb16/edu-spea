(function(root){
'use strict';
const pathPattern=/^\/api\/video\/courses\/[a-z0-9-]+\/(720|1080)p-[a-f0-9]{12}\.mp4$/;
function origin(value){if(!value)return '';const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||u.pathname!=='/')throw Error('Video origin must be a clean HTTPS origin');return u.origin}
function mediaUrl(value,host=''){const base=origin(host);if(!base||typeof value!=='string')return value;if(value.startsWith('/api/video/')||/^\/?media\//.test(value))return new URL(value.replace(/^media\//,'/media/'),base+'/').href;return value}
function trustedVideo(value,host=''){if(pathPattern.test(value))return true;if(!host)return false;try{const u=new URL(value);return u.origin===origin(host)&&!u.username&&!u.password&&!u.search&&!u.hash&&pathPattern.test(u.pathname)}catch{return false}}
const api={origin,mediaUrl,trustedVideo};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DeploymentCore=api;
})(typeof window!=='undefined'?window:globalThis);
