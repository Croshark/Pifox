// BOZP Audit – OOPP obrazky: oprava aktualizacie cache 2026-10-26. V17.2.4.
// Offline ulozene obrazky zostanu dostupne, pri online pripojeni sa vzdy
// preveri aktualna verzia na serveri (aj ked nazov suboru zostal rovnaky).
const CACHE='bozp-v22-43-unilabs-workplaces';
const CORE=['./accidents-v22-13.js','./accidents-v22-13.css','./employees.js','./employees.css','./employees-v22-12.js','./employees-v22-12.css','./zamestnanci_import_sablona.xlsx','./vsetkovedko/vsetkovedko-vtz-catalog.js','./vsetkovedko/vsetkovedko-vtz-rules.js','./vsetkovedko/vsetkovedko-training-data.js','./vsetkovedko/vsetkovedko-vtz-training.js','./vsetkovedko/assets/cards/vtz.svg','./vsetkovedko/assets/cards/pressure.svg','./vsetkovedko/assets/cards/lifting.svg','./vsetkovedko/assets/cards/electric.svg','./vsetkovedko/assets/cards/gas.svg','./vsetkovedko/assets/cards/training.svg','./vsetkovedko/assets/cards/fire-training.svg','./vsetkovedko/assets/cards/aisles.svg','./vsetkovedko/assets/cards/damage.svg','./vsetkovedko/assets/cards/documents.svg','./vsetkovedko/assets/cards/escape.svg','./vsetkovedko/assets/cards/fall.svg','./vsetkovedko/assets/cards/height.svg','./vsetkovedko/assets/cards/heights.svg','./vsetkovedko/assets/cards/ladder.svg','./vsetkovedko/assets/cards/load.svg','./vsetkovedko/assets/cards/marking.svg','./vsetkovedko/assets/cards/mixed.svg','./vsetkovedko/assets/cards/people.svg','./vsetkovedko/assets/cards/planning.svg','./vsetkovedko/assets/cards/rack.svg','./vsetkovedko/assets/cards/roads.svg','./vsetkovedko/assets/cards/stability.svg','./vsetkovedko/assets/cards/storage.svg','./vsetkovedko/assets/cards/truck.svg','./vsetkovedko/assets/cards/walk.svg','./vsetkovedko/assets/cards/zone.svg','./vsetkovedko/index.html','./vsetkovedko/vsetkovedko.js','./vsetkovedko/vsetkovedko.css','./vsetkovedko/vsetkovedko-clarity.js','./vsetkovedko/vsetkovedko-svg.js','./vsetkovedko/vsetkovedko-topics.js','./vsetkovedko/assets/roads.svg','./vsetkovedko/assets/heights.svg','./vsetkovedko/assets/storage.svg','./vsetkovedko-integration.js','./','./index.html','./oopp/index.html','./manifest.webmanifest','./bozp-xlsx-library.js','./bozp-xlsx-library.css','./oopp/bozp-oopp-docs.js','./oopp/bozp-oopp-intelligent.js','./oopp/assets/visual/work-basic.webp','./oopp/assets/visual/work-resp.webp','./oopp/assets/visual/chem-basic.webp','./oopp/assets/visual/chem-resp.webp','./oopp/assets/visual/ffp-overlay-v192.png','./oopp/bozp-oopp-atlas-v197.js','./oopp/assets/clean/other-sleeves.webp','./oopp/assets/clean/other-shoecovers.webp','./oopp/assets/clean/other-balaclava.webp','./oopp/assets/clean/other-wintervest.webp','./apple-touch-icon.png','./icon-192.png','./icon-512.png','./oopp/bozp-oopp-premium20.js','./oopp/bozp-oopp-wheel21.js','./oopp/bozp-oopp-wheel21.css','./oopp/bozp-oopp-expert21.js','./oopp/bozp-oopp-expert21.css','./oopp/bozp-oopp-premium-c.js','./oopp/bozp-oopp-premium-c.css','./oopp/bozp-oopp-midnight21.css','./oopp/bozp-oopp-midnight21.js','./oopp/assets/expert/insulating-gloves.svg','./oopp/assets/expert/over-glasses.svg','./oopp/assets/expert/filtered-lenses.svg','./oopp/assets/wheel-premium.webp','./oopp/assets/atlas-exact/helmet-yellow-eyes-clear-gloves-mechanical.webp'];

CORE.unshift(
  './unilabs/index.html','./unilabs/data.js','./unilabs/directory.js','./unilabs/directory.css',
  './vtz/index.html','./vtz/vtz.css','./vtz/vtz-data.js','./vtz/vtz.js','./vtz-integration.js',
  './deficiency-catalog-v22-36.js','./deficiency-catalog-v22-37.js','./deficiency-register-v22-36.css','./deficiency-register-v22-35.js','./deficiency-register-v22-35.css',
  './control-center-v22-33.js','./control-center-v22-33.css',
  './control-center-v22-14.js','./control-center-v22-14.css','./audit-report-v22-31.js','./audit-report-v22-31.css',
  './oopp/bozp-oopp-sapphire-v2228.js','./oopp/bozp-oopp-sapphire-v2228.css',
  './oopp/bozp-oopp-sapphire-v2229.js','./oopp/bozp-oopp-sapphire-v2229.css',
  './oopp/bozp-oopp-sapphire-v2230.js','./oopp/bozp-oopp-sapphire-v2230.css',
  './oopp/assets/ppe-v213/helmet.webp','./oopp/assets/ppe-v213/eyes.webp',
  './oopp/assets/ppe-v213/ears.webp','./oopp/assets/ppe-v213/gloves.webp',
  './oopp/assets/ppe-v213/shoes.webp','./oopp/assets/ppe-v213/vest.webp',
  './oopp/assets/ppe-v213/resp.webp'
);
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await Promise.all(CORE.map(async path=>{
      try{
        const url=new URL(path,self.registration.scope);
        const res=await fetch(url,{cache:'no-store'});
        if(res.ok)await cache.put(url,res.clone());
      }catch(e){/* Instalacia nesmie zlyhat iba pre nedostupny server. */}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(name=>
      (name.startsWith('bozp-')||name.startsWith('bozp-audit-'))&&name!==CACHE
    ).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin!==self.location.origin||!u.href.startsWith(self.registration.scope))return;
  const isPage=req.mode==='navigate'||req.destination==='document'||u.pathname.endsWith('.html')||u.pathname.endsWith('/');
  const isScript=u.pathname.startsWith(new URL('./oopp/',self.registration.scope).pathname)&&u.pathname.endsWith('.js');
  const isOoppAsset=u.pathname.includes('/oopp/assets/')&&/\.(?:webp|png|jpe?g|svg)$/i.test(u.pathname);
  const isVsetkovedko=u.pathname.includes('/vsetkovedko/')||u.pathname.endsWith('/vsetkovedko-integration.js');
  const isVtz=u.pathname.includes('/vtz/')||u.pathname.endsWith('/vtz-integration.js');
  if(isPage||isOoppAsset||isScript||isVsetkovedko||isVtz){
    // Network first: ignorovanie starej kopie PWA, ale offline fallback zachovany.
    // no-cache = revalidacia aj v diskovej HTTP cache prehliadaca (ETag / Last-Modified).
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const res=await fetch(req,{cache:isPage?'no-store':'no-cache'});
        if(res.ok&&res.type!=='opaque')await cache.put(req,res.clone());
        return res; // 404/500 nesmu byt nahradene starym obrazkom.
      }catch(err){
        const saved=await cache.match(req,{ignoreSearch:isPage||isOoppAsset||isVsetkovedko||isVtz});
        if(saved)return saved;
        if(isPage)return await cache.match(new URL('./index.html',self.registration.scope))||Response.error();
        return Response.error();
      }
    })());
    return;
  }
  // Ostatne nemenne zdroje – rychle nacitanie, offline rezim zachovany.
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(req);
    if(cached)return cached;
    try{
      const res=await fetch(req);
      if(res.ok&&res.type!=='opaque')await cache.put(req,res.clone());
      return res;
    }catch(err){return Response.error();}
  })());
});
