const CACHE = 'scs-v2';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', (e)=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); });
self.addEventListener('activate', (e)=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE?caches.delete(k):null)))); });
self.addEventListener('fetch', (e)=>{
  const req=e.request; const url=new URL(req.url);
  if(req.method!=='GET' || url.origin!==location.origin) return;
  e.respondWith(caches.match(req).then(res=>res||fetch(req).then(net=>{
    const copy=net.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return net;
  }).catch(()=>caches.match('./index.html'))));
});