/* BOZP Audit V22.28 – Sapphire katalog s predvyberom podla rizik. */
(function(){'use strict';
const CATS=[
 {id:'helmet',label:'Hlava',title:'Ochrana hlavy',image:'assets/ppe-v213/helmet.webp'},
 {id:'eyes',label:'Oči',title:'Ochrana očí',image:'assets/ppe-v213/eyes.webp'},
 {id:'ears',label:'Sluch',title:'Ochrana sluchu',image:'assets/ppe-v213/ears.webp'},
 {id:'gloves',label:'Ruky',title:'Ochrana rúk',image:'assets/ppe-v213/gloves.webp'},
 {id:'shoes',label:'Obuv',title:'Bezpečnostná obuv',image:'assets/ppe-v213/shoes.webp'},
 {id:'vest',label:'Viditeľnosť',title:'Výstražný odev',image:'assets/ppe-v213/vest.webp'},
 {id:'resp',label:'Dýchanie',title:'Ochrana dýchania',image:'assets/ppe-v213/resp.webp'}
];
const EXTRA=[
 {id:'clothes',label:'Odev',title:'Ochranný pracovný odev',image:'assets/ppe-v213/vest.webp'},
 {id:'fall',label:'Pád',title:'Ochrana proti pádu',image:'assets/ppe-v213/vest.webp'},
 {id:'other',label:'Ďalšie',title:'Ďalšie ochranné prostriedky',image:'assets/ppe-v213/vest.webp'}
];
let focus='helmet';
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cat(id){return CATS.find(x=>x.id===id)||EXTRA.find(x=>x.id===id)||CATS[0]}
function selected(id){return s.items.find(x=>activeGear(x.id)&&(x.id===id||(id==='vest'&&x.id==='other-07')))}
function groups(){return typeof v17SuggestionGroups==='function'?v17SuggestionGroups():[]}
function suggested(id){return groups().includes(id)||(id==='vest'&&groups().includes('other-07'))}
function products(id){
 if(id==='vest')return imageProducts.filter(x=>x.id==='other-07'||x.group==='vest'||(x.group==='other'&&/vest|viditeľ|reflex/i.test(x.label)));
 return imageProducts.filter(x=>x.group===id);
}
function reasons(id){
 const base=catalog.find(x=>x.id===id);if(!base)return [];
 return (s.risks||[]).filter(r=>(base.risk||[]).includes(r));
}
function currentProduct(id){const it=selected(id);return it?.productId?imageProducts.find(x=>x.id===it.productId):null}
function productGrid(id){
 const current=selected(id),list=products(id).slice(0,6);
 if(!list.length)return '<p class="s28-empty">Varianty tejto kategórie otvoríš v rozšírenom katalógu.</p>';
 return list.map((p,index)=>{
   const chosen=current?.productId===p.id;const recommend=suggested(id)&&index===0;
   return `<button type="button" class="s28-product ${chosen?'chosen':''}" onclick="bozpS28Choose('${p.id}','${id}')" aria-pressed="${chosen}">${recommend?'<span class="s28-rec-label">Odporúčané</span>':''}<img src="${h(p.image)}" loading="lazy" alt="${h(p.label)}"><b>${h(p.label)}</b><small>${h((window.bozpExpertNormInfo?.[p.id]?.[0])||(catalog.find(x=>x.id===id)?.norm)||'Overiť označenie výrobku')}</small><em>${chosen?'✓ Vybrané':'Vybrať variant'}</em></button>`;
 }).join('');
}
function catalogHTML(){
 const c=cat(focus),it=selected(c.id),why=reasons(c.id);
 const rail=CATS.map(x=>`<button type="button" class="s28-cat ${focus===x.id?'active':''}" onclick="bozpS28Category('${x.id}')"><img src="${x.image}" alt=""><span>${x.label}</span>${suggested(x.id)?'<em>1</em>':''}</button>`).join('');
 return `<div class="s28-shell"><nav class="s28-rail" aria-label="Kategórie OOPP">${rail}<button type="button" class="s28-cat" onclick="bozpWheelExtra('other')"><span class="s28-more">＋</span><span>Ďalšie</span></button></nav><section class="s28-catalog"><div class="s28-catalog-head"><div><b>${h(c.title)}</b><small>${why.length?'Odporúčané pre: '+h(why.join(', ')):'Dobrovoľná alebo doplnková ochrana podľa posúdenia'}</small></div><span>${products(c.id).length} variantov</span></div><div class="s28-category-state ${it?'is-selected':suggested(c.id)?'is-recommended':''}">${it?'✓ Kategória je priradená':suggested(c.id)?'Odporúčané podľa rizík – vyber konkrétny variant':'Kategória zatiaľ nie je vybraná'}${it?`<button type="button" onclick="premiumAddPPE('${it.id}')">Odobrať</button>`:''}</div><div class="s28-products">${productGrid(c.id)}</div><div class="s28-catalog-foot"><span>Obrázky sú ilustračné. Rozhoduje označenie a dokumentácia konkrétneho výrobku.</span><button type="button" onclick="bozpWheelAll('${c.id}')">Rozšírený katalóg ↗</button></div></section></div>`;
}
window.bozpWheelHTML=catalogHTML;
window.bozpS28Category=function(id){focus=cat(id).id;premiumCategory=focus==='vest'?'other':focus;premiumDraw()};
window.bozpS28Choose=function(productId,id){focus=id;premiumSelectItem(productId)};
function suggestionCards(){
 const ids=groups();
 if(!ids.length)return '<p class="s28-no-risk">V kroku 2 zatiaľ nie sú označené riziká.</p>';
 return ids.slice(0,6).map(id=>{
   const c=cat(id),it=selected(id),p=currentProduct(id)||products(id)[0],why=reasons(id);
   return `<button type="button" class="s28-suggestion ${it?'done':'needs'}" onclick="bozpS28Category('${id}')"><img src="${h(p?.image||c.image)}" alt=""><span><b>${h(c.title)}</b><small>${h(why[0]||'Podľa označeného rizika')}</small></span><em>${it?'✓ Predvybrané':'Spresniť variant'}</em></button>`;
 }).join('');
}
function riskBanner(){
 const riskTags=(s.risks||[]).slice(0,8).map(r=>`<span>${h(r)}</span>`).join('');
 return `<div class="s28-auto"><div class="s28-auto-head"><div class="s28-spark">✦</div><div><h3>Preddefinovaný výber podľa rizík</h3><p>Z kroku 2 sa automaticky preniesli odporúčané skupiny OOPP. Skontroluj a spresni konkrétny variant.</p></div><button type="button" onclick="bozpS28AcceptAll()">✓ Prijať všetky návrhy</button></div><div class="s28-risk-tags"><b>Zistené riziká:</b>${riskTags||'<span>Bez označených rizík</span>'}</div><div class="s28-suggestions">${suggestionCards()}</div></div>`;
}
window.bozpS28AcceptAll=function(){
 const missing=groups().filter(id=>!selected(id));
 if(!missing.length)return;
 missing.forEach(id=>premiumAddPPE(id));
};
const beforeSplit=v182SplitPages;
v182SplitPages=function(root){
 beforeSplit(root);if(premiumStep!==2)return;
 const body=root.querySelector('.v182-stage-2');if(!body)return;
 const worker=body.children[0],selectedCard=body.children[1],recommend=body.children[2];
 worker?.querySelector('.v17x-head h2')?.replaceChildren(document.createTextNode('Katalóg ochranných prostriedkov'));
 const workerSub=worker?.querySelector('.v17x-head .sub');if(workerSub)workerSub.textContent='Vyber kategóriu a konkrétny variant. Odporúčané kategórie sú označené podľa rizík.';
 selectedCard?.querySelector('.v17x-head h2')?.replaceChildren(document.createTextNode('Aktuálny výber'));
 const selectedSub=selectedCard?.querySelector('.v17x-head .sub');if(selectedSub)selectedSub.textContent='Vybrané OOPP, stav odborného overenia a možnosť zmeny variantu.';
 selectedCard?.querySelector('#bc-dynamic-detail')?.remove();
 if(recommend){recommend.classList.add('s28-risk-card');recommend.innerHTML=riskBanner()}
};
premiumDraw();
})();
