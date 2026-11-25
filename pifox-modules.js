
function goAccidentModule(){if(!company()&&db.companies.length)state.company=db.companies[0].id;go('accidents')}
function pickAccidentCompany(id){state.company=id;go('accidents')}
(function(){
const priorMenu=menu;menu=function(){const original=priorMenu();const buttons=[['accidents','Pracovné úrazy','⚕','goAccidentModule()'],['employees','Zamestnanci','♟',"go('employees')"],['oopp','OOPP','◈',"go('oopp')"],['vsetkovedko','Všetkovedko','▤',"go('vsetkovedko')"],['vtz','VTZ / TZ','⚙',"go('vtz')"]].map(([v,n,i,action])=>`<button class="navbtn ${state.view===v?'active':''}" onclick="${action}">${i} &nbsp; ${n}</button>`).join('');return original.replace('<div class="navhead">MOJE FIRMY</div>',buttons+'<div class="navhead">MOJE FIRMY</div>')};
const previous=render;render=function(){if(!['accidents','accident','employees','oopp','vsetkovedko','vtz'].includes(state.view)){previous();return;}const c=company();let h='';$('sidebar').innerHTML=menu();
if(state.view==='accidents'&&!c){h='<div class="title">Pracovné úrazy</div><div class="panel">Najprv vytvor firmu v evidencii klientov.</div>';}
if(state.view==='accidents'&&c){let items=(db.accidents||[]).filter(x=>x.companyId===c.id).sort((a,b)=>(b.created||'').localeCompare(a.created||''));h='<div class="eyebrow">'+esc(c.name)+'</div><div class="title">Pracovné úrazy</div><div class="muted">Samostatný modul evidencie pracovných úrazov.</div><div class="panel accident-company-selector"><label><strong>Firma / zamestnávateľ</strong></label><select onchange="pickAccidentCompany(this.value)">'+db.companies.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===c.id?'selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select><div class="muted">Firmy sa spravujú v pôvodnej evidencii klientov.</div></div><div class="actions" style="margin:20px 0"><button class="btn" onclick="newAccident()">＋ Nový pracovný úraz</button><button class="btn secondary" onclick="go(\'company\')">Späť na firmu</button></div>'+(items.length?'<div class="panel">'+items.map(x=>'<div class="listrow row"><div><strong>'+esc(x.employee||'Bez mena')+'</strong><div class="smalltext muted">'+esc(x.date||'Bez dátumu')+' · '+esc(x.place||'Bez miesta')+' · '+esc(x.status||'Rozpracované')+'</div></div><div class="actions"><button class="btn small" onclick="openAccident(\''+x.id+'\')">Otvoriť spis →</button><button class="btn small danger" onclick="deleteAccident(\''+x.id+'\')" aria-label="Vymazať pracovný úraz">🗑 Vymazať</button></div></div>').join('')+'</div>':'<div class="empty">Zatiaľ nie je evidovaný žiadny pracovný úraz.</div>');}
if(state.view==='accident'&&c){h=renderAccidentForm();}

if(state.view==='employees')h=empPage();
if(state.view==='oopp')h='<iframe id="ooppFrame" src="./oopp/index.html" title="OOPP" style="width:100%;min-height:850px;height:calc(100dvh - 90px);border:0"></iframe>';
if(state.view==='vsetkovedko')h='<iframe id="vsetkovedkoFrame" src="./vsetkovedko/index.html" title="Všetkovedko" style="width:100%;min-height:900px;border:0"></iframe>';
if(state.view==='vtz')h='<iframe id="vtzFrame" src="./vtz/index.html" title="VTZ / TZ" style="width:100%;min-height:850px;height:calc(100dvh - 90px);border:0"></iframe>';
$('content').innerHTML=h;};
})();

window.addEventListener('message',function(e){
 if(e.origin!==location.origin||e.data?.source!=='BOZP_OOPP')return;
 const f=document.getElementById('ooppFrame');
 if(!f||e.source!==f.contentWindow)return;
 db.ooppCards=db.ooppCards||[];
 const respond=(type)=>f.contentWindow.postMessage({source:'BOZP_PARENT',type,companies:db.companies.map(x=>({id:x.id,name:x.name})),cards:db.ooppCards,
  professions:(db.professions||[]).map(({id,companyId,name,ooppCardId})=>({id,companyId,name,ooppCardId})),
  employeeRoles:Array.from(new Set((db.employees||[]).filter(e=>e.role && !(db.professions||[]).some(p=>p.companyId===e.companyId && p.id===e.professionId)).map(e=>JSON.stringify([e.companyId,e.role]))),pair=>JSON.parse(pair))
 },location.origin);
 if(e.data.type==='init')respond('data');
 if(e.data.type==='newCompany'){
  const name=prompt('Názov novej firmy');if(!name?.trim())return;
  const c={id:uid(),name:name.trim(),site:'',address:'',contact:''};
  db.companies.push(c);save();respond('data');render();
 }
 if(e.data.type==='save'){
  const c=e.data.card;
  if(!c||!db.companies.some(x=>x.id===c.companyId)||!Array.isArray(c.items))return;
  const i=db.ooppCards.findIndex(x=>x.id===c.id);
  if(i>=0)db.ooppCards[i]=c;else db.ooppCards.push(c);
  db.professions=db.professions||[];
  const role=c.job==='Iná profesia'?c.customJob:c.job||c.customJob;
  const key=v=>String(v||'').trim().toLocaleLowerCase('sk');
  let prof=db.professions.find(p=>p.companyId===c.companyId&&p.id===c.professionId)||db.professions.find(p=>p.companyId===c.companyId&&key(p.name)===key(role));
  if(!prof&&role){prof={id:uid(),companyId:c.companyId,name:role,trainingTypeIds:[],ooppCardId:''};db.professions.push(prof)}
  if(prof){c.professionId=prof.id;
   const selected=c.items.filter(i=>i&&i.id&&!['Nevyžaduje sa','Vyradené','Nevhodné'].includes(i.status)&&!(i.id==='gloves'&&/^Bez rukavíc/i.test(i.type||'')));
   if(selected.length&&selected.every(i=>i.approvalStatus==='Schválené'))prof.ooppCardId=c.id;
  }

  save();respond('saved');respond('data');
 }
});

window.BOZP_VTZ_BRIDGE={getContext(){return {companies:(db.companies||[]).map(c=>({id:c.id,name:c.name,site:c.site||'',address:c.address||''})),devices:db.vtzDevices||[],activeCompanyId:state.company||''}},saveDevices(items){db.vtzDevices=Array.isArray(items)?items:[];save()}};
document.documentElement.setAttribute('data-bozp-theme',localStorage.getItem('pifox-module-theme')||'light');
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===document.getElementById('vtzFrame')?.contentWindow&&e.data?.source==='BOZP_VTZ')e.source.postMessage({source:'BOZP_AUDIT_THEME',theme:document.documentElement.getAttribute('data-bozp-theme')},location.origin)});
