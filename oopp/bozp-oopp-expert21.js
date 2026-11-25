/* BOZP Audit V21.1 – expert PPE selection and real STN metadata.
   This module adds UI and information only, never claims product certification. */
(function(){'use strict';
const DATA={"gloves-01": ["STN EN ISO 21420 · STN EN 388", "Oder, rez, trhanie, prepichnutie; prípadne náraz", "Požadovať reálny kód EN 388 (napr. 4X43D), materiál a rozmer", "Kód výrobku nesmie byť vymyslený; pri rotujúcom náradí over zachytenie"], "gloves-02": ["STN EN ISO 21420 · STN EN 388", "Ochrana pred porezaním podľa skúšky daného výrobku", "Určiť výkonnostnú úroveň rezu podľa ISO 13997 (A–F) a ďalšie úrovne EN 388", "Vyššia úroveň rezu automaticky neznamená ochranu proti vpichu"], "gloves-03": ["STN EN ISO 21420 · STN EN ISO 374-1", "Chemické riziká – len voči preukázaným látkam", "Z KBÚ overiť konkrétnu chemikáliu, permeáciu, degradáciu a typ A/B/C", "Bez tabuľky chemickej odolnosti a údajov výrobcu nedá sa schváliť"], "gloves-04": ["STN EN ISO 21420 · STN EN 407", "Kontaktné a ďalšie tepelné riziká podľa skúšok", "Overiť úroveň ochrany proti kontaktnému/sálavému teplu a plameňu", "Tepelná rukavica neznamená automatickú chemickú alebo elektrickú ochranu"], "gloves-05": ["STN EN 12477", "Zváranie – mechanická a tepelná ochrana", "Vybrať typ A alebo B podľa zvárania; overiť teplo, iskry a citlivosť", "Nie je určená na prácu pod napätím"], "gloves-06": ["STN EN 60903", "Ochrana proti úrazu elektrickým prúdom pri prácach pod napätím", "Určiť izolačnú triedu a prípustné napätie z označenia, kontrolovať podľa výrobcu", "Nemožno zameniť za ESD alebo bežné pracovné rukavice"], "gloves-07": ["STN EN ISO 21420 · STN EN 511", "Ochrana pred chladom", "Overiť úrovne konvekčného/kontaktného chladu a prieniku vody", "Nie každá zateplená rukavica spĺňa EN 511"], "gloves-08": ["STN EN ISO 21420; EN ISO 374 len pri deklarovanej ochrane", "Jednorazové nitrilové – hygienické alebo chemické činnosti podľa výrobku", "Overiť deklarovanú chemickú odolnosť, alergény, hrúbku a dobu použitia", "Samotný materiál nitril nedokazuje chemickú ochranu"], "gloves-09": ["STN EN ISO 21420; EN ISO 374 len pri deklarovanej ochrane", "Jednorazové latexové – podľa určenia výrobcu", "Overiť chemické skúšky, alergie na latex a konkrétny účel", "Nie sú automaticky ochranou pred chemikáliami"], "gloves-10": ["STN EN 16350", "Elektrostaticky disipativne rukavice – riziko výbušnej atmosféry", "Overiť pre ATEX/ESD proces použiteľnosť a uzemnenie celej osoby", "EN 16350 nie je elektroizolačná ochrana pred elektrickým prúdom"], "eyes-01": ["STN EN ISO 16321-1", "Číre ochranné okuliare proti deklarovanému mechanickému riziku", "Vyžadovať označenie pre náraz a vhodnosť pre dané častice", "Číre sklá automaticky nechránia pred chemickým postrekom"], "eyes-02": ["STN EN ISO 16321-1", "Dymové sklá – oslnenie alebo optické žiarenie len podľa deklarácie", "Overiť triedu/účel filtra a vhodnosť pre interiér či exteriér", "Tmavá farba sama nepreukazuje UV alebo IR ochranu"], "eyes-03": ["STN EN ISO 16321-1", "Tmavé filtre – iba ak označenie potvrdzuje potrebnú ochranu", "Overiť kód filtrácie a prípustnú priepustnosť; pri zváraní osobitné požiadavky", "Farba skiel nenahrádza označenie certifikovaného filtra"], "eyes-04": ["STN EN ISO 16321-1", "Žlté sklá pre vizuálne podmienky podľa výrobcu", "Overiť nárazovú odolnosť a deklarované optické vlastnosti", "Žlté sfarbenie nie je dôkaz UV ani zváračského filtra"], "eyes-05": ["STN EN ISO 16321-1", "Uzavreté okuliare – mechanické, prachové alebo kvapalinové riziko podľa označenia", "Overiť tesnenie, vetranie, označenie pre postrek/kvapaliny a kompatibilitu s respirátorom", "Nie všetky uzavreté okuliare sú chemicky alebo plynotesne odolné"], "eyes-06": ["STN EN ISO 16321-1", "Ochranné okuliare cez dioptrické okuliare", "Overiť prekrytie, bočné krytie a kompatibilitu s dioptrickým rámom", "Bežné dioptrické okuliare nie sú automaticky OOPP"], "eyes-07": ["STN EN ISO 16321-1", "Okuliare s bočnou ochranou – podľa konkrétneho tvaru a označenia", "Overiť ochranu pred odletujúcimi časticami zo strán", "Pri riziku postreku kvapalín môžu byť potrebné uzavreté okuliare"]};
const ALIASES={"gloves-06": "Elektroizolačné (práce pod napätím)", "gloves-10": "Antistatické / ESD pre ATEX", "eyes-03": "Tmavé okuliare – filter podľa značenia", "eyes-06": "Okuliare cez dioptrie", "eyes-07": "Okuliare s bočnou ochranou"};
const esc2=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const productById=id=>imageProducts.find(p=>p.id===id);
const productInfo=id=>DATA[id]||null;
window.bozpExpertNormInfo=Object.fromEntries(Object.entries(DATA).map(([k,d])=>[k,[d[0],d[1]+'. Kontrola: '+d[2]+'. Obmedzenie: '+d[3]+'. Výsledné vlastnosti musí preukázať dokumentácia konkrétneho výrobku.']]));
Object.entries(ALIASES).forEach(([id,label])=>{const p=productById(id);if(p)p.label=label;});
// Distinct technical illustrations where old stock thumbs represented the wrong class.
[['gloves-06','assets/expert/insulating-gloves.svg'],['eyes-06','assets/expert/over-glasses.svg'],['eyes-03','assets/expert/filtered-lenses.svg']].forEach(([id,image])=>{const p=productById(id);if(p)p.image=image;});
if(!productById('gloves-10')){
 const model=productById('gloves-01');
 imageProducts.push({id:'gloves-10',group:'gloves',label:ALIASES['gloves-10'],image:model?.image||'assets/clean/b09.webp?v=16.6',visualNote:'Ilustračná fotografia – EN 16350 nie je z obrázka overiteľná.'});
}
const eyes=catalog.find(x=>x.id==='eyes'),gloves=catalog.find(x=>x.id==='gloves');
if(eyes){eyes.norm='STN EN ISO 16321-1';eyes.types=[...new Set([...eyes.types,'Číre ochranné okuliare','Uzavreté okuliare proti kvapalinám a prachu'])];}
if(gloves){gloves.norm='STN EN ISO 21420 + špecifické normy podľa rizika';gloves.types=[...new Set([...gloves.types,'ESD / antistatické rukavice EN 16350','Elektroizolačné rukavice EN 60903 – určiť triedu'])];}
function productStatus(p){
 const selectedItem=s.items.find(i=>i.id===p.group||i.id===p.id);
 if(selectedItem?.productId===p.id && (typeof activeGear!=='function'||activeGear(selectedItem.id)))return 'selected';
 if(selectedItem && (typeof activeGear!=='function'||activeGear(selectedItem.id)))return 'alternate';
 const cat=catalog.find(c=>c.id===p.group);
 if(cat&&s.risks.some(r=>cat.risk.includes(r)))return 'recommended';
 return 'idle';
}
function meta(p){const d=productInfo(p.id);return d?{norm:d[0],protect:d[1],check:d[2],warning:d[3]}:{norm:catalog.find(c=>c.id===p.group)?.norm||'Over podľa výrobcu',protect:'Vlastnosti určiť podľa konkrétneho výrobku',check:'Overiť deklaráciu a vhodnosť',warning:'Obrázok je iba ilustračný'};}
function stats(category){const list=imageProducts.filter(p=>p.group===category);return [list.length,list.filter(p=>productStatus(p)==='selected').length];}
window.bozpExpertCatalogHTML=function(){
 const allCats=Object.entries(premiumCategoryMeta);
 const cards=activeCatalog().slice(0,12).map(p=>{
  const m=meta(p),state=productStatus(p),chosen=state==='selected';
  const stateTxt={selected:'✓ Vybrané',recommended:'Odporúčané',alternate:'Iný variant vybraný',idle:'Vybrať variant'}[state];
  return `<article class="be-tile ${state}" data-product-id="${esc2(p.id)}" data-status="${state}">
    <button type="button" class="be-product" onclick="premiumSelectItem('${p.id}')" aria-pressed="${chosen}" aria-label="${esc2(p.label)} – ${stateTxt}">
      <span class="be-top"><span class="be-state">${stateTxt}</span><span class="be-check">${chosen?'✓':'+'}</span></span>
      <span class="be-product-photo"><img src="${esc2(p.image)}" loading="lazy" alt="Ilustrácia: ${esc2(p.label)}"></span>
      <span class="be-product-name">${esc2(p.label)}</span><span class="be-standard">${esc2(m.norm)}</span>
      <span class="be-protection">${esc2(m.protect)}</span>
    </button><button type="button" class="be-info" onclick="bozpExpertOpen(event,'${p.id}')" aria-label="Norma a ochranné vlastnosti: ${esc2(p.label)}">ⓘ Detail STN</button>
  </article>`;
 }).join('');
 const [count,selectedCount]=stats(premiumCategory);
 return `<div class="v17x-accordion be-catalog"><details id="v17-catalog-detail" data-keep-open><summary>Rozšírený katalóg a varianty <span class="be-catalog-count">${selectedCount} vybrané / ${count} variantov</span></summary><div class="inside">
  <div class="be-legend"><span class="be-legend-dot chosen"></span> Vybrané <span class="be-legend-dot recommended"></span> Odporúčané <span class="be-legend-dot neutral"></span> Nevybrané</div>
  <div class="v17x-cat-tabs">${allCats.map(([id,[label,ico]])=>`<button type="button" class="${id===premiumCategory?'active':''}" onclick="premiumCategorySet('${id}')" aria-pressed="${id===premiumCategory}"><span>${ico}</span> ${esc2(label)}</button>`).join('')}</div>
  <div class="be-cards">${cards||'<p class="sub">Žiadne výsledky pre túto kategóriu.</p>'}</div>
  <p class="be-disclaimer">Označenie STN je odborná pomôcka. Farba a fotografia nepreukazujú skúšky, triedu ochrany ani zhodu výrobku. Výkonový kód a kompatibilitu doplň podľa označenia a dokumentácie výrobcu.</p>
 </div></details></div>`;
};
window.bozpExpertSelectedInfo=function(item){
 const product=productById(item.productId),d=productInfo(product?.id);
 const relevant=d?.[0]||catalog.find(c=>c.id===item.id)?.norm||'Overiť výrobcu';
 return `<div class="be-selected-stn"><b>${esc2(relevant)}</b><span>${d?'Určiť výkon podľa označenia výrobku':'Norma a trieda podľa konkrétneho výrobku'}</span></div>`;
};
// Persist the actual product marking only when entered from the supplier documentation.
window.bozpExpertMarkingInput=function(item){
 if(item.id!=='gloves'&&item.id!=='eyes')return '';
 const what=item.id==='gloves'?'EN 388: napr. 4X43D, EN ISO 374: typ A/B/C':'Označenie filtra a mechanickej ochrany';
 return `<label class="be-marking">Skutočné značenie výrobku<input type="text" maxlength="90" placeholder="${esc2(what)}" value="${esc2(item.ppeMarking||'')}" onchange="bozpExpertMark('${item.id}',this.value)"></label>`;
};
window.bozpExpertMark=function(id,value){
 const item=s.items.find(i=>i.id===id);if(!item)return;
 item.ppeMarking=String(value||'').trim().slice(0,90);save();
};
window.bozpExpertOpen=function(ev,id){
 ev?.stopPropagation();ev?.preventDefault();document.getElementById('be-modal')?.remove();
 const p=productById(id);if(!p)return;
 const m=meta(p);
 const el=document.createElement('div');el.id='be-modal';el.className='be-modal';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Odborné informácie OOPP');
 el.innerHTML=`<div class="be-modal-shade" data-close="1"></div><section class="be-modal-card"><div class="be-modal-header"><div><small>ODBORNE OVERENÉ ODKAZY NA STN</small><h3>${esc2(p.label)}</h3></div><button type="button" class="be-close" data-close="1" aria-label="Zavrieť">×</button></div><div class="be-modal-body"><div class="be-modal-photo"><img src="${esc2(p.image)}" alt="Ilustračný výrobok"></div><div class="be-modal-content"><p class="be-modal-label">Referenčná norma</p><strong>${esc2(m.norm)}</strong><p class="be-modal-label">Predpokladané použitie</p><p>${esc2(m.protect)}</p><p class="be-modal-label">Pred schválením over</p><p>${esc2(m.check)}</p><div class="be-modal-warning">⚠ ${esc2(m.warning)}</div></div></div><div class="be-modal-foot"><a href="https://normy.normoff.gov.sk/vyhladavanie/" target="_blank" rel="noopener noreferrer">ÚNMS SR – katalóg noriem ↗</a><span>Norma nie je certifikát konkrétneho OOPP.</span></div></section>`;
 el.addEventListener('click',e=>{if(e.target.closest('[data-close]'))el.remove()});
 document.body.appendChild(el);el.querySelector('.be-close')?.focus();
};
function markingTable(){
 const rows=s.items.filter(i=>i.ppeMarking&&['gloves','eyes'].includes(i.id)).map(i=>`<tr><td>${esc2(catalog.find(c=>c.id===i.id)?.name||i.id)}</td><td>${esc2(i.type||'')}</td><td>${esc2(i.ppeMarking)}</td></tr>`).join('');
 return rows?`<section style="margin:12px 0"><h2>Doložené značenie a úrovne ochrany</h2><table style="width:100%;border-collapse:collapse;font-size:10px"><tr><th>OOPP</th><th>Variant</th><th>Značenie z výrobku</th></tr>${rows}</table><p style="font-size:9px">Značenie zadané používateľom; požadované skúšky a hodnoty treba preveriť v dokumentácii výrobcu.</p></section>`:'';
}
const origExpertReport=reportHTML;
reportHTML=function(...args){return origExpertReport(...args).replace('</main></body></html>',markingTable()+'</main></body></html>');};
const origExpertIssue=issueCardHTML;
issueCardHTML=function(...args){return origExpertIssue(...args).replace('<div class="sign">',markingTable()+'<div class="sign">');};
window.bozpExpertDebug=()=>({gloves:imageProducts.filter(p=>p.group==='gloves').length,eyes:imageProducts.filter(p=>p.group==='eyes').length,selected:s.items.map(x=>({id:x.id,productId:x.productId})),hasInfo:!!window.bozpExpertNormInfo['eyes-01']});
// Repaint only after adding the extended product metadata.
if(typeof premiumDraw==='function')premiumDraw();
})();
