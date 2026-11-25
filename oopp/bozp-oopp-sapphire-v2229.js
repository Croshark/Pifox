/* V22.29 – kompaktne karty aktualneho vyberu bez straty odbornych poli. */
(function(){'use strict';
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
window.bozpS29Toggle=function(button){const card=button.closest('.s29-compact-item');if(card)card.classList.toggle('open')};
function compact(card){
 if(!card||card.classList.contains('s29-compact-item'))return;
 const img=card.querySelector(':scope > img');
 const info=card.querySelector(':scope > div');
 const name=info?.querySelector('strong')?.textContent||'Ochranný prostriedok';
 const type=info?.querySelector(':scope > small')?.textContent||'';
 const state=info?.querySelector('.v183-approval-label select')?.value||'Na overenie';
 const body=document.createElement('div');body.className='s29-item-body';
 while(card.firstChild)body.appendChild(card.firstChild);
 const head=document.createElement('button');head.type='button';head.className='s29-item-head';head.setAttribute('aria-label','Zobraziť detail: '+name);head.setAttribute('onclick','bozpS29Toggle(this)');
 head.innerHTML=`<img src="${h(img?.src||'')}" alt=""><span><b>${h(name)}</b><small>${h(type)}</small></span><em class="${state==='Schválené'?'approved':''}">${h(state)}</em><i>⌄</i>`;
 card.classList.add('s29-compact-item');card.append(head,body);
}
const prior=v182SplitPages;
v182SplitPages=function(root){
 prior(root);if(premiumStep!==2)return;
 root.querySelectorAll('#v17-selected .v17x-selected-grid>.v17x-ppe').forEach(compact);
 const worker=root.querySelector('.v182-stage-2>.v17x-card:first-child');
 const selected=root.querySelector('#v17-selected');
 if(worker)worker.classList.add('s29-catalog-card');
 if(selected)selected.classList.add('s29-selection-card');
};
premiumDraw();
})();
