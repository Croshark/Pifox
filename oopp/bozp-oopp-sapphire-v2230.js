/* V22.30 – pevny velky katalog, krajne menu a plna sekcia doplnkovych OOPP. */
(function(){'use strict';
const CATS=[
 {id:'helmet',label:'Hlava',title:'Ochrana hlavy',image:'assets/ppe-v213/helmet.webp'},
 {id:'eyes',label:'Oči',title:'Ochrana očí',image:'assets/ppe-v213/eyes.webp'},
 {id:'ears',label:'Sluch',title:'Ochrana sluchu',image:'assets/ppe-v213/ears.webp'},
 {id:'gloves',label:'Ruky',title:'Ochrana rúk',image:'assets/ppe-v213/gloves.webp'},
 {id:'shoes',label:'Obuv',title:'Bezpečnostná obuv',image:'assets/ppe-v213/shoes.webp'},
 {id:'vest',label:'Viditeľnosť',title:'Výstražný odev',image:'assets/ppe-v213/vest.webp'},
 {id:'resp',label:'Dýchanie',title:'Ochrana dýchania',image:'assets/ppe-v213/resp.webp'},
 {id:'clothes',label:'Odev',title:'Ochranný pracovný odev',image:'assets/clean/a09.webp?v=16.6'},
 {id:'fall',label:'Proti pádu',title:'Ochrana proti pádu',image:'assets/clean/a13.webp?v=16.6'},
 {id:'other',label:'Doplnkové',title:'Ďalšie a doplnkové OOPP',image:'assets/clean/a15.webp?v=16.6'}
];
let focus30='helmet';
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const category=id=>CATS.find(x=>x.id===id)||CATS[0];
const activeItems=()=>s.items.filter(x=>activeGear(x.id));
function products(id){
 if(id==='vest')return imageProducts.filter(x=>x.id==='other-07'||x.group==='vest'||(x.group==='other'&&/vest|viditeľ|reflex/i.test(x.label)));
 return imageProducts.filter(x=>x.group===id);
}
function isChosen(p){return activeItems().some(x=>x.productId===p.id)}
function itemFor(id){return activeItems().find(x=>x.id===id||(id==='vest'&&x.id==='other-07'))}
function groupSuggested(id){const g=typeof v17SuggestionGroups==='function'?v17SuggestionGroups():[];return g.includes(id)||(id==='vest'&&g.includes('other-07'))}
function reasons(id){const base=catalog.find(x=>x.id===id);return base?(s.risks||[]).filter(r=>(base.risk||[]).includes(r)):[]}
function productNorm(p,id){return window.bozpExpertNormInfo?.[p.id]?.[0]||catalog.find(x=>x.id===(p.group==='other'?p.id:id))?.norm||'Overiť označenie výrobku'}
function grid(id){
 const list=products(id);
 if(!list.length)return '<p class="s28-empty">Pre túto kategóriu zatiaľ nie sú pripravené varianty.</p>';
 return list.map((p,index)=>`<button type="button" class="s28-product s30-product ${isChosen(p)?'chosen':''}" onclick="bozpS30Choose('${p.id}','${id}')" aria-pressed="${isChosen(p)}">${groupSuggested(id)&&index===0?'<span class="s28-rec-label">Odporúčané</span>':''}<img src="${h(p.image)}" loading="lazy" alt="${h(p.label)}"><b>${h(p.label)}</b><small>${h(productNorm(p,id))}</small><em>${isChosen(p)?'✓ Vybrané':'Vybrať variant'}</em></button>`).join('');
}
function selectedCount(id){return id==='other'?products(id).filter(isChosen).length:(itemFor(id)?1:0)}
function catalog30(){
 const c=category(focus30),why=reasons(c.id),count=selectedCount(c.id),list=products(c.id);
 const rail=CATS.map(x=>`<button type="button" class="s28-cat s30-cat ${focus30===x.id?'active':''}" onclick="bozpS30Category('${x.id}')"><img src="${h(x.image)}" alt=""><span>${h(x.label)}</span>${groupSuggested(x.id)?'<em>1</em>':''}</button>`).join('');
 const state=count?`${count>1?count+' položky sú vybrané':'✓ Kategória je priradená'}`:groupSuggested(c.id)?'Odporúčané podľa rizík – vyber konkrétny variant':'Kategória zatiaľ nie je vybraná';
 return `<div class="s28-shell s30-shell"><nav class="s28-rail s30-rail" aria-label="Kategórie OOPP">${rail}</nav><section class="s28-catalog s30-catalog"><div class="s28-catalog-head s30-catalog-head"><div><b>${h(c.title)}</b><small>${why.length?'Odporúčané pre: '+h(why.join(', ')):'Dobrovoľná alebo doplnková ochrana podľa posúdenia'}</small></div><span>${list.length} variantov</span></div><div class="s28-category-state ${count?'is-selected':groupSuggested(c.id)?'is-recommended':''}">${state}</div><div class="s28-products s30-products">${grid(c.id)}</div><div class="s28-catalog-foot s30-catalog-foot"><span>Obrázky sú ilustračné. Rozhoduje označenie a dokumentácia konkrétneho výrobku.</span><button type="button" onclick="bozpWheelAll('${c.id}')">Rozšírený katalóg ↗</button></div></section></div>`;
}
window.bozpWheelHTML=catalog30;
window.bozpS30Category=function(id){focus30=category(id).id;premiumCategory=focus30==='vest'?'other':focus30;premiumDraw()};
window.bozpS30Choose=function(productId,id){focus30=id;premiumSelectItem(productId)};
const oldCategory=window.bozpS28Category;
window.bozpS28Category=function(id){focus30=id;oldCategory?.(id)};
premiumDraw();
})();
