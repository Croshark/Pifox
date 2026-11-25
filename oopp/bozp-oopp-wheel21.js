
/* BOZP Audit 21: risk-driven clickable equipment wheel & documented exchange intervals.
   Existing risk/profession/product/approval flows are reused, not replaced. */
(function(){'use strict';
const PPE=[
 {id:'helmet',title:'Prilba',cls:'bw-helmet',risk:['Padajúce predmety','Elektrické riziko','Pád z výšky']},
 {id:'eyes',title:'Ochrana očí',cls:'bw-eyes',risk:['Odletujúce častice','Chemický kontakt','UV / IR žiarenie']},
 {id:'ears',title:'Ochrana sluchu',cls:'bw-ears',risk:['Hluk']},
 {id:'vest',title:'Reflexná vesta',cls:'bw-vest',risk:['Nízka viditeľnosť']},
 {id:'resp',title:'Ochrana dýchania',cls:'bw-resp',risk:['Prach a aerosóly','Biologické činitele','Chemický kontakt']},
 {id:'shoes',title:'Bezpečnostná obuv',cls:'bw-shoes',risk:['Šmyk a prepichnutie','Padajúce predmety']},
 {id:'gloves',title:'Rukavice',cls:'bw-gloves',risk:['Mechanické poranenie rúk','Chemický kontakt','Tepelné riziko']}
];
const RISK_BUTTONS=[
 ['Mechanické riziko','Mechanické poranenie rúk','⚙'],
 ['Odletujúce častice','Odletujúce častice','✳'],
 ['Hluk','Hluk','◉'],
 ['Prach / aerosóly','Prach a aerosóly','⁙'],
 ['Padajúce predmety','Padajúce predmety','⛑'],
 ['Nízka viditeľnosť','Nízka viditeľnosť','◈']
];
const HTML_ESCAPE=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function currentItems(){return s.items.filter(x=>typeof activeGear==='function'&&activeGear(x.id));}
function has(id){return currentItems().some(x=>x.id===id||(id==='vest'&&x.id==='other-07'));}
function suggested(id){return PPE.find(p=>p.id===id)?.risk.some(r=>s.risks.includes(r))||false;}
window.bozpWheelHTML=function(){
 const selectedCount=PPE.filter(p=>has(p.id)).length;
 const pending=PPE.filter(p=>!has(p.id)&&suggested(p.id)).length;
 const riskControls=RISK_BUTTONS.map(([title,risk,ico])=>`<button type="button" class="bw-risk ${s.risks.includes(risk)?'selected':''}" aria-pressed="${s.risks.includes(risk)}" title="${HTML_ESCAPE(risk)}" onclick="bozpRiskWheelRisk('${risk}')"><span class="bw-risk-icon">${ico}</span><span>${HTML_ESCAPE(title)}</span></button>`).join('');
 const segments=PPE.map(p=>{const state=has(p.id)?'active':suggested(p.id)?'recommended':'unselected';return `<span aria-hidden="true" class="bw-segment ${p.cls} ${state}"><i>${has(p.id)?'✓':suggested(p.id)?'+':'·'}</i></span>`;}).join('');
 // 7 accessible wedge-shaped hit targets, 1 per true equipment category.
 // The radii leave the central shield free of interaction.
 const order=[['helmet',-128],['eyes',-70],['ears',-12],['vest',42],['resp',91],['shoes',142],['gloves',191]];
 const deg=d=>d*Math.PI/180;
 const point=(r,a)=>[256+r*Math.cos(deg(a)),256+r*Math.sin(deg(a))].map(n=>n.toFixed(2)).join(' ');
 const wedgePaths=order.map(([id,a],idx)=>{
  const prev=order[(idx+6)%7][1]-(idx===0?360:0);
  const next=order[(idx+1)%7][1]+(idx===6?360:0);
  const from=(prev+a)/2+1.2,to=(a+next)/2-1.2;
  const d=`M ${point(112,from)} L ${point(237,from)} A 237 237 0 0 1 ${point(237,to)} L ${point(112,to)} A 112 112 0 0 0 ${point(112,from)} Z`;
  const p=PPE.find(x=>x.id===id),state=has(id)?'active':suggested(id)?'recommended':'unselected';
  return `<path class="bw-arc ${state}" data-ppe="${id}" d="${d}" tabindex="0" role="button" aria-label="${HTML_ESCAPE(p.title)}: ${has(id)?'vybrané, zmeniť variant':'pridať alebo vybrať variant'}" aria-pressed="${has(id)}" onclick="bozpRiskWheelTap('${id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();bozpRiskWheelTap('${id}')}"><title>${HTML_ESCAPE(p.title)} – ${state}</title></path>`;
 }).join('');
 const overlay=`<svg class="bw-overlay" viewBox="0 0 512 512" aria-label="Interaktívne segmenty ochranných prostriedkov">${wedgePaths}</svg>`;
 const extras=[['clothes','Pracovný odev'],['fall','Postroj'],['other-01','Tvárový štít']].map(([id,l])=>`<button type="button" class="bw-extra ${has(id)?'selected':''}" onclick="bozpRiskWheelTap('${id}')">${has(id)?'✓ ': '+ '}${l}</button>`).join('');
 return `<div class="bw-shell"><div class="bw-eyebrow"><span>OOPP · INTERAKTÍVNY SYSTÉM</span><span>● PREPOJENÉ S RIZIKAMI</span></div>
 <div class="bw-grid"><div class="bw-risks"><div class="bw-risks-title">Riziká pracoviska</div>${riskControls}</div>
 <div class="bw-wheel"><img src="assets/wheel-premium.webp?v=21.0" draggable="false" alt="Interaktívny kruh OOPP: prilba, okuliare, sluch, reflexná vesta, respirátor, obuv, rukavice">${overlay}${segments}</div></div>
 <div class="bw-toolbar"><b>Výber osobných ochranných prostriedkov</b><div class="bw-status"><span class="bw-pill"><strong>${selectedCount}</strong> vybraných</span><span class="bw-pill"><strong>${pending}</strong> na posúdenie</span></div></div>
 <div class="bw-icon-row"><span style="color:#0fa58f">●</span> Vybrané <span style="color:#e3a02b;margin-left:12px">●</span> Odporúčané <span style="color:#91a3b5;margin-left:12px">●</span> Ostatné</div>
 <div class="bw-helper">Klikni do vybraného segmentu kruhu. Zelené zvýraznenie znamená vybrané OOPP, oranžové odporúčané podľa rizika. Prilba, rukavice a okuliare majú podrobný výber variantov a STN.</div>
 <div class="bw-extras">${extras}</div></div>`;
};
window.bozpRiskWheelTap=function(id){
 const key=id==='vest'&&s.items.some(x=>x.id==='other-07')?'other-07':id;
 if(has(key))v1722EditVariant(id);
 else premiumAddPPE(id);
};
window.bozpRiskWheelRisk=function(risk){premiumRisk(risk);};
// Periodicity is NOT a statutory term. User decides it based on manufacturer and actual use.
function planFor(id){
 if(!s.exchangePlans||typeof s.exchangePlans!=='object')s.exchangePlans={};
 const p=s.exchangePlans[id]||{mode:'condition',amount:6,unit:'months'};return {mode:p.mode,amount:p.amount,unit:p.unit};
}
function periodDesc(p){return p.mode==='condition'?'Podľa stavu / opotrebenia':`Interval ${p.amount} ${p.unit==='days'?'dní':p.unit==='years'?'rokov':'mesiacov'} od prevzatia zamestnancom`;}
window.bozpCycleSet=function(id,field,value){
 if(!['mode','amount','unit'].includes(field))return;
 const old=planFor(id);const p={...old,[field]:field==='amount'?Math.min(3650,Math.max(1,Number(value)||1)):value};
 if(!s.exchangePlans)s.exchangePlans={};s.exchangePlans[id]=p;save();premiumDraw();
};
function docHTML(){
 const rows=currentItems();
 const cards=rows.map(item=>{
  const p=planFor(item.id);const prod=imageProducts.find(v=>v.id===item.productId)||imageProducts.find(v=>v.group===item.id);
  return `<div class="bw-period"><div class="bw-period-name"><img src="${HTML_ESCAPE(prod?.image||'')}" alt=""><div><b>${HTML_ESCAPE(catalog.find(v=>v.id===item.id)?.name||item.id)}</b><small>${HTML_ESCAPE(item.type||prod?.label||'Vybraný variant')}</small></div></div>
  <label>Spôsob výmeny<select aria-label="Spôsob výmeny ${item.id}" onchange="bozpCycleSet('${item.id}','mode',this.value)"><option value="condition" ${p.mode==='condition'?'selected':''}>Podľa stavu / opotrebenia</option><option value="fixed" ${p.mode==='fixed'?'selected':''}>Určený interval</option></select></label>
  ${p.mode==='fixed'?`<div><div class="bw-period-number"><label>Počet<input type="number" min="1" max="3650" step="1" value="${p.amount||6}" onchange="bozpCycleSet('${item.id}','amount',this.value)"></label><label>Jednotka<select onchange="bozpCycleSet('${item.id}','unit',this.value)"><option value="days" ${p.unit==='days'?'selected':''}>Dní</option><option value="months" ${p.unit==='months'?'selected':''}>Mesiacov</option><option value="years" ${p.unit==='years'?'selected':''}>Rokov</option></select></label></div></div>`:`<div class="bw-period-due review">Kontrolovať stav pri použití. Poškodené OOPP vymeniť bezodkladne.</div>`}
  <div class="bw-period-due ${p.mode==='condition'?'review':''}">${HTML_ESCAPE(periodDesc(p))}</div></div>`;
 }).join('');
 return `<section class="bw-doc-card" id="bozp-cycle-documentation"><div class="bw-doc-head"><div class="bw-doc-icon">◷</div><div><h3>Pravidlá a periodicita výmeny OOPP</h3><p>Individuálny interval podľa hodnotenia rizík, opotrebenia a pokynov výrobcu.</p></div></div>
 <div class="bw-doc-list">${cards||'<p>Najprv vyber OOPP v kroku 3. Periodicita sa zobrazí pre každý prostriedok samostatne.</p>'}</div>
 <div class="bw-doc-footer"><span>Tu sa určuje iba interval. Dátum prevzatia a konkrétny termín výmeny sa evidujú pri výdaji v module Zamestnanci.</span></div></section>`;
}
const oldPages=v182SplitPages;
v182SplitPages=function(root){oldPages(root);if(premiumStep===3){const node=root.querySelector('#v17-documents'); if(node)node.insertAdjacentHTML('beforeend',docHTML());}};
// No employee picture in exported documents. Display the same fixed equipment wheel.
reportPortraitDataURI=async function(){
 try{const image=new Image();image.src=new URL('assets/wheel-premium.webp?v=21.0',document.baseURI).href;await image.decode();const c=document.createElement('canvas');c.width=600;c.height=600;const ctx=c.getContext('2d');ctx.fillStyle='#eff6fc';ctx.fillRect(0,0,600,600);ctx.drawImage(image,0,0,600,600);return c.toDataURL('image/png');}catch(e){return null}
};
function exportRows(){return currentItems().map(item=>{const p=planFor(item.id);return `<tr><td>${HTML_ESCAPE(catalog.find(x=>x.id===item.id)?.name||item.id)}</td><td>${HTML_ESCAPE(item.type||'')}</td><td>${HTML_ESCAPE(periodDesc(p))}</td></tr>`;}).join('');}
function exportSection(){return `<section><h2>Pravidlá výmeny OOPP</h2><table style="width:100%;border-collapse:collapse;font-size:10px"><thead><tr><th>OOPP</th><th>Variant</th><th>Interval</th></tr></thead><tbody>${exportRows()||'<tr><td colspan="3">Žiadne OOPP</td></tr>'}</tbody></table><p>Interval vychádza z posúdenia rizík, stavu OOPP a pokynov výrobcu. Konkrétny termín výmeny sa počíta od prevzatia zamestnancom v evidencii výdaja.</p></section>`;}
const originalReport=reportHTML;
reportHTML=function(data){let html=originalReport(data);html=html.replace('Ilustračná výstroj pracovníka','Grafický prehľad ochranných prostriedkov').replace('Ilustračná výstroj –','Grafický prehľad –').replace('Základný pracovník','Prehľad OOPP');return html.replace('</main></body></html>',exportSection()+'</main></body></html>');};
const originalIssue=issueCardHTML;
issueCardHTML=function(){const html=originalIssue();return html.replace('<div class="sign">',exportSection()+'<div class="sign">');};
// Existing premium route, saved draft, catalog and document exports remain intact.
const baseDraw=premiumDraw;
premiumDraw=function(){const result=baseDraw();return result;};
window.bozpWheelDebug=()=>({selected:currentItems().map(i=>i.id),risks:s.risks,plans:s.exchangePlans||{},documentHTML:exportSection()});
if(typeof premiumDraw==='function')premiumDraw();
})();
