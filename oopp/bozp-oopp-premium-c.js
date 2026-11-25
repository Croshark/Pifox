/* BOZP Audit V21.2 PREMIUM · Variant C: native wheel hit areas + dynamic detail.
   Wheel illustration remains untouched. All visual states are in a clean, accessible
   perimeter indicator and the right-hand inspector; no filled wedges or bubbles. */
(function(){'use strict';
const PPE=[
 {id:'helmet',label:'Ochranná prilba',category:'helmet',norm:'STN EN 397',angle:-128,why:'Náraz hlavy, padajúce predmety – podľa konkrétneho pracoviska.'},
 {id:'eyes',label:'Ochrana očí',category:'eyes',norm:'STN EN ISO 16321-1',angle:-70,why:'Ochrana očí proti deklarovaným rizikám podľa označenia výrobku.'},
 {id:'ears',label:'Ochrana sluchu',category:'ears',norm:'STN EN 352 (podľa typu)',angle:-12,why:'Zníženie expozície hluku; dôležitý útlm a kompatibilita.'},
 {id:'vest',label:'Výstražná vesta',category:'other',norm:'STN EN ISO 20471',angle:42,why:'Zvýšenie viditeľnosti – overiť triedu a podmienky použitia.'},
 {id:'resp',label:'Ochrana dýchania',category:'resp',norm:'STN EN 149 / EN 140 (podľa typu)',angle:91,why:'Výber podľa škodliviny, expozičných podmienok a ochranného faktora.'},
 {id:'shoes',label:'Bezpečnostná obuv',category:'shoes',norm:'STN EN ISO 20345',angle:142,why:'Bezpečnostná trieda a doplnkové vlastnosti podľa rizika.'},
 {id:'gloves',label:'Ochranné rukavice',category:'gloves',norm:'STN EN ISO 21420 + norma ochrany',angle:191,why:'Výkonnostná trieda podľa rizika; pozor na zachytenie rotujúcou časťou.'}
];
const RISK=[['Mechanické riziko','Mechanické poranenie rúk','⚙'],['Odletujúce častice','Odletujúce častice','✳'],['Hluk','Hluk','◉'],['Prach / aerosóly','Prach a aerosóly','⁙'],['Padajúce predmety','Padajúce predmety','⛑'],['Nízka viditeľnosť','Nízka viditeľnosť','◈']];
const html=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let focused='helmet';
function catById(id){return PPE.find(x=>x.id===id)}
function item(id){return s.items.find(x=>(x.id===id||(id==='vest'&&x.id==='other-07'))&&activeGear(x.id))}
function recommended(id){const row=catById(id);return !!row && row.id==='vest'?s.risks.includes('Nízka viditeľnosť'): !!(row&&catalog.find(x=>x.id===id)?.risk?.some(r=>s.risks.includes(r)));}
function status(id){return item(id)?'selected':recommended(id)?'recommended':'inactive'}
const rad=v=>v*Math.PI/180;
const xy=(r,d)=>[256+r*Math.cos(rad(d)),256+r*Math.sin(rad(d))].map(v=>v.toFixed(1)).join(' ');
function angles(i){const prev=PPE[(i+6)%7].angle-(i===0?360:0), a=PPE[i].angle, next=PPE[(i+1)%7].angle+(i===6?360:0);return [(prev+a)/2+2,(a+next)/2-2]}
function hitPath(i){const [a,b]=angles(i);return `M ${xy(105,a)} L ${xy(241,a)} A 241 241 0 0 1 ${xy(241,b)} L ${xy(105,b)} A 105 105 0 0 0 ${xy(105,a)} Z`}
function rim(i){const [a,b]=angles(i);return `M ${xy(249,a)} A 249 249 0 0 1 ${xy(249,b)}`}
window.bozpWheelHTML=function(){
 const risks=RISK.map(([title,risk,ico])=>`<button type="button" class="bw-risk ${s.risks.includes(risk)?'selected':''}" aria-pressed="${s.risks.includes(risk)}" onclick="bozpRiskWheelRisk('${risk}')"><span class="bw-risk-icon">${ico}</span><span>${title}</span></button>`).join('');
 const regions=PPE.map((p,i)=>`<path class="bc-hit" data-group="${p.id}" data-state="${status(p.id)}" d="${hitPath(i)}" tabindex="0" role="button" aria-label="${html(p.label)} – otvoriť detail" onclick="bozpRiskWheelTap('${p.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();bozpRiskWheelTap('${p.id}')}"><title>${html(p.label)}</title></path>`).join('');
 const rings=PPE.map((p,i)=>`<path class="bc-rim ${status(p.id)} ${focused===p.id?'focused':''}" d="${rim(i)}"/>`).join('');
 const statuses=PPE.map(p=>`<button type="button" class="bc-mini ${status(p.id)} ${focused===p.id?'focused':''}" onclick="bozpRiskWheelTap('${p.id}')" aria-pressed="${!!item(p.id)}">${item(p.id)?'✓ ':''}${html(p.label)}</button>`).join('');
 const extras=[['clothes','Pracovný odev'],['fall','Postroj'],['other','Ďalšie OOPP']].map(([id,label])=>`<button type="button" class="bw-extra" onclick="bozpWheelExtra('${id}')">${label} ↗</button>`).join('');
 return `<div class="bw-shell bc-shell"><div class="bw-eyebrow"><span>OOPP · INTERAKTÍVNY SYSTÉM</span><span>PREPOJENÉ S RIZIKAMI</span></div><div class="bw-grid"><div class="bw-risks"><div class="bw-risks-title">Riziká pracoviska</div>${risks}</div><div class="bw-wheel bc-wheel"><img src="assets/wheel-premium.webp?v=21.2" alt="Kruh kategórií OOPP. Kliknutím otvoríš detail vpravo." draggable="false"><svg class="bc-overlay" viewBox="0 0 512 512" aria-label="Výber kategórií OOPP"><g aria-hidden="true">${rings}</g>${regions}</svg></div></div><div class="bc-state-legend"><span><i class="bc-dot selected"></i> Vybrané</span><span><i class="bc-dot recommended"></i> Odporúčané</span><span><i class="bc-dot inactive"></i> Nevybrané</span></div><div class="bc-mini-row">${statuses}</div><p class="bc-instruction">Klikni priamo na časť kruhu. Vpravo sa zobrazia varianty, odborné informácie a možnosť priradenia.</p><div class="bw-extras">${extras}</div></div>`;
};
window.bozpRiskWheelTap=function(id){
 if(!catById(id))return;
 focused=id;premiumCategory=catById(id).category;
 premiumDraw();
 if(window.matchMedia('(max-width: 800px)').matches)document.getElementById('bc-dynamic-detail')?.scrollIntoView({behavior:'smooth',block:'start'});
};
window.bozpWheelExtra=function(id){premiumCategory=id;premiumDraw();const pane=document.getElementById('v17-catalog-detail');if(pane){pane.open=true;pane.scrollIntoView({behavior:'smooth',block:'center'})}};
window.bozpWheelToggle=function(id){const key=id==='vest'&&s.items.some(x=>x.id==='other-07')?'other-07':id;premiumAddPPE(key);focused=id;};
window.bozpWheelChoose=function(id){const p=imageProducts.find(v=>v.id===id);if(!p)return;focused=p.id==='other-07'?'vest':p.group;if(id==='other-07')s.items=s.items.filter(x=>x.id!=='vest');premiumSelectItem(id);};
window.bozpWheelAll=function(id){premiumCategory=catById(id)?.category||id;premiumDraw();const panel=document.getElementById('v17-catalog-detail');if(panel){panel.open=true;panel.scrollIntoView({behavior:'smooth',block:'nearest'})}};
function detailsHTML(){
 const p=catById(focused)||PPE[0],it=item(p.id),available=(p.id==='vest'?imageProducts.filter(x=>x.id==='other-07'):imageProducts.filter(x=>x.group===p.category));
 const prod=it?.productId?imageProducts.find(x=>x.id===it.productId):null;
 const pics=available.slice(0,6).map(v=>{
  const chosen=it?.productId===v.id;const norm=window.bozpExpertNormInfo?.[v.id]?.[0]||p.norm;
  return `<button class="bc-variant ${chosen?'chosen':''}" type="button" onclick="bozpWheelChoose('${v.id}')" aria-pressed="${chosen}"><img src="${html(v.image)}" loading="lazy" alt="${html(v.label)}"><span class="bc-variant-name">${html(v.label)}</span><small>${chosen?'✓ Vybraný variant':'Vybrať variant'}</small><span class="bc-small-norm">${html(norm)}</span></button>`
 }).join('');
 return `<section class="bc-panel" id="bc-dynamic-detail" aria-label="Detail zvolenej kategórie OOPP"><div class="bc-panel-header"><div><small>DETAIL VYBRANEJ KATEGÓRIE</small><h3>${html(p.label)}</h3></div><span class="bc-panel-state ${status(p.id)}">${it?'✓ Priradené':recommended(p.id)?'Odporúčané':'Nevybrané'}</span></div><div class="bc-panel-desc"><b>${html(p.norm)}</b><p>${html(p.why)}</p></div><div class="bc-panel-actions"><button class="bc-primary" onclick="bozpWheelToggle('${p.id}')">${it?'− Odobrať OOPP':'+ Pridať OOPP'}</button><button class="bc-secondary" onclick="bozpWheelAll('${p.id}')">Všetky varianty ↗</button></div><div class="bc-panel-current">${it?`Aktuálne: <strong>${html(it.type||prod?.label||'Všeobecný výber')}</strong>`:'Vyber konkrétny variant nižšie alebo použi tlačidlo Pridať.'}</div><div class="bc-panel-variants">${pics||'<p>Varianty sú dostupné v rozšírenom katalógu.</p>'}</div><p class="bc-panel-note">Ilustračné obrázky nenahrádzajú označenie, výkonnostnú triedu a dokumentáciu konkrétneho výrobku. Posúdenie vykonáva bezpečnostný technik.</p></section>`;
}
const originalSplit=v182SplitPages;
v182SplitPages=function(root){originalSplit(root);if(premiumStep!==2)return;const selected=root.querySelector('#v17-selected');if(!selected)return;const existing=selected.querySelector('#bc-dynamic-detail');if(existing)existing.remove();const anchor=selected.querySelector('.v183-approval-actions')||selected.querySelector('.v17x-head');if(anchor)anchor.insertAdjacentHTML('afterend',detailsHTML());};
window.bozpWheelCDebug=()=>({focused,selected:PPE.filter(p=>!!item(p.id)).map(p=>p.id),variants:document.querySelectorAll('#bc-dynamic-detail .bc-variant').length,clickTargets:document.querySelectorAll('.bc-hit').length,markers:document.querySelectorAll('.bw-segment').length});
premiumDraw();
})();
