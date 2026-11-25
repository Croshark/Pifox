(()=>{
'use strict';
const D=window.VTZ_DATA;
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const iso=d=>d instanceof Date&&!isNaN(d)?[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'):'';
const fmt=v=>{if(!v)return 'Bez termínu';const d=new Date(v+'T00:00:00');return isNaN(d)?v:new Intl.DateTimeFormat('sk-SK',{day:'2-digit',month:'2-digit',year:'numeric'}).format(d)};
const uid=()=>crypto.randomUUID?.()||('vtz-'+Date.now()+'-'+Math.random().toString(16).slice(2));
let devices=[],companies=[],activeTab='all',page=1,libraryDomain='vtz',catalogTarget=false;

function parentBridge(){try{return parent!==window&&parent.BOZP_VTZ_BRIDGE?parent.BOZP_VTZ_BRIDGE:null}catch{return null}}
function loadContext(){
  const bridge=parentBridge();
  if(bridge){const c=bridge.getContext();devices=Array.isArray(c.devices)?c.devices:[];companies=Array.isArray(c.companies)?c.companies:[]}
  else{try{devices=JSON.parse(localStorage.getItem('bozp-vtz-v22-40')||'[]')}catch{devices=[]}companies=[]}
  devices=devices.map(normalizeDevice);
}
function persist(){const bridge=parentBridge();if(bridge)bridge.saveDevices(devices);else localStorage.setItem('bozp-vtz-v22-40',JSON.stringify(devices));}
function normalizeDevice(x){return {id:x.id||uid(),companyId:x.companyId||'',companyName:x.companyName||'',site:x.site||'',name:x.name||'',number:x.number||'',serial:x.serial||'',manufacturer:x.manufacturer||'',year:x.year||'',type:x.type||'other',group:x.group||'',classCode:x.classCode||'',classTitle:x.classTitle||'',inspectionType:x.inspectionType||'Odborná prehliadka',inspectionResult:x.inspectionResult||'unknown',lastInspection:x.lastInspection||'',nextInspection:x.nextInspection||'',interval:x.interval||'',technician:x.technician||'',legalBasis:x.legalBasis||'',responsible:x.responsible||'',status:x.status||'active',note:x.note||'',created:x.created||new Date().toISOString(),updated:x.updated||new Date().toISOString()}}
function companyName(d){return companies.find(c=>c.id===d.companyId)?.name||d.companyName||'Bez firmy'}
function getType(id){return D.types.find(t=>t.id===id)||D.types.find(t=>t.id==='other')}
function validity(d){
  if(d.status==='retired')return {id:'retired',label:'Vyradené',days:null};
  if(d.inspectionResult==='unsuitable')return {id:'late',label:'Nevyhovuje',days:null};
  if(!d.nextInspection)return {id:'missing',label:'Chýba termín',days:null};
  const dt=new Date(d.nextInspection+'T00:00:00');if(isNaN(dt))return {id:'missing',label:'Chybný termín',days:null};
  const days=Math.ceil((dt-today())/86400000);
  if(days<0)return {id:'late',label:'Po termíne',days};
  if(days<=90)return {id:'expiring',label:days===0?'Dnes':days===1?'Zajtra':`O ${days} dní`,days};
  return {id:'ok',label:'V termíne',days};
}
function icon(type){
  const icons={electric:'<path d="M13 2 5 13h6l-1 9 9-13h-6z"/>',pressure:'<rect x="6" y="3" width="12" height="18" rx="5"/><path d="M9 8h6M9 16h6"/>',gas:'<path d="M12 2c4 5 6 8 6 12a6 6 0 1 1-12 0c0-3 2-6 4-8 0 3 1 4 2 5 1-3 0-6 0-9z"/>',lifting:'<path d="M5 3h10v4H8v14M5 12h13l-3-3m3 3-3 3M5 21h7"/>',fire:'<path d="M13 2c3 4 5 7 5 11a6 6 0 1 1-12 0c0-3 2-6 4-8 0 3 1 4 2 5 1-3 1-5 1-8z"/>',other:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>'};
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[type]||icons.other}</svg>`;
}
function setupOptions(){
  $('typeFilter').innerHTML='<option value="">Všetky typy</option>'+D.types.map(t=>`<option value="${t.id}">${esc(t.short)}</option>`).join('');
  $('deviceType').innerHTML=D.types.map(t=>`<option value="${t.id}">${esc(t.short)}</option>`).join('');
  const opts=companies.length?companies.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join(''):'<option value="">Bez firmy – vytvorte ju v hlavnej aplikácii</option>';
  $('deviceCompany').innerHTML=opts;
  $('companyFilter').innerHTML='<option value="">Všetky firmy</option>'+companies.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
  $('libraryKind').innerHTML=kindOptions('vtz');
}
function kindOptions(domain){
  const items=D.library.filter(g=>g.domain===domain);return '<option value="">Všetky druhy</option>'+items.map(g=>`<option value="${g.kind}">${esc(g.group)}</option>`).join('');
}
function counts(){
  const c={total:devices.filter(d=>d.status!=='retired').length,ok:0,late:0,missing:0,retired:0,d30:0,d60:0,d90:0};
  devices.forEach(d=>{const v=validity(d);if(v.id==='retired')c.retired++;else if(v.id==='late')c.late++;else if(v.id==='missing')c.missing++;else{c.ok++;if(v.id==='expiring'){if(v.days<=30)c.d30++;if(v.days<=60)c.d60++;if(v.days<=90)c.d90++}}});return c;
}
function renderKpi(){const c=counts();$('kpiTotal').textContent=c.total;$('kpiOk').textContent=c.ok;$('kpiLate').textContent=c.late;$('kpiMissing').textContent=c.missing;$('kpiRetired').textContent=c.retired;$('kpi30').textContent=c.d30;$('kpi60').textContent=c.d60;$('kpi90').textContent=c.d90}
const tabDefs=()=>[
  ['all','Všetky zariadenia',()=>true],...D.types.filter(t=>t.id!=='fire').map(t=>[t.id,t.label,d=>d.type===t.id]),
  ['expiring','Končiace kontroly',d=>validity(d).id==='expiring'],['late','Po termíne / nevyhovuje',d=>validity(d).id==='late'],['missing','Chýba termín',d=>validity(d).id==='missing'],['retired','Vyradené',d=>d.status==='retired']
];
function renderTabs(){const defs=tabDefs();$('typeTabs').innerHTML=defs.map(([id,label,test])=>`<button class="tab ${id===activeTab?'active':''}" data-tab="${id}">${esc(label)}<span class="count">${devices.filter(test).length}</span></button>`).join('');$('typeTabs').querySelectorAll('.tab').forEach(b=>b.onclick=()=>{activeTab=b.dataset.tab;page=1;render()})}
function filtered(){
  const q=$('globalSearch').value.trim().toLocaleLowerCase('sk'),company=$('companyFilter').value,site=$('siteFilter').value.trim().toLocaleLowerCase('sk'),type=$('typeFilter').value,status=$('statusFilter').value,val=$('validityFilter').value,tech=$('technicianFilter').value.trim().toLocaleLowerCase('sk');
  const tab=tabDefs().find(x=>x[0]===activeTab)||tabDefs()[0];
  return devices.filter(d=>tab[2](d)&&(!q||[d.name,d.number,d.serial,d.site,d.manufacturer,d.classCode,d.classTitle,companyName(d)].join(' ').toLocaleLowerCase('sk').includes(q))&&(!company||d.companyId===company)&&(!site||d.site.toLocaleLowerCase('sk').includes(site))&&(!type||d.type===type)&&(!status||d.status===status)&&(!val||(val==='expiring'?validity(d).id==='expiring':validity(d).id===val))&&(!tech||d.technician.toLocaleLowerCase('sk').includes(tech))).sort((a,b)=>{
    const va=validity(a),vb=validity(b),rank={late:0,missing:1,expiring:2,ok:3,retired:4};return rank[va.id]-rank[vb.id]||(a.nextInspection||'9999').localeCompare(b.nextInspection||'9999')||a.name.localeCompare(b.name,'sk')
  });
}
function renderList(){
  const all=filtered(),size=Number($('pageSize').value)||15,max=Math.max(1,Math.ceil(all.length/size));if(page>max)page=max;const start=(page-1)*size,rows=all.slice(start,start+size);
  const title=tabDefs().find(x=>x[0]===activeTab)?.[1]||'Všetky zariadenia';$('listTitle').textContent=title;$('resultSummary').textContent=`${all.length} ${all.length===1?'zariadenie':all.length<5?'zariadenia':'zariadení'}`;
  $('emptyState').hidden=rows.length>0;$('deviceList').innerHTML=rows.length?`<div class="device-head"><span>Zariadenie</span><span>Firma / prevádzka</span><span>Skupina</span><span>Nasledujúci termín</span><span>Stav</span><span>Technik</span><span></span></div>`+rows.map(rowHtml).join(''):'';
  $('pageSummary').textContent=`Zobrazené ${all.length?start+1:0} – ${Math.min(start+size,all.length)} z ${all.length}`;
  $('deviceList').querySelectorAll('.device-row').forEach(r=>r.onclick=()=>openDevice(r.dataset.id));
}
function rowHtml(d){const v=validity(d),t=getType(d.type);return `<button class="device-row" data-id="${esc(d.id)}"><span class="device-title"><span class="type-mark" style="color:${t.color}">${icon(d.type)}</span><span><b>${esc(d.name||'Bez názvu')}</b><small>${esc(d.number||'Bez evidenčného čísla')} · ${esc(t.short)}</small></span></span><span class="cell"><b>${esc(companyName(d))}</b><span class="cell-sub">${esc(d.site||'Bez prevádzky')}</span></span><span class="cell">${d.group?`<span class="group-badge group-${esc(d.group)}">${esc(d.group)}${d.classCode?' · '+esc(d.classCode):''}</span>`:'<span class="cell-sub">Neurčená</span>'}</span><span class="cell"><b>${fmt(d.nextInspection)}</b><span class="cell-sub">${esc(d.inspectionType)}</span></span><span class="cell"><span class="status-pill ${v.id}">${esc(v.label)}</span></span><span class="cell"><b>${esc(d.technician||'Nepriradený')}</b><span class="cell-sub">${esc(d.responsible||'Bez zodpovednej osoby')}</span></span><span class="row-arrow">›</span></button>`}
function render(){renderKpi();renderTabs();renderList()}

function openDevice(id=''){
  const d=devices.find(x=>x.id===id);$('deviceForm').reset();$('deviceId').value=d?.id||'';$('deviceModalTitle').textContent=d?'Upraviť zariadenie':'Nové zariadenie';$('deleteDevice').hidden=!d;
  const preferred=parentBridge()?.getContext?.().activeCompanyId||companies[0]?.id||'';
  const vals={deviceCompany:d?.companyId||preferred,deviceSite:d?.site||'',deviceName:d?.name||'',deviceNumber:d?.number||nextNumber(),serialNumber:d?.serial||'',manufacturer:d?.manufacturer||'',yearMade:d?.year||'',deviceType:d?.type||'electric',deviceGroup:d?.group||'',classCode:d?.classCode||'',classTitle:d?.classTitle||'',inspectionType:d?.inspectionType||'Odborná prehliadka',inspectionResult:d?.inspectionResult||'unknown',lastInspection:d?.lastInspection||'',nextInspection:d?.nextInspection||'',intervalPreset:d?.interval||'',technician:d?.technician||'',legalBasis:d?.legalBasis||'',responsible:d?.responsible||'',deviceStatus:d?.status||'active',deviceNote:d?.note||''};
  Object.entries(vals).forEach(([id,v])=>{if($(id))$(id).value=v});updateClassification();updateDateWarning();showModal('deviceModal');
}
function nextNumber(){const nums=devices.map(d=>Number((d.number.match(/(\d+)$/)||[])[1])).filter(Number.isFinite);return 'VTZ-'+String(Math.max(0,...nums)+1).padStart(3,'0')}
function showModal(id){$(id).hidden=false;document.body.style.overflow='hidden'}
function closeModal(id){$(id).hidden=true;if($('deviceModal').hidden&&$('libraryModal').hidden)document.body.style.overflow=''}
function readForm(){const company=companies.find(c=>c.id===$('deviceCompany').value);return normalizeDevice({
  id:$('deviceId').value||uid(),companyId:$('deviceCompany').value,companyName:company?.name||'',site:$('deviceSite').value.trim(),name:$('deviceName').value.trim(),number:$('deviceNumber').value.trim(),serial:$('serialNumber').value.trim(),manufacturer:$('manufacturer').value.trim(),year:$('yearMade').value.trim(),type:$('deviceType').value,group:$('deviceGroup').value,classCode:$('classCode').value.trim(),classTitle:$('classTitle').value.trim(),inspectionType:$('inspectionType').value,inspectionResult:$('inspectionResult').value,lastInspection:$('lastInspection').value,nextInspection:$('nextInspection').value,interval:$('intervalPreset').value,technician:$('technician').value.trim(),legalBasis:$('legalBasis').value.trim(),responsible:$('responsible').value.trim(),status:$('deviceStatus').value,note:$('deviceNote').value.trim(),created:devices.find(d=>d.id===$('deviceId').value)?.created||new Date().toISOString(),updated:new Date().toISOString()
  })}
function saveDevice(e){e.preventDefault();const d=readForm();if(!d.companyId&&companies.length){alert('Vyberte firmu.');return}const duplicate=devices.find(x=>x.id!==d.id&&x.companyId===d.companyId&&x.number.toLowerCase()===d.number.toLowerCase());if(duplicate&&!confirm('Rovnaké evidenčné číslo už táto firma používa. Napriek tomu uložiť?'))return;const i=devices.findIndex(x=>x.id===d.id);if(i>=0)devices[i]=d;else devices.push(d);persist();closeModal('deviceModal');render()}
function removeDevice(){const id=$('deviceId').value,d=devices.find(x=>x.id===id);if(!d||!confirm(`Natrvalo vymazať zariadenie „${d.name}“?`))return;devices=devices.filter(x=>x.id!==id);persist();closeModal('deviceModal');render()}
function updateClassification(){const type=$('deviceType').value,code=$('classCode').value.trim();const row=(window.VseCatalog?.rows||[]).find(r=>r.kind===type&&r.code.toLowerCase()===code.toLowerCase());if(row){$('deviceGroup').value=row.group;$('classTitle').value=row.title;$('classificationInfo').innerHTML=`<b>${esc(row.code)} · ${esc(row.title)}</b><br>${esc(row.plain||row.rule)}`}else{$('classificationInfo').textContent=code?'Kód nebol jednoznačne nájdený v katalógu. Overte parametre zariadenia.':'Zatriedenie určuje rozsah skúšok, lehoty aj osobu oprávnenú úkon vykonať.'}}
function addInterval(date,interval){if(!date||!interval)return '';const d=new Date(date+'T12:00:00');if(isNaN(d))return '';const n=parseInt(interval,10);if(interval.endsWith('d'))d.setDate(d.getDate()+n);else if(interval.endsWith('m'))d.setMonth(d.getMonth()+n);return iso(d)}
function recalcNext(){const v=$('intervalPreset').value;if(v&&$('lastInspection').value)$('nextInspection').value=addInterval($('lastInspection').value,v);updateDateWarning()}
function updateDateWarning(){const n=$('nextInspection').value;if(!n){$('dateWarning').hidden=true;return}const days=Math.ceil((new Date(n+'T00:00:00')-today())/86400000);$('dateWarning').hidden=days>90;$('dateWarning').textContent=days<0?`Termín uplynul pred ${Math.abs(days)} dňami.`:days===0?'Termín kontroly je dnes.':`Do termínu zostáva ${days} dní.`}

function openLibrary(fromForm=false){catalogTarget=fromForm;libraryDomain='vtz';$('libraryKind').innerHTML=kindOptions('vtz');$('libraryKind').value=fromForm?$('deviceType').value:'';$('librarySearch').value='';document.querySelectorAll('.segmented button').forEach(b=>b.classList.toggle('active',b.dataset.lib==='vtz'));renderLibrary();showModal('libraryModal')}
function renderLibrary(){
  const kind=$('libraryKind').value,q=$('librarySearch').value.trim().toLocaleLowerCase('sk');let groups=D.library.filter(g=>g.domain===libraryDomain&&(!kind||g.kind===kind)).map(g=>({...g,rows:g.rows.filter(r=>!q||[r.code,r.title,r.note,g.group,g.source,...r.tasks.flat()].join(' ').toLocaleLowerCase('sk').includes(q))})).filter(g=>g.rows.length);
  let classification='';
  if(libraryDomain==='vtz'&&(!kind||['electric','pressure','gas','lifting'].includes(kind))){const rows=(window.VseCatalog?.rows||[]).filter(r=>(!kind||r.kind===kind)&&(!q||[r.code,r.title,r.plain,r.rule,r.example].join(' ').toLocaleLowerCase('sk').includes(q))).slice(0,80);if(rows.length)classification=`<section class="lib-group"><div class="lib-group-head"><h3>Zatriedenie VTZ podľa parametrov</h3><span>${rows.length} nájdených položiek · vyhláška č. 508/2009 Z. z., príloha č. 1</span></div>${rows.map(r=>`<article class="lib-card"><div class="lib-main" style="--cols:1"><div class="lib-name"><span class="group-badge group-${r.group}">${esc(r.group)} · ${esc(r.code)}</span><span><b>${esc(r.title)}</b><small>${esc(r.plain)}</small></span></div><div class="deadline"><span>Príklad</span><strong>${esc(r.example||'Overte technickú dokumentáciu')}</strong></div></div><details class="lib-detail"><summary>Presná podmienka zatriedenia</summary><p>${esc(r.rule)}</p>${catalogTarget?`<button class="use-deadline choose-class" data-kind="${esc(r.kind)}" data-code="${esc(r.code)}">Použiť zatriedenie</button>`:''}</details></article>`).join('')}</section>`}
  $('libraryResults').innerHTML=classification+groups.map(groupHtml).join('')||'<div class="empty-state"><h3>Nič sa nenašlo</h3><p>Skúste kratšie kľúčové slovo alebo iný druh zariadenia.</p></div>';
  $('libraryResults').querySelectorAll('.choose-class').forEach(b=>b.onclick=()=>chooseClass(b.dataset.kind,b.dataset.code));$('libraryResults').querySelectorAll('.use-term').forEach(b=>b.onclick=()=>useTerm(b));
}
function groupHtml(g){return `<section class="lib-group"><div class="lib-group-head"><h3>${esc(g.group)}</h3><span>${esc(g.source)} · ${g.rows.length} záznamov</span></div>${g.rows.map(r=>`<article class="lib-card"><div class="lib-main" style="--cols:${Math.min(4,r.tasks.length)}"><div class="lib-name"><span class="group-badge group-${(r.code.match(/[ABC]/)||['C'])[0]}">${esc(r.code)}</span><span><b>${esc(r.title)}</b><small>${esc(g.source)}</small></span></div>${r.tasks.map(t=>`<div class="deadline"><span>${esc(t[0])}</span><strong>${esc(t[1])}</strong></div>`).join('')}</div><details class="lib-detail"><summary>Osobitné podmienky a použitie</summary><p>${esc(r.note||'Lehotu porovnajte s dokumentáciou výrobcu, prevádzkovým predpisom a skutočnými podmienkami prevádzky.')}</p>${catalogTarget?r.tasks.filter(t=>t[2]).map(t=>`<button class="use-deadline use-term" data-interval="${esc(t[2])}" data-task="${esc(t[0])}" data-source="${esc(g.source)}">Použiť: ${esc(t[0])} – ${esc(t[1])}</button>`).join(''):''}</details></article>`).join('')}</section>`}
function chooseClass(kind,code){const r=(window.VseCatalog?.rows||[]).find(x=>x.kind===kind&&x.code===code);if(!r)return;$('deviceType').value=kind;$('deviceGroup').value=r.group;$('classCode').value=r.code;$('classTitle').value=r.title;updateClassification();closeModal('libraryModal')}
function useTerm(b){const map={OP:'Odborná prehliadka',OS:'Odborná skúška',OÚS:'Opakovaná úradná skúška',Kontrola:'Kontrola',Revízia:'Revízia'};const task=map[b.dataset.task]||b.dataset.task;$('intervalPreset').value=b.dataset.interval;if([...$('inspectionType').options].some(o=>o.value===task))$('inspectionType').value=task;$('legalBasis').value=b.dataset.source;recalcNext();closeModal('libraryModal')}

function csvCell(v){return '"'+String(v??'').replace(/"/g,'""')+'"'}
function exportCsv(){const head=['Firma','Prevádzka','Názov','Evidenčné číslo','Výrobné číslo','Typ','Skupina','Kód','Posledná kontrola','Nasledujúci termín','Výsledok','Technik','Zodpovedná osoba','Poznámka'];const rows=filtered().map(d=>[companyName(d),d.site,d.name,d.number,d.serial,d.type,d.group,d.classCode,d.lastInspection,d.nextInspection,d.inspectionResult,d.technician,d.responsible,d.note]);download('VTZ_export_'+iso(new Date())+'.csv','\ufeff'+[head,...rows].map(r=>r.map(csvCell).join(';')).join('\n'),'text/csv;charset=utf-8')}
function downloadTemplate(){const head=['Firma','Prevádzka','Názov','Evidenčné číslo','Výrobné číslo','Typ','Skupina','Kód','Posledná kontrola','Nasledujúci termín','Výsledok','Technik','Zodpovedná osoba','Poznámka'];const demo=['Názov firmy','Výrobná hala','Vzdušník kompresora','VTZ-001','12345','pressure','A','A/b/1','2026-01-15','2027-01-15','suitable','Ing. Technik','Ján Novák','Importovaný vzor – pred ostrým importom zmažte tento riadok.'];download('VTZ_import_vzor.csv','\ufeff'+[head,demo].map(r=>r.map(csvCell).join(';')).join('\n'),'text/csv;charset=utf-8')}
function download(name,data,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function parseCsv(text){const lines=text.replace(/^\ufeff/,'').split(/\r?\n/).filter(Boolean);if(lines.length<2)return[];const parse=line=>{let out=[],cur='',quote=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'&&line[i+1]==='"'){cur+='"';i++}else if(c==='"')quote=!quote;else if(c===';'&&!quote){out.push(cur);cur=''}else cur+=c}out.push(cur);return out};return lines.slice(1).map(parse).map(r=>{const company=companies.find(c=>c.name.trim().toLowerCase()===(r[0]||'').trim().toLowerCase());return normalizeDevice({id:uid(),companyId:company?.id||'',companyName:r[0],site:r[1],name:r[2],number:r[3],serial:r[4],type:D.types.some(t=>t.id===r[5])?r[5]:'other',group:r[6],classCode:r[7],lastInspection:r[8],nextInspection:r[9],inspectionResult:r[10],technician:r[11],responsible:r[12],note:r[13]})}).filter(d=>d.name&&d.number)}
async function importFile(e){const file=e.target.files?.[0];if(!file)return;try{const text=await file.text();let incoming;if(file.name.toLowerCase().endsWith('.json')){const parsed=JSON.parse(text);incoming=(Array.isArray(parsed)?parsed:parsed.devices||[]).map(normalizeDevice)}else incoming=parseCsv(text);if(!incoming.length)throw new Error('Súbor neobsahuje platné zariadenia.');if(!confirm(`Importovať ${incoming.length} zariadení? Existujúce záznamy zostanú zachované.`))return;devices.push(...incoming);persist();render();alert(`Importovaných zariadení: ${incoming.length}`)}catch(err){alert('Import sa nepodaril: '+err.message)}finally{e.target.value=''}}

function bind(){
  ['globalSearch','siteFilter','technicianFilter'].forEach(id=>$(id).addEventListener('input',()=>{page=1;renderList()}));['companyFilter','typeFilter','statusFilter','validityFilter','pageSize'].forEach(id=>$(id).addEventListener('change',()=>{page=1;renderList()}));
  $('resetFilters').onclick=()=>{['globalSearch','companyFilter','siteFilter','typeFilter','statusFilter','validityFilter','technicianFilter'].forEach(id=>$(id).value='');activeTab='all';page=1;render()};
  $('newDevice').onclick=$('emptyNew').onclick=()=>openDevice();$('deviceForm').onsubmit=saveDevice;$('deleteDevice').onclick=removeDevice;document.querySelectorAll('.close-modal').forEach(b=>b.onclick=()=>closeModal('deviceModal'));
  $('openLibrary').onclick=()=>openLibrary(false);$('openCatalogFromForm').onclick=()=>openLibrary(true);document.querySelectorAll('.close-library').forEach(b=>b.onclick=()=>closeModal('libraryModal'));
  document.querySelectorAll('.modal-backdrop').forEach(x=>x.addEventListener('mousedown',e=>{if(e.target===x)closeModal(x.id)}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('libraryModal').hidden)closeModal('libraryModal');else if(!$('deviceModal').hidden)closeModal('deviceModal')}});
  $('deviceType').onchange=()=>{$('deviceGroup').value='';$('classCode').value='';$('classTitle').value='';updateClassification()};$('classCode').oninput=updateClassification;$('lastInspection').onchange=recalcNext;$('intervalPreset').onchange=recalcNext;$('nextInspection').onchange=updateDateWarning;
  document.querySelectorAll('.segmented button').forEach(b=>b.onclick=()=>{libraryDomain=b.dataset.lib;document.querySelectorAll('.segmented button').forEach(x=>x.classList.toggle('active',x===b));$('libraryKind').innerHTML=kindOptions(libraryDomain);renderLibrary()});$('libraryKind').onchange=renderLibrary;$('librarySearch').oninput=renderLibrary;
  $('exportCsv').onclick=exportCsv;$('downloadTemplate').onclick=downloadTemplate;$('importFile').onchange=importFile;
  window.addEventListener('message',e=>{if(e.data?.source==='BOZP_AUDIT_THEME'){document.documentElement.dataset.theme=e.data.theme==='light'?'light':'dark'}});
  window.addEventListener('storage',e=>{if(e.key==='bozp-audit-v3'){loadContext();setupOptions();render()}});
}
loadContext();setupOptions();bind();render();
try{parent.postMessage({source:'BOZP_VTZ',type:'ready'},location.origin)}catch{}
})();
