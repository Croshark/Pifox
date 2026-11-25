/* BOZP Audit V21.3 – Midnight Premium – real SVG segments (no overlays). */
(function(){'use strict';
const CATS=[
{id:'helmet',name:'Ochranná prilba',short:'Prilba',norm:'STN EN 397',risk:['Padajúce predmety','Elektrické riziko','Pád z výšky']},
{id:'eyes',name:'Ochrana očí',short:'Oči',norm:'STN EN ISO 16321-1',risk:['Odletujúce častice','Chemický kontakt','UV / IR žiarenie']},
{id:'ears',name:'Ochrana sluchu',short:'Sluch',norm:'STN EN 352 (podľa typu)',risk:['Hluk']},
{id:'vest',name:'Reflexná vesta',short:'Vesta',norm:'STN EN ISO 20471',risk:['Nízka viditeľnosť']},
{id:'resp',name:'Ochrana dýchania',short:'Dýchanie',norm:'STN EN 149 / EN 140',risk:['Prach a aerosóly','Biologické činitele','Chemický kontakt']},
{id:'shoes',name:'Bezpečnostná obuv',short:'Obuv',norm:'STN EN ISO 20345',risk:['Šmyk a prepichnutie','Padajúce predmety']},
{id:'gloves',name:'Ochranné rukavice',short:'Rukavice',norm:'STN EN ISO 21420 + príslušná norma',risk:['Mechanické poranenie rúk','Chemický kontakt','Tepelné riziko']}];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const has=id=>Array.isArray(s.items)&&s.items.some(x=>(x.id===id||(id==='vest'&&x.id==='other-07'))&&activeGear(x.id));
const recommended=id=>CATS.find(c=>c.id===id)?.risk.some(r=>s.risks.includes(r))||false;
const state=id=>has(id)?'selected':recommended(id)?'recommended':'idle';
const RAD=Math.PI/180,cx=500,cy=500;
const pt=(r,a)=>[cx+r*Math.cos(a*RAD),cy+r*Math.sin(a*RAD)];
const coord=(r,a)=>pt(r,a).map(x=>x.toFixed(2)).join(' ');
function shape(a,b){return `M ${coord(183,a)} L ${coord(427,a)} A 427 427 0 0 1 ${coord(427,b)} L ${coord(183,b)} A 183 183 0 0 0 ${coord(183,a)} Z`}
function focused(){try{return window.bozpWheelCDebug?.().focused||'helmet'}catch(e){return 'helmet'}}
function selectedTotal(){return CATS.filter(c=>has(c.id)).length}
function svgWheel(){
 const spans=CATS.map((c,i)=>{
 const a=-151.7+i*360/7,b=a+360/7-1.4;
 const [px,py]=pt(314,(a+b)/2);
 const st=state(c.id),f=focused()===c.id?'current':'';
 const im=`assets/ppe-v213/${c.id}.webp?v=21.3`;
 const sizing=c.id==='vest'?176:c.id==='shoes'?181:c.id==='gloves'?182:185;
 return `<g class="v213-segment ${st} ${f}" data-ppe="${c.id}" role="button" tabindex="0" aria-label="${esc(c.name)}: ${st==='selected'?'vybrané':'otvoriť varianty'}" aria-pressed="${st==='selected'}" onclick="bozpRiskWheelTap('${c.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();bozpRiskWheelTap('${c.id}')}"><title>${esc(c.name)}</title><path class="v213-seg-shape" d="${shape(a,b)}"/><image href="${im}" x="${(px-sizing/2).toFixed(1)}" y="${(py-sizing/2).toFixed(1)}" width="${sizing}" height="${sizing}" preserveAspectRatio="xMidYMid meet" class="v213-product"/></g>`;
 }).join('');
 return `<svg class="v213-wheel-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="group" aria-label="Interaktívny výber siedmich kategórií OOPP"><defs>
 <radialGradient id="v213idle"><stop offset="0" stop-color="#113659"/><stop offset="1" stop-color="#061b32"/></radialGradient>
 <linearGradient id="v213active" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#08789a"/><stop offset=".5" stop-color="#09506d"/><stop offset="1" stop-color="#071f39"/></linearGradient>
 <linearGradient id="v213recommend" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#775014"/><stop offset=".45" stop-color="#3b311e"/><stop offset="1" stop-color="#09223a"/></linearGradient>
 <radialGradient id="v213center"><stop offset="0" stop-color="#0d3965"/><stop offset="1" stop-color="#03152b"/></radialGradient>
 <filter id="v213cyanGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="v213goldGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
 <circle cx="500" cy="500" r="442" fill="none" stroke="#1c81b2" stroke-opacity=".36" stroke-width="3"/>
 ${spans}
 <circle class="v213-center-light" cx="500" cy="500" r="184" fill="url(#v213center)" stroke="#69d6ff" stroke-width="6" filter="url(#v213cyanGlow)"/>
 <path class="v213-shield-outline" d="M500 366 L579 396 L574 491 Q570 547 500 585 Q430 547 426 491 L421 396 Z" fill="none" stroke="#dcfaff" stroke-width="12" stroke-linejoin="round"/>
 <path d="M457 480 L492 517 L548 455" fill="none" stroke="#10e2c9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
 <text class="v213-center-text" x="500" y="658" fill="#fff" text-anchor="middle" font-size="66" font-weight="900" font-family="Inter,Arial,sans-serif">OOPP</text>
 </svg>`;
}
window.bozpWheelHTML=function(){
 const risks=Array.isArray(s.risks)?s.risks:[];
 const badges=CATS.map(c=>`<button class="v213-small-choice ${state(c.id)} ${focused()===c.id?'current':''}" type="button" onclick="bozpRiskWheelTap('${c.id}')" aria-pressed="${has(c.id)}"><img src="assets/ppe-v213/${c.id}.webp?v=21.3" alt=""/><span>${esc(c.short)}</span></button>`).join('');
 const riskHtml=risks.length?risks.slice(0,5).map(r=>`<span class="v213-risk-tag">${esc(r)}</span>`).join(''):'<span class="v213-risk-tag">Riziká nastavíš v kroku 2</span>';
 return `<div class="v213-wheel-panel"><div class="v213-wheel-head"><div><div class="v213-kicker">PREMIUM SAFETY · OOPP</div><h3>Interaktívny výber ochrany</h3><p>Klikni na výseč alebo na kategóriu pod kruhom.</p></div><span class="v213-count">${selectedTotal()} / 7 vybraných</span></div><div class="v213-wheel-frame">${svgWheel()}</div><div class="v213-choice-row">${badges}</div><div class="v213-risks"><span class="v213-risk-heading">Identifikované riziká</span><div class="v213-risk-tags">${riskHtml}</div></div><p class="v213-disclaimer">Grafika je navigácia. Výber konkrétnych OOPP a ich vhodnosť určuje posúdenie rizík, označenie výrobcu a kompatibilita.</p></div>`;
};
const oldSplit=v182SplitPages;
v182SplitPages=function(root){
 oldSplit(root);
 document.body.classList.toggle('bozp-midnight-v213',premiumStep===2&&document.documentElement.getAttribute('data-bozp-oopp-theme')==='dark');
 if(premiumStep!==2)return;
 const worker=root.querySelector('.v182-stage-2>.v17x-card:first-child');
 const selected=root.querySelector('#v17-selected');
 if(worker){worker.querySelector('.v17x-head')?.remove();worker.querySelector('.v17x-visual-meta')?.remove();worker.querySelector('.v17x-note')?.remove();}
 if(!selected)return;
 selected.querySelector('.v17x-head h2')?.replaceChildren(document.createTextNode('Vybrané ochranné prostriedky'));
 const detail=selected.querySelector('#bc-dynamic-detail');
 if(detail){detail.querySelector('.bc-panel-note')?.remove()}
 const status=selected.querySelector('.v17x-selected-grid');
 // Current selection stays in original editable cards, including approval controls.
 const title=document.createElement('div');title.className='v213-inspector-bar';title.innerHTML=`<span>AKTUÁLNY VÝBER OOPP</span><strong>${selectedTotal()} položiek</strong>`;
 status?.before(title);
 const app=root.querySelector('.v182-stage-2');
 if(app)app.setAttribute('data-version','V21.3');
};
const oldTap=window.bozpRiskWheelTap;
window.bozpRiskWheelTap=function(id){oldTap(id);};
const oldAll=window.bozpWheelAll;
window.bozpWheelAll=function(id){oldAll(id);};
if(typeof premiumDraw==='function')premiumDraw();
})();
/* Sync the embedded OOPP palette with the main application's existing toggle. */
(function(){
 let lastTheme='';
 function sync(){
  let theme='light';
  try{
   const parentTheme=window.parent!==window?window.parent.document.documentElement.getAttribute('data-bozp-theme'):'';
   const ownTheme=document.documentElement.getAttribute('data-bozp-oopp-theme');
   const stored=localStorage.getItem('bozp-audit-visual-theme-v1');
   theme=(parentTheme==='dark'||parentTheme==='light')?parentTheme:(ownTheme==='dark'||ownTheme==='light')?ownTheme:(stored==='dark'||stored==='light')?stored:(window.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light');
  }catch(e){try{const stored=localStorage.getItem('bozp-audit-visual-theme-v1');theme=stored==='dark'?'dark':'light';}catch(_){} }
  const correct=document.body.classList.contains(theme==='light'?'bozp-light-v217':'bozp-midnight-v213');
  const wrong=document.body.classList.contains(theme==='light'?'bozp-midnight-v213':'bozp-light-v217');
  if(theme===lastTheme&&correct&&!wrong)return;
  lastTheme=theme;
  document.body.classList.toggle('bozp-light-v217',theme==='light');
  document.body.classList.toggle('bozp-midnight-v213',theme==='dark' && (typeof premiumStep==='undefined'||premiumStep===2));
  document.documentElement.setAttribute('data-bozp-oopp-theme',theme);
 }
 window.bozpOoppSyncTheme=sync;
 sync();
 try{const parentRoot=window.parent.document.documentElement;new MutationObserver(sync).observe(parentRoot,{attributes:true,attributeFilter:['data-bozp-theme']});}catch(e){}
 setInterval(sync,800);
})();
