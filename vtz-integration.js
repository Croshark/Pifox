/* VTZ / TZ V22.40 – bezpečný most k spoločnej lokálnej databáze aplikácie. */
(()=>{
  function frame(){return document.getElementById('vtzFrame')}
  function theme(){const f=frame();if(f?.contentWindow)f.contentWindow.postMessage({source:'BOZP_AUDIT_THEME',theme:document.documentElement.getAttribute('data-bozp-theme')==='light'?'light':'dark'},location.origin)}
  window.BOZP_VTZ_BRIDGE={
    getContext(){return {companies:(db.companies||[]).map(c=>({id:c.id,name:c.name,site:c.site||'',address:c.address||''})),devices:db.vtzDevices||[],activeCompanyId:state.company||''}},
    saveDevices(items){db.vtzDevices=Array.isArray(items)?items:[];save()}
  };
  window.addEventListener('message',e=>{const f=frame();if(!f||e.origin!==location.origin||e.source!==f.contentWindow||e.data?.source!=='BOZP_VTZ')return;if(e.data.type==='ready')theme()});
  new MutationObserver(theme).observe(document.documentElement,{attributes:true,attributeFilter:['data-bozp-theme']});
  document.addEventListener('load',e=>{if(e.target.id==='vtzFrame')theme()},true);

  const originalMenu=menu;
  menu=function(){
    const html=originalMenu();
    const marker='<button class="navbtn '+(state.view==='vsetkovedko'?'active':'')+'" onclick="go(\'vsetkovedko\')">';
    const button='<button class="navbtn '+(state.view==='vtz'?'active':'')+'" onclick="go(\'vtz\')"><span class="sapphire-icon" aria-hidden="true"><svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="24" height="26" rx="4"/><path d="M11 12h14M11 18h8M11 24h6"/><circle cx="25" cy="23" r="4"/><path d="m28 26 3 3"/></svg></span><span class="sapphire-label">VTZ / TZ</span></button>';
    return html.includes(marker)?html.replace(marker,button+marker):html+button;
  };
  const originalRender=render;
  render=function(){
    originalRender();
    if(state.view==='vtz')$('content').innerHTML='<iframe id="vtzFrame" src="./vtz/index.html?v=22.40" title="Evidencia VTZ a technických zariadení" style="display:block;width:100%;height:calc(100dvh - 72px);min-height:820px;border:0;border-radius:14px;background:transparent"></iframe>';
  };
  render();
})();
