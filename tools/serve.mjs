import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||4180);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.gz':'application/gzip','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.srt':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8','.csv':'text/csv; charset=utf-8'};
http.createServer((request,response)=>{try{if(!['GET','HEAD'].includes(request.method)){response.writeHead(405);response.end();return}const url=new URL(request.url,'http://localhost');let rel=decodeURIComponent(url.pathname).replace(/^\/+/, '');if(!rel||rel.endsWith('/'))rel+='index.html';const file=path.resolve(root,rel);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){response.writeHead(404);response.end('Not found');return}response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':fs.statSync(file).size,'Cache-Control':'no-store'});if(request.method==='HEAD')response.end();else fs.createReadStream(file).pipe(response)}catch{response.writeHead(400);response.end('Bad request')}}).listen(port,'127.0.0.1',()=>console.log('Edu Speak preview: http://127.0.0.1:'+port));
