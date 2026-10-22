/* Four Lanes offline support: the network is always tried first, so updates show up straight away.
   When you are offline, the last copy of the game is used. */
const C='fl4-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html'])).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin&&!/(^|\.)(unpkg\.com|googleapis\.com|gstatic\.com)$/.test(u.hostname))return;
  e.respondWith(fetch(r).then(res=>{
    if(res&&res.status===200){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});
