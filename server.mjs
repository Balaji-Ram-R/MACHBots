import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const types={
  '.html':'text/html; charset=utf-8',
  '.css':'text/css',
  '.js':'text/javascript',
  '.mjs':'text/javascript',
  '.json':'application/json',
  '.svg':'image/svg+xml',
  '.webp':'image/webp',
  '.png':'image/png',
  '.txt':'text/plain',
  '.gltf':'model/gltf+json',
  '.splinecode':'application/octet-stream',
  '.bin':'application/octet-stream',
  '.woff2':'font/woff2'
};
http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file=path.resolve(root,'.'+pathname);
    if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end();}
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    const data=await readFile(file);
    res.writeHead(200,{
      'Content-Type':types[path.extname(file)]||'application/octet-stream',
      'Access-Control-Allow-Origin':'*',
      'Cache-Control':'no-cache, no-store, must-revalidate',
      'Pragma':'no-cache',
      'Expires':'0'
    });
    res.end(data);
  }catch{
    try {
      res.writeHead(404,{'Content-Type':'text/html'});
      res.end(await readFile(path.join(root,'404.html')));
    } catch {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
}).listen(4173,'0.0.0.0',()=>console.log('MACH Robotics server running at http://localhost:4173 and http://127.0.0.1:4173'));
