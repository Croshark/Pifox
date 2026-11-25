/* VŠETKOVEDKO: separate view, parent theme and document height synchronization. */
(()=>{
  function frame(){return document.getElementById('vsetkovedkoFrame');}
  function theme(){const f=frame();if(f?.contentWindow)f.contentWindow.postMessage({source:'BOZP_AUDIT_THEME',theme:document.documentElement.getAttribute('data-bozp-theme')==='light'?'light':'dark'},location.origin);}
  window.addEventListener('message',e=>{const f=frame();if(!f||e.origin!==location.origin||e.source!==f.contentWindow||e.data?.source!=='BOZP_VSETKOVEDKO')return;if(e.data.type==='ready')theme();if(e.data.type==='height'&&Number.isFinite(e.data.height))f.style.height=Math.min(16000,Math.max(900,e.data.height+4))+'px';});
  new MutationObserver(theme).observe(document.documentElement,{attributes:true,attributeFilter:['data-bozp-theme']});
  document.addEventListener('load',e=>{if(e.target.id==='vsetkovedkoFrame')theme();},true);
})();
