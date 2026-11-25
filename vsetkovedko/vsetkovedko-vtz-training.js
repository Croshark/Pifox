(function(){
'use strict';

const $=id=>document.getElementById(id);
const D=window.VseTraining;
const C=window.VseCatalog;
if(!D||!C)return;

const area=document.createElement('section');
area.id='v-new';
area.className='hidden';
document.querySelector('#vse-module main').append(area);

const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const art=id=>'./assets/cards/'+id+'.svg';
let kind='',group='all',query='',trainingGroup='',trainingQuery='',returnTo=null,guideResult=null;

function show(){
  ['v-home','v-topic','v-extra'].forEach(id=>$(id).classList.add('hidden'));
  area.classList.remove('hidden');
}
function top(){
  area.scrollIntoView({block:'start'});
  const h=area.querySelector('h2');
  if(h){h.tabIndex=-1;h.focus({preventScroll:true});}
}
function home(){
  area.classList.add('hidden');
  $('v-topic').classList.add('hidden');
  $('v-extra').classList.add('hidden');
  $('v-home').classList.remove('hidden');
  $('v-global-search')?.focus({preventScroll:true});
}
function head(title,sub,label='Témy'){
  return `<div class="row"><button type="button" data-back>← ${e(label)}</button><span class="eyebrow">VŠETKOVEDKO</span></div><h2 class="new-title">${e(title)}</h2><p class="new-sub">${e(sub)}</p>`;
}
function back(fn){area.querySelector('[data-back]').onclick=fn;}
function card(title,img,sub,attr,badge){
  return `<button type="button" class="topic new-card" ${attr}><img class="topic-art" src="${art(img)}" alt=""><h3>${e(title)}</h3><span>${e(sub)}</span><span class="status">${e(badge||'Otvoriť →')}</span></button>`;
}
function source(items){
  return `<details class="new-fold source-fold"><summary>Presný právny základ a zdroje</summary><p>Overené k 3. 11. 2026. Vysvetlenia a príklady sú pracovnou pomôckou; rozhodujú presné kritériá, štítok a dokumentácia konkrétneho zariadenia.</p>${items.map(x=>`<p><a href="${e(x[0])}" target="_blank" rel="noopener noreferrer">${e(x[1])} ↗</a></p>`).join('')}</details>`;
}
function toneFromTag(tag){
  const n=norm(tag);
  if(n.includes('nestaci')||n.includes('vyzaduje'))return 'stop';
  if(n.includes('za podmienok')||n.includes('dalsou'))return 'condition';
  return 'info';
}
function resultTone(groupValue){
  return groupValue==='A'?'stop':groupValue==='B'?'condition':groupValue==='C'?'info':'review';
}

/* Vyhľadávanie v pôvodnej úvodnej obrazovke. */
const catalogAliases={
  'pressure:A/b/1':'vzdušník tlaková nádoba kompresor zásobník stlačeného vzduchu',
  'pressure:B/b/1':'malý vzdušník tlaková nádoba kompresor zásobník stlačeného vzduchu',
  'pressure:B/c':'tlaková fľaša kyslík acetylén propán technický plyn',
  'pressure:B/d':'hasiaci prístroj prenosný hasiaci',
  'lifting:A/a':'žeriav mostový žeriav vežový žeriav kladkostroj zdvíhadlo',
  'lifting:B/a/1':'malý žeriav kladkostroj zdvíhadlo',
  'lifting:A/b':'pracovná plošina nožnicová plošina kĺbová plošina manitou jlg',
  'lifting:B/b':'vzv vysokozdvižný vozík forklift retrak čelný vozík nakladač',
  'lifting:B/d/3':'servisný zdvihák autozdvihák zdvihák vozidiel',
  'lifting:C/a':'viazací prostriedok reťaz lano popruh úväzok',
  'electric:B':'elektrické zariadenie elektrikár elektro rozvádzač 230v 400v 24v',
  'electric:A/e':'atex výbuch elektrická inštalácia výbušné prostredie',
  'gas:B/h':'plynový kotol horák spotrebič odťah spalín',
  'gas:A/h':'veľký plynový kotol horák nad 500 kw'
};
const trainingAliases={
  forklift:'vzv vysokozdvižný vozík forklift retrak vodič motorového vozíka',
  crane:'žeriavnik mobilný vežový žeriav',
  'bridge-crane':'mostový žeriav žeriavnik',
  'road-platform':'pracovná plošina cestný podvozok manitou jlg',
  'scissor-platform':'nožnicová plošina kĺbová plošina pracovná plošina',
  'height-basic':'práca vo výške rebrík strecha pád',
  electrical20:'elektrikár paragraf 20 poučená osoba',
  electrical21:'elektrikár paragraf 21 elektrotechnik',
  electrical22:'elektrikár paragraf 22 samostatný elektrotechnik',
  electrical23:'elektrikár paragraf 23 riadenie činnosti',
  electrical24:'revízny technik elektro paragraf 24',
  bozp:'vstupné školenie opakované bozp bezpečnostný technik',
  po:'požiarna ochrana tpo školenie po'
};
const topicItems=[
  {id:'road',section:'truck',title:'Cesty a uličky pre vozíky',text:'šírka komunikácie vozík vzv cesta ulička prejazd'},
  {id:'road',section:'people',title:'Komunikácie pre chodcov',text:'chodec chodník peší priechod komunikácia'},
  {id:'road',section:'escape',title:'Únikové cesty',text:'únik úniková cesta východ evakuácia'},
  {id:'road',section:'marking',title:'Značenie a farby',text:'čiara farba žltá biela značenie podlahy'},
  {id:'height',section:'fall',title:'Práce vo výške',text:'výška pád okraj strecha ochrana'},
  {id:'height',section:'ladder',title:'Rebríky',text:'rebrík sklon prístup'},
  {id:'storage',section:'load',title:'Nosnosť regálov',text:'regál nosnosť bunka pole skladovanie'},
  {id:'storage',section:'damage',title:'Poškodenie regálov',text:'regál náraz deformácia poškodenie'},
  {id:'storage',section:'aisles',title:'Uličky medzi regálmi',text:'skladovanie ulička regál vozík'}
];
const legalItems=[
  {title:'Vyhláška č. 508/2009 Z. z. · VTZ a odborná spôsobilosť',text:'508 2009 vtz technické zariadenie odborná spôsobilosť',url:C.source},
  {title:'Zákon č. 124/2006 Z. z. · BOZP a oboznamovanie',text:'124 2006 bozp školenie oboznamovanie paragraf 7 16',url:'https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/2006/124/'},
  {title:'Vyhláška č. 147/2013 Z. z. · práce vo výške',text:'147 2013 výška rebrík pád',url:'https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/2013/147/'},
  {title:'NV SR č. 391/2006 Z. z. · pracovisko',text:'391 2006 pracovisko komunikácia únik',url:'https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/2006/391/'},
  {title:'NV SR č. 387/2006 Z. z. · bezpečnostné značenie',text:'387 2006 značenie farby čiary',url:'https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/2006/387/'},
  {title:'Vyhláška č. 59/1982 Zb. · skladovanie a komunikácie',text:'59 1982 sklad regál ulička',url:'https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/1982/59/'}
];
function searchableCatalog(r){return norm(`${r.kind} ${r.code} ${r.title} ${r.plain} ${r.rule} ${r.example} ${catalogAliases[r.kind+':'+r.code]||''}`);}
function searchableTraining(r){return norm(`${r.title} ${r.for} ${r.intro} ${JSON.stringify(r.depth||{})} ${trainingAliases[r.id]||''} ${r.modes.map(m=>m.name+' '+m.btTag+' '+m.who).join(' ')}`);}
function openTopic(id,section){
  home();
  if(id==='road')$('v-open').click();
  if(id==='height')$('v-open-workheight').click();
  if(id==='storage')$('v-open-storage').click();
  requestAnimationFrame(()=>{
    const selector=id==='road'?`#v-nav [data-key="${section}"]`:`#x-nav [data-section="${section}"]`;
    document.querySelector(selector)?.click();
  });
}
function installGlobalSearch(){
  const hero=document.querySelector('#v-home .home-hero');
  if(!hero||$('v-global-search'))return;
  hero.insertAdjacentHTML('afterend',`<section class="vse-global-search" aria-label="Vyhľadávanie vo Vševedkovi"><div class="global-search-label"><span class="eyebrow">RÝCHLE HĽADANIE</span><b>Nájdi zariadenie, školenie alebo situáciu</b></div><label><span class="search-symbol" aria-hidden="true">⌕</span><input id="v-global-search" type="search" autocomplete="off" placeholder="Napr. vzdušník, VZV, rebrík, elektrikár…"><button type="button" id="v-global-clear" aria-label="Vymazať vyhľadávanie">×</button></label><div class="search-suggestions" aria-label="Príklady vyhľadávania"><button type="button">vzdušník</button><button type="button">VZV</button><button type="button">mostový žeriav</button><button type="button">práca vo výške</button></div><div id="v-global-results" class="global-results" hidden></div></section>`);
  const input=$('v-global-search'),out=$('v-global-results');
  function render(){
    const raw=input.value.trim(),q=norm(raw);
    $('v-global-clear').hidden=!raw;
    if(q.length<2){out.hidden=true;out.innerHTML='';return;}
    const devices=C.rows.filter(r=>searchableCatalog(r).includes(q)).slice(0,8);
    const trainings=D.rows.filter(r=>searchableTraining(r).includes(q)).slice(0,8);
    const topics=topicItems.filter(r=>norm(r.title+' '+r.text).includes(q)).slice(0,6);
    const laws=legalItems.filter(r=>norm(r.title+' '+r.text).includes(q)).slice(0,5);
    const block=(title,icon,rows,html)=>rows.length?`<section><h3><span aria-hidden="true">${icon}</span>${title}<small>${rows.length}</small></h3>${rows.map(html).join('')}</section>`:'';
    out.innerHTML=block('Zariadenia VTZ','◇',devices,r=>`<button type="button" data-device="${e(r.kind)}|${e(r.code)}"><b>${e(r.title)}</b><span>${e(C.meta[r.kind].title)} · ${e(r.code)}</span></button>`)+block('Školenia a oprávnenia','✓',trainings,r=>`<button type="button" data-training-result="${e(r.id)}"><b>${e(r.title)}</b><span>${e(r.for)}</span></button>`)+block('Pracovné situácie','▣',topics,r=>`<button type="button" data-topic="${e(r.id)}|${e(r.section)}"><b>${e(r.title)}</b><span>Otvoriť praktickú kontrolu</span></button>`)+block('Predpisy a zdroje','§',laws,r=>`<a href="${e(r.url)}" target="_blank" rel="noopener"><b>${e(r.title)}</b><span>Otvoriť zdroj ↗</span></a>`);
    if(!out.innerHTML)out.innerHTML='<p class="search-empty">Nenašla sa presná zhoda. Skús kratší alebo bežnejší názov.</p>';
    out.hidden=false;
    out.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>{const [k,c]=b.dataset.device.split('|');kind=k;group='all';query='';catalogDetail(c);});
    out.querySelectorAll('[data-training-result]').forEach(b=>b.onclick=()=>{trainingGroup='';returnTo=null;trainingDetail(b.dataset.trainingResult);});
    out.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{const [id,topicSection]=b.dataset.topic.split('|');openTopic(id,topicSection);});
  }
  input.addEventListener('input',render);
  input.addEventListener('keydown',ev=>{if(ev.key==='Escape')$('v-global-clear').click();});
  $('v-global-clear').onclick=()=>{input.value='';render();input.focus();};
  document.querySelectorAll('.search-suggestions button').forEach(b=>b.onclick=()=>{input.value=b.textContent;render();input.focus();});
}

/* Rýchly sprievodca zaradením VTZ. */
const guideTypes=[
  ['pressure-vessel','Tlaková nádoba / vzdušník'],
  ['crane','Žeriav alebo kladkostroj'],
  ['platform','Pohyblivá pracovná plošina'],
  ['forklift','VZV alebo nakladač'],
  ['gas-appliance','Plynový spotrebič / kotol'],
  ['electric','Elektrické zariadenie alebo inštalácia']
];
function guideShell(){
  return `<section class="vtz-guide"><div class="guide-head"><div><span class="eyebrow">RÝCHLE ZARADENIE</span><h3>Čo máš pred sebou?</h3><p>Vyber bežný typ zariadenia a prepíš údaje zo štítku alebo dokumentácie.</p></div><span class="guide-step">1 / 3</span></div><label class="guide-type">Typ zariadenia<select id="guide-type"><option value="">Vyber zariadenie…</option>${guideTypes.map(x=>`<option value="${x[0]}">${e(x[1])}</option>`).join('')}</select></label><div id="guide-fields"></div><div id="guide-result" aria-live="polite"></div><details class="guide-limit"><summary>Kedy sprievodcu nepoužiť ako konečný záver</summary><p>Ak nepoznáš parametre zo štítku, zariadenie má osobitné vyhotovenie alebo sa jeho účel prekrýva s inou položkou prílohy č. 1. Vtedy otvor celý katalóg a porovnaj dokumentáciu zariadenia. Výsledok nie je odbornou prehliadkou ani odbornou skúškou.</p></details></section>`;
}
function gNumber(id,label,value,step='0.1'){
  return `<label>${e(label)}<input id="${id}" type="number" min="0" step="${step}" value="${value}"></label>`;
}
function gSelect(id,label,options){
  return `<label>${e(label)}<select id="${id}">${options.map(([v,t])=>`<option value="${v}">${e(t)}</option>`).join('')}</select></label>`;
}
function guideFields(type){
  const host=$('guide-fields');
  guideResult=null;
  $('guide-result').innerHTML='';
  area.querySelector('.guide-step').textContent=type?'2 / 3':'1 / 3';
  if(!type){host.innerHTML='';return;}
  let html='<div class="guide-fields">';
  if(type==='pressure-vessel')html+=gSelect('g-medium','Médium',[['normal','Vzduch alebo iné nie nebezpečné médium'],['danger','Nebezpečný plyn alebo kvapalina']])+gNumber('g-pressure','Najvyšší pracovný / dovolený tlak (MPa)','0.8','0.01')+gNumber('g-volume','Objem nádoby (l)','100','0.1');
  if(type==='crane')html+=gSelect('g-drive','Pohon',[['motor','Motorový'],['human','Ručný / ľudskou silou']])+gNumber('g-capacity','Menovitá nosnosť (kg)','2000','1');
  if(type==='platform')html+=gSelect('g-drive','Spôsob zdvihu',[['motor','Motorový / hydraulický'],['human','Iba ručný']])+gNumber('g-height','Výška zdvihu (m)','6','0.1');
  if(type==='forklift')html+=gSelect('g-truck','Vyhotovenie',[['motor','Motorový dopravný vozík alebo nakladač'],['hand','Ručný paletový vozík']])+gSelect('g-lift','Spôsob manipulácie',[['attachment','Zdvíhanie a preprava bremena vidlicami alebo uchopovacím prostriedkom'],['other','Iný spôsob / neviem']]);
  if(type==='gas-appliance')html+=gSelect('g-gas','Plyn',[['danger','Nebezpečný plyn podľa predpisu'],['other','Iný plyn / neviem']])+gNumber('g-power','Výkon zariadenia alebo funkčného celku (kW)','100','0.1')+gSelect('g-flue','Vyžaduje spotrebič napojenie na odťah spalín?',[['yes','Áno'],['no','Nie']]);
  if(type==='electric')html+=gSelect('g-special','Osobitná podmienka',[['none','Žiadna z uvedených / neviem'],['a-source','Výroba elektriny od 3 MW'],['a-transform','Premena elektriny od 250 kVA'],['a-high','Sieť vysokého napätia'],['a-be2','Prostredie s nebezpečenstvom požiaru BE2'],['a-be3','Prostredie s nebezpečenstvom výbuchu BE3'],['a-corrosion','Trvalá korózia alebo znečistenie'],['a-water','Voda alebo vodivé okolie'],['a-medical','Vybraná zdravotnícka miestnosť'],['a-crowd','Priestor na zhromažďovanie viac ako 250 osôb']])+gSelect('g-safe','Ak nie je skupina A, sú bezpečné hodnoty prúdu a napätia pre konkrétne podmienky preukázané?',[['unknown','Neviem / nemám podklad'],['no','Nie – hodnoty nie sú bezpečné'],['yes','Áno – je to preukázané']]);
  html+='</div><button type="button" class="primary guide-calc" id="guide-calc">Zobraziť zaradenie</button>';
  host.innerHTML=html;
  host.querySelectorAll('input,select').forEach(x=>x.addEventListener('input',()=>{$('guide-result').innerHTML='';guideResult=null;}));
  $('guide-calc').onclick=()=>calculateGuide(type);
}
function guideClassification({group:groupValue,kind:kindValue,code,title,reason,warning}){
  const row=code?C.rows.find(r=>r.kind===kindValue&&r.code===code):null;
  guideResult={group:groupValue,kind:kindValue,code};
  area.querySelector('.guide-step').textContent='3 / 3';
  const label=groupValue==='A'?'VTZ skupiny A · vysoká miera ohrozenia':groupValue==='B'?'VTZ skupiny B · vyššia miera ohrozenia':groupValue==='C'?'Nie je VTZ podľa § 4':'Výsledok treba odborne doplniť';
  const training=row?trainingFor(row).map(id=>D.rows.find(x=>x.id===id)).filter(Boolean):[];
  $('guide-result').innerHTML=`<section class="answer-strip ${resultTone(groupValue)}"><span class="answer-mark">${e(groupValue||'?')}</span><div><span class="eyebrow">VÝSLEDOK RÝCHLEHO ZARADENIA</span><h3>${e(label)}</h3><p><strong>${e(title)}</strong> · ${e(reason)}</p>${warning?`<small>${e(warning)}</small>`:''}</div></section>${training.length?`<div class="guide-training-preview"><span class="eyebrow">NADVÄZUJÚCA OBSLUHA A ŠKOLENIE</span>${training.slice(0,2).map(x=>`<div><b>${e(x.title)}</b><span class="answer-tag ${toneFromTag(x.modes[0].btTag)}">${e(x.modes[0].btTag)}</span></div>`).join('')}</div>`:''}${row?'<button type="button" class="primary guide-open" id="guide-open">Otvoriť spoločnú kartu zariadenia, školení a dokladov →</button>':'<button type="button" class="guide-open" id="guide-catalog">Otvoriť celý katalóg VTZ →</button>'}`;
  if(row)$('guide-open').onclick=()=>{kind=kindValue;group='all';query='';catalogDetail(code);};
  else $('guide-catalog').onclick=()=>{kind=kindValue||'electric';group='all';query='';catalog();};
}
function calculateGuide(type){
  const n=id=>Number($(id)?.value),v=id=>$(id)?.value;
  if(type==='pressure-vessel'){
    const pressure=n('g-pressure'),volume=n('g-volume'),product=pressure*volume,danger=v('g-medium')==='danger';
    if(!Number.isFinite(pressure)||!Number.isFinite(volume)||pressure<0||volume<0)return guideClassification({kind:'pressure',title:'Neplatné vstupy',reason:'Tlak a objem musia byť nezáporné čísla.',warning:'Prepíš údaje zo štítku.'});
    let code,groupValue;
    if(danger&&pressure>.05&&volume>1&&product>5){code='A/b/2';groupValue='A';}
    else if(danger&&pressure>.05&&volume>1&&product>2.5){code='B/b/2';groupValue='B';}
    else if(!danger&&pressure>.2&&volume>10&&product>20){code='A/b/1';groupValue='A';}
    else if(!danger&&pressure>.05&&volume>1&&product>5){code='B/b/1';groupValue='B';}
    else {code='C';groupValue='C';}
    guideClassification({group:groupValue,kind:'pressure',code,title:`p × V = ${product.toLocaleString('sk-SK',{maximumFractionDigits:2})} MPa·l`,reason:`Tlak ${pressure} MPa, objem ${volume} l; porovnané s hranicami pre ${danger?'nebezpečné':'nie nebezpečné'} médium.`,warning:'Predpokladá sa stabilná tlaková nádoba. Pri prepravnej nádobe, kotle, potrubí alebo hasiacom prístroji vyber príslušnú samostatnú položku.'});
  }
  if(type==='crane'){
    const capacity=n('g-capacity'),motor=v('g-drive')==='motor';
    if(motor)guideClassification({group:capacity>1000?'A':'B',kind:'lifting',code:capacity>1000?'A/a':'B/a/1',title:'Motorový žeriav alebo zdvíhadlo',reason:`Nosnosť ${capacity.toLocaleString('sk-SK')} kg; hranica skupiny A pri motorovom pohone je viac ako 1 000 kg.`});
    else if(capacity>5000)guideClassification({group:'A',kind:'lifting',code:'A/a',title:'Ručný žeriav alebo zdvíhadlo',reason:`Nosnosť ${capacity.toLocaleString('sk-SK')} kg je vyššia ako 5 000 kg.`});
    else if(capacity>=1000)guideClassification({group:'B',kind:'lifting',code:'B/a/1',title:'Ručný žeriav alebo zdvíhadlo',reason:`Nosnosť ${capacity.toLocaleString('sk-SK')} kg je od 1 000 do 5 000 kg vrátane.`});
    else guideClassification({group:'C',kind:'lifting',code:'C/d',title:'Ručné zdvíhacie zariadenie s nižšou nosnosťou',reason:`Nosnosť ${capacity.toLocaleString('sk-SK')} kg nedosahuje hranicu B/a/1.`,warning:'Porovnaj účel a vyhotovenie aj s ostatnými položkami prílohy.'});
  }
  if(type==='platform'){
    const height=n('g-height'),motor=v('g-drive')==='motor';
    if(motor&&height>1.5)guideClassification({group:'A',kind:'lifting',code:'A/b',title:'Pohyblivá pracovná plošina',reason:`Motorový pohon a výška zdvihu ${height.toLocaleString('sk-SK')} m je viac ako 1,5 m.`});
    else guideClassification({kind:'lifting',title:'Podmienky A/b nie sú podľa zadaných údajov splnené',reason:`${motor?'Motorový':'Ručný'} zdvih, výška ${height.toLocaleString('sk-SK')} m.`,warning:'Neuzatváraj automaticky skupinu C. Prever, či zariadenie nepatrí do inej položky zdvíhacích zariadení a over určenie výrobcu.'});
  }
  if(type==='forklift'){
    const motor=v('g-truck')==='motor',attachment=v('g-lift')==='attachment';
    if(motor&&attachment)guideClassification({group:'B',kind:'lifting',code:'B/b',title:'Zdvíhacie ústrojenstvo motorového vozíka alebo nakladača',reason:'Zariadenie motorovo zdvíha a prepravuje bremeno vidlicami alebo uchopovacím prostriedkom.'});
    else guideClassification({kind:'lifting',title:'Nie je potvrdené zaradenie B/b',reason:'Zadané vyhotovenie nezodpovedá obom rozhodujúcim podmienkam B/b.',warning:'Ručný paletový vozík je pracovný prostriedok, ale samotné označenie „vozík“ neurčuje VTZ. Over konkrétne vyhotovenie a iné položky prílohy.'});
  }
  if(type==='gas-appliance'){
    const dangerous=v('g-gas')==='danger',power=n('g-power'),flue=v('g-flue')==='yes';
    if(!dangerous)return guideClassification({kind:'gas',title:'Najprv treba určiť druh plynu',reason:'Skupiny A/h a B/h sú viazané na nebezpečný plyn.',warning:'Bez klasifikácie plynu nemožno spoľahlivo určiť skupinu zariadenia.'});
    if(power>500)guideClassification({group:'A',kind:'gas',code:'A/h',title:'Zariadenie na spaľovanie nebezpečného plynu',reason:`Výkon ${power.toLocaleString('sk-SK')} kW je viac ako 500 kW.`});
    else if(power>=5||flue)guideClassification({group:'B',kind:'gas',code:'B/h',title:'Zariadenie na spaľovanie nebezpečného plynu',reason:flue&&power<5?`Výkon ${power.toLocaleString('sk-SK')} kW, spotrebič vyžaduje odťah spalín.`:`Výkon ${power.toLocaleString('sk-SK')} kW je v pásme skupiny B.`});
    else guideClassification({group:'C',kind:'gas',code:'C/a',title:'Zariadenie s nebezpečným plynom mimo porovnávaných hraníc A/h a B/h',reason:`Výkon ${power.toLocaleString('sk-SK')} kW a bez požiadavky na odťah spalín podľa zadaných údajov.`,warning:'Pred záverom porovnaj aj ostatné položky plynových zariadení.'});
  }
  if(type==='electric'){
    const special=v('g-special'),safe=v('g-safe');
    const map={'a-source':'A/a','a-transform':'A/b','a-high':'A/c','a-be2':'A/d','a-be3':'A/e','a-corrosion':'A/f','a-water':'A/g','a-medical':'A/h','a-crowd':'A/i'};
    if(map[special])return guideClassification({group:'A',kind:'electric',code:map[special],title:'Elektrické zariadenie skupiny A',reason:`Zvolená osobitná podmienka zodpovedá položke ${map[special]}.`,warning:'Splnenie podmienky over z protokolu o určení vonkajších vplyvov, projektu a dokumentácie.'});
    if(safe==='no')return guideClassification({group:'B',kind:'electric',code:'B',title:'Ostatné elektrické zariadenie s nebezpečnými hodnotami',reason:'Nie je preukázaná skupina A a hodnoty prúdu alebo napätia nie sú bezpečné.'});
    if(safe==='yes')return guideClassification({group:'C',kind:'electric',code:'C',title:'Elektrické zariadenie mimo A a B',reason:'Podľa zadaného podkladu nejde o skupinu A a bezpečné hodnoty sú pre konkrétne podmienky preukázané.',warning:'Ani 24 V samo osebe automaticky neznamená skupinu C; rozhodujú podmienky a možný prúd.'});
    guideClassification({kind:'electric',title:'Bez podkladu sa skupina B alebo C nedá rozlíšiť',reason:'Samotná hodnota napätia nestačí.',warning:'Vyžiadaj projekt, protokol vonkajších vplyvov a posúdenie bezpečných hodnôt pre konkrétne podmienky.'});
  }
}

/* VTZ katalóg a spoločná karta. */
function vtzHome(){
  show();kind='';group='all';query='';guideResult=null;
  area.innerHTML=head('VTZ · úplné rozdelenie','Použi rýchle zaradenie bežného zariadenia alebo otvor úplný katalóg všetkých 87 položiek.')+guideShell()+`<section class="catalog-entry"><div><span class="eyebrow">ÚPLNÝ KATALÓG</span><h3>A–B–C podľa druhu zariadenia</h3><p>Pre osobitné zariadenia a kontrolu presného znenia otvor celý zoznam.</p></div></section><div class="topics vtz-cards">${Object.entries(C.meta).map(([id,t])=>card(t.title,t.image,t.hint,`data-kind="${id}"`,C.rows.filter(r=>r.kind===id).length+' položiek · A / B / C →')).join('')}</div><div class="catalog-legend"><div><b>A</b><strong>Vysoká miera ohrozenia</strong><span>Je VTZ</span></div><div><b>B</b><strong>Vyššia miera ohrozenia</strong><span>Je VTZ</span></div><div><b>C</b><strong>Nižšia miera ohrozenia</strong><span>Nie je VTZ podľa § 4, ale BOZP platí</span></div></div><div class="new-note"><strong>Najprv zariadenie, potom človek.</strong><p>Skupina A/B/C určuje zaradenie zariadenia. Kto ho môže obsluhovať a kto môže školiť, sa posudzuje podľa konkrétnej činnosti.</p></div>`+source([[C.source,'508/2009: § 2, § 3, § 4 a príloha č. 1, časti I.–IV.']]);
  back(home);
  $('guide-type').onchange=ev=>guideFields(ev.target.value);
  area.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{kind=b.dataset.kind;catalog();});
  top();
}
function catalog(){
  show();
  const t=C.meta[kind];
  area.innerHTML=head(t.title,'Hľadaj bežným názvom alebo filtruj skupinu. Každá položka má laické vysvetlenie, školenie a doklady.','Druhy zariadení')+`<div class="catalog-tools"><label>Hľadať zariadenie<input type="search" id="catalog-search" placeholder="Napr. vzdušník, VZV, nožnicová plošina…" value="${e(query)}"></label><div class="catalog-tabs" aria-label="Skupina zariadení">${['all','A','B','C'].map(g=>`<button type="button" data-group="${g}" aria-pressed="${group===g}">${g==='all'?'Všetky':g} <small>${C.rows.filter(r=>r.kind===kind&&(g==='all'||r.group===g)).length}</small></button>`).join('')}</div></div><p id="catalog-count" aria-live="polite"></p><div class="catalog-grid" id="catalog-list"></div><details class="new-fold"><summary>Ako správne posudzovať ${e(t.title.toLowerCase())}</summary><p>${e(t.note)}</p></details>`+source([[C.source,`508/2009: príloha č. 1, ${t.part} časť – celý rozsah`]]);
  back(vtzHome);
  function filter(){
    query=$('catalog-search').value;
    const q=norm(query);
    const rows=C.rows.filter(r=>r.kind===kind&&(group==='all'||r.group===group)&&searchableCatalog(r).includes(q));
    $('catalog-count').textContent=rows.length+' z '+C.rows.filter(r=>r.kind===kind).length+' položiek';
    $('catalog-list').innerHTML=rows.map(r=>`<button type="button" class="catalog-card" data-code="${e(r.code)}"><span class="catalog-code ${r.group}">${e(r.code)}</span><h3>${e(r.title)}</h3><p>${e(r.plain)}</p><span class="catalog-open">Spoločná karta zariadenia a školení →</span></button>`).join('')||'<p>Nenašla sa zhoda. Skús „Všetky“ alebo bežný názov zariadenia.</p>';
    area.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>catalogDetail(b.dataset.code));
  }
  $('catalog-search').oninput=filter;
  area.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>{group=b.dataset.group;area.querySelectorAll('[data-group]').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));filter();});
  filter();top();
}
function trainingFor(r){
  if(r.group==='C')return ['bozp'];
  if(r.kind==='electric')return ['electrical20','electrical21','electrical22','electrical23','electrical24'];
  if(r.kind==='pressure'){
    if(['A/d','B/d'].includes(r.code))return ['po'];
    if(r.code.startsWith('A/a')||r.code==='B/a')return ['boiler'];
    if(r.code.startsWith('A/b')||r.code.startsWith('B/b'))return ['pressure-vessel'];
    return ['rt-document'];
  }
  if(r.kind==='gas')return r.group==='A'&&!['A/d','A/g'].includes(r.code)?['gas-operator']:r.group==='A'?['gas-station']:['gas-b'];
  if(r.code==='A/a')return ['crane','bridge-crane','slinger'];
  if(r.code==='A/b')return ['road-platform','scissor-platform'];
  if(r.code.startsWith('B/a'))return ['bridge-crane','slinger-b'];
  if(r.code==='B/b')return ['forklift','rt-document'];
  return ['rt-document'];
}
function trainingModeCard(m,fallbackDoc){
  return `<article><div class="mode-title"><h4>${e(m.name)}</h4><span class="answer-tag ${toneFromTag(m.btTag)}">${e(m.btTag)}</span></div><dl><div><dt>Kto školí</dt><dd>${e(m.who)}</dd></div><div><dt>Kedy a ako často</dt><dd>${e(m.time)}</dd></div><div><dt>Doklad</dt><dd>${e(m.doc||fallbackDoc)}</dd></div></dl></article>`;
}
function embeddedTrainings(ids){
  const rows=ids.map(id=>D.rows.find(x=>x.id===id)).filter(Boolean);
  return `<section class="joined-training"><div class="section-heading"><div><span class="eyebrow">OBSLUHA A ŠKOLENIE</span><h3>Kto môže činnosť vykonávať a kto môže školiť?</h3></div><span>${rows.length} súvisiace ${rows.length===1?'oblasť':'oblasti'}</span></div>${rows.map((r,i)=>`<details class="linked-training" ${i===0?'open':''}><summary><span><b>${e(r.title)}</b><small>${e(r.for)}</small></span><span class="answer-tag ${toneFromTag(r.modes[0].btTag)}">${e(r.modes[0].btTag)}</span></summary><div class="linked-training-body">${r.modes.map(m=>trainingModeCard(m,r.doc)).join('')}<button type="button" data-training="${e(r.id)}">Otvoriť samostatný detail školenia →</button></div></details>`).join('')}</section>`;
}
function btChecklist(r){
  const common=['Overiť presný typ, účel, výrobné číslo a údaje zo štítku.','Porovnať parametre s dokumentáciou a rozhodujúcimi podmienkami skupiny.','Overiť oprávnenie alebo odbornú spôsobilosť osôb podľa vykonávanej činnosti.','Skontrolovať doklady o zaškolení, poverení a lehotách kontrol alebo skúšok.'];
  const extra={pressure:'Preveriť médium, tlak, objem, bezpečnostný súčin a ochranu pred prekročením tlaku.',lifting:'Preveriť nosnosť, pohon, spôsob uchopenia bremena, určenie na prepravu osôb a prevádzkové podmienky.',electric:'Preveriť projekt, protokol vonkajších vplyvov, napätie, prúd a osobitné prostredie.',gas:'Preveriť druh plynu, výkon alebo prietok, tlak, odťah spalín a funkčný celok.'};
  return `<section class="bt-check"><span class="eyebrow">ČO MÁ SKONTROLOVAŤ BT</span><h3>Krátky kontrolný zoznam</h3><ul>${[...common,extra[r.kind]].map(x=>`<li>${e(x)}</li>`).join('')}</ul></section>`;
}
function catalogDetail(code){
  const r=C.rows.find(x=>x.kind===kind&&x.code===code),t=C.meta[kind];
  if(!r)return catalog();
  show();
  const training=trainingFor(r);
  const resultLabel=r.group==='C'?'Nie je VTZ podľa § 4':'Vyhradené technické zariadenie skupiny '+r.group;
  area.innerHTML=head(r.title,`${t.title} · príloha č. 1, ${t.part} časť`,'Zoznam zariadení')+`<section class="answer-strip ${resultTone(r.group)}"><span class="answer-mark">${e(r.group)}</span><div><span class="eyebrow">RÝCHLA ODPOVEĎ</span><h3>${e(resultLabel)}</h3><p>${e(r.plain)}</p></div></section><div class="catalog-detail-grid unified"><article><span class="answer-num">1</span><div><span class="eyebrow">ČO TO JE</span><h3>Laické vysvetlenie</h3><p>${e(r.plain)}</p></div></article><article class="catalog-rule"><span class="answer-num">2</span><div><span class="eyebrow">KEDY SEM PATRÍ</span><h3>Rozhodujúce podmienky ${e(r.code)}</h3><p>${e(r.rule)}</p></div></article><article><span class="answer-num">3</span><div><span class="eyebrow">PRÍKLAD</span><h3>Ako to vyzerá v praxi</h3><p>${e(r.example)}</p></div></article></div>`+embeddedTrainings(training)+btChecklist(r)+`<details class="new-fold"><summary>Čo pri zaradení nezameniť</summary><p>${e(t.note)}</p><p>Príklad nenahrádza údaje zo štítku, návodu a dokumentácie. Pri prekryve položiek posúď osobitné vyhotovenie a všetky kritériá; nerozhoduj iba podľa obchodného názvu.</p>${r.kind==='pressure'&&['A/d','B/d'].includes(r.code)?'<p><strong>Hasiace prístroje:</strong> § 26 ods. 1 vylučuje uplatnenie § 8 písm. c), § 15 a § 17 na uvedené tlakové nádoby. Ich skupina preto neznamená automaticky doklad RT pre bežné použitie hasiaceho prístroja.</p>':''}</details>`+source([[C.source,`508/2009: príloha č. 1, ${t.part} časť, ${r.code}`],[C.source,'Odborná spôsobilosť: §§ 15–24; výnimky § 26']]);
  back(catalog);
  area.querySelectorAll('[data-training]').forEach(b=>b.onclick=()=>{returnTo=()=>catalogDetail(code);trainingDetail(b.dataset.training);});
  top();
}

/* Školenia. */
const trainingGroups=[
  ['Všetky','Všetky školenia','Vyhľadávanie v celom katalógu','training'],
  ['Výšky a záchrana','Výšky a záchrana','Postroj, rebríky, strechy, lešenie a horolezecká technika','heights'],
  ['Výroba a pracoviská','Výroba a pracoviská','Stroje, údržba, sklady, chémia a núdzové situácie','training'],
  ['Všeobecné','Bežná práca','Interný BT, externý BT a práca vo výške','training'],
  ['Požiarna ochrana','Požiarna ochrana','TPO, zamestnanci a hliadky','fire-training'],
  ['VTZ','Obsluha VTZ','Každý režim obsluhy samostatne','vtz'],
  ['Odborné','Odborné kvalifikácie','VZV, elektrikári, RT, opravy, lešenie a stroje','truck']
];
function trainingHome(g=''){
  show();trainingGroup=g;returnTo=null;
  area.innerHTML=head(g||'Školenia · kto ich môže vykonávať?',g?'Vyber presnú činnosť. V detaile uvidíš školiteľa, doklad aj lehotu.':'Vyber oblasť alebo použi vyhľadávanie podľa činnosti.',g?'Oblasti školení':'Témy')+(g?`<label class="simple-search">Hľadať činnosť<input id="training-search" type="search" placeholder="Napr. mostový žeriav, kotol, § 20…" value="${e(trainingQuery)}"></label><div class="topics" id="training-cards"></div><p id="training-count" aria-live="polite"></p>`:`<div class="topics vtz-cards">${trainingGroups.map(x=>card(x[1],x[3],x[2],`data-trgroup="${x[0]}"`,'Vybrať činnosť →')).join('')}</div><div class="new-note"><strong>Poverenie nie je univerzálne oprávnenie školiť.</strong><p>Interný BT môže vykonávať oboznamovanie podľa § 7 pri splnení vnútorného predpisu a určení zamestnávateľom. Externé dodávateľské oboznamovanie a odborné kurzy majú vlastné režimy oprávnení.</p></div><details class="new-fold"><summary>Rozdiel medzi zaškolením, opakovaným BOZP a AOP</summary><p><strong>Základná príprava:</strong> prvé získanie potrebných odborných vedomostí a zručností.</p><p><strong>Opakované BOZP podľa § 7:</strong> pravidelné oboznámenie s bezpečnou prácou a rizikami. Nevydáva sa ním nový odborný preukaz.</p><p><strong>AOP:</strong> aktualizačná odborná príprava pre príslušné preukazy, osvedčenia a doklady podľa § 16 ods. 1 písm. b).</p></details>`);
  back(g?()=>{trainingQuery='';trainingHome();}:home);
  area.querySelectorAll('[data-trgroup]').forEach(b=>b.onclick=()=>{trainingQuery='';trainingHome(b.dataset.trgroup);});
  if(g){
    function filter(){
      trainingQuery=$('training-search').value;
      const q=norm(trainingQuery);
      const rows=D.rows.filter(r=>(g==='Všetky'||r.cat===g)&&searchableTraining(r).includes(q));
      $('training-cards').innerHTML=rows.map(r=>card(r.title,r.image,r.intro,`data-training="${r.id}"`,r.modes[0].btTag)).join('')||'<p>Nenašla sa zhoda.</p>';
      $('training-count').textContent=rows.length+' činností';
      area.querySelectorAll('[data-training]').forEach(b=>b.onclick=()=>trainingDetail(b.dataset.training));
    }
    $('training-search').oninput=filter;filter();
  }
  top();
}
function trainingDepth(r){
  if(!r.depth)return '';
  return '<section class="training-depth"><h3>Podrobnosti a praktická príprava</h3><p>Odporúčanú osnovu prispôsob konkrétnemu pracovisku; zákonné minimá sú výslovne označené.</p>'+Object.entries(r.depth).map(([title,items])=>`<details class="new-fold" open><summary>${e(title)}</summary><ul>${items.map(x=>`<li>${e(x)}</li>`).join('')}</ul></details>`).join('')+'</section>';
}
function trainingDetail(id,mode=0){
  show();
  const r=D.rows.find(x=>x.id===id);
  if(!r)return trainingHome(trainingGroup);
  const m=r.modes[mode];
  area.innerHTML=head(r.title,r.for,returnTo?'Zariadenie':'Výber školenia')+`<div class="training-modes" aria-label="Druh prípravy">${r.modes.map((x,i)=>`<button type="button" data-mode="${i}" aria-pressed="${mode===i}">${e(x.name)}</button>`).join('')}</div><section class="answer-strip ${toneFromTag(m.btTag)}"><span class="answer-mark">${toneFromTag(m.btTag)==='stop'?'!':'✓'}</span><div><span class="eyebrow">MÔŽE TO ŠKOLIŤ BEZPEČNOSTNÝ TECHNIK?</span><h3>${e(m.btTag)}</h3><p>${e(m.bt)}</p></div></section><div class="training-facts"><article><span class="answer-num">1</span><h3>Kto presne školí?</h3><p>${e(m.who)}</p></article><article><span class="answer-num">2</span><h3>Kto overí vedomosti a vydá doklad?</h3><p>${e(m.verify)}</p></article><article><span class="answer-num">3</span><h3>Kedy a ako často?</h3><p>${e(m.time)}</p></article><article><span class="answer-num">4</span><h3>Čo musí byť doložené?</h3><p>${e(m.doc||r.doc)}</p></article></div><div class="new-note"><strong>Dôležité pre tento režim</strong><p>${e(m.note)}</p></div><details class="new-fold"><summary>Právny základ pre tento režim</summary><p>${e(m.basis)}</p></details>`+trainingDepth(r)+source(r.sources);
  back(returnTo||(()=>trainingHome(trainingGroup||r.cat)));
  area.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>trainingDetail(id,Number(b.dataset.mode)));
  top();
}

const grid=document.querySelector('#v-home .topics');
grid.insertAdjacentHTML('beforeend',card('VTZ · úplné rozdelenie','vtz','Všetkých 87 položiek · rýchle zaradenie a spoločná karta školení','id="v-open-vtz"','Zaradiť zariadenie →')+card('Školenia · kto môže školiť','training',D.rows.length+' konkrétnych činností · školiteľ, doklad a lehota','id="v-open-training"','Vybrať činnosť →'));
$('v-open-vtz').onclick=vtzHome;
$('v-open-training').onclick=()=>{trainingQuery='';trainingHome();};
['v-open','v-open-storage','v-open-workheight'].forEach(id=>$(id).addEventListener('click',()=>area.classList.add('hidden')));
installGlobalSearch();
})();
