/* VŠETKOVEDKO 22.4 – úzko vymedzené orientačné zatriedenie podľa prílohy 1 vyhl. 508/2009. */
(function(root){
'use strict';
const valid=x=>Number.isFinite(x)&&x>0;
function classify(type,d){
 const out=(group,clause,reason)=>({group,clause,reason});
 const unknown=reason=>out('?', 'Príloha č. 1',reason);
 if(!d.scope)return unknown('Najprv potvrď rozsah použitia.');
 if(type==='pressure'){
  const p=d.p,v=d.v;if(!valid(p)||!valid(v))return unknown('Zadaj kladný tlak a objem z dokumentácie.');
  if(p>.2&&v>10&&p*v>20)return out('A','I. časť, A/b/1','Súčasne p > 0,2 MPa, V > 10 l a p × V > 20 MPa·l.');
  if(p>.05&&v>1&&p*v>5)return out('B','I. časť, B/b/1','Nie A; súčasne p > 0,05 MPa, V > 1 l a p × V > 5 MPa·l.');
  return out('C','I. časť, C','Vybraná stabilná vzduchová nádoba nespĺňa hranice A ani B. Over, že nejde o iný druh zariadenia.');
 }
 if(type==='lifting'){
  if(d.kind==='motor'||d.kind==='manual'){
   if(!valid(d.n))return unknown('Zadaj kladnú nosnosť v kg.');
   if(d.n>(d.kind==='motor'?1000:5000))return out('A','II. časť, A/a','Nosnosť presahuje hranicu pre zvolený pohon.');
   if(d.kind==='motor'||d.n>=1000)return out('B','II. časť, B/a/1','Nosnosť je v rozsahu skupiny B pre zvolený pohon.');
   return unknown('Ručný žeriav/zdvíhadlo pod 1 000 kg: neurčuj automaticky C. Over pôsobnosť a presný druh s revíznym technikom.');
  }
  const map={platform:['A','II. časť, A/b','Motorová pohyblivá pracovná plošina so zdvihom NAD 1,5 m.'],lift:['A','II. časť, A/c','Výťah / plošina trvalo zabudovaná v budove v rozsahu A/c.'],service:['B','II. časť, B/d/3','Servisné motorové zdvíhacie zariadenie určené len na zdvíhanie vozidla.'],sling:['C','II. časť, C/a','Samostatný viazací popruh, lano či reťaz nie je VTZ; kontrola a bezpečné používanie zostávajú potrebné.']};
  return map[d.kind]?out(...map[d.kind]):unknown('Vyber podporovaný druh. Iné zariadenia porovnaj s úplnou prílohou.');
 }
 if(type==='gas'){
  if(!valid(d.n))return unknown('Zadaj kladnú hodnotu.');
  if(d.kind==='burn'){
   if(d.n>500)return out('A','IV. časť, A/h','Výkon zariadenia alebo funkčného celku je nad 500 kW.');
   if(d.n>=5||d.flue)return out('B','IV. časť, B/h','Výkon 5 až 500 kW vrátane; B zahŕňa aj spotrebič s požadovaným odťahom spalín.');
   return out('C','IV. časť, C/a','Pod 5 kW, bez požadovaného odťahu spalín; iba bežný spaľovací spotrebič v potvrdenom rozsahu.');
  }
  if(d.kind==='cool')return d.n>25?out('A','IV. časť, A/i','Nebezpečného chladiva je viac ako 25 kg.'):d.n>=3?out('B','IV. časť, B/i','Nebezpečného chladiva je 3 až 25 kg vrátane.'):out('C','IV. časť, C/a','Menej ako 3 kg nebezpečného chladiva; posudzuje sa plynová časť, nie tlaková nádoba.');
  return unknown('Vyber podporovaný druh.');
 }
 if(type==='electric'){
  if(d.criterion&&d.criterion!=='none')return out('A','III. časť, A/'+d.criterion,'Potvrdené kritérium skupiny A. Over protokol vonkajších vplyvov a technickú dokumentáciu.');
  if(d.criterion==='none'&&d.unsafe==='yes')return out('B','III. časť, B','Nie je A; prúd alebo napätie nie sú bezpečné.');
  if(d.criterion==='none'&&d.unsafe==='no')return out('C','III. časť, C','Žiadne kritérium A ani B. Bezpečnosť prúdu aj napätia musí vyplývať z odborného posúdenia.');
  return unknown('Bez posúdenia prostredia, napätia a prúdu nie je možné určiť skupinu.');
 }
 return unknown('Nepodporovaný druh zariadenia.');
}
root.VseVTZ={classify};if(typeof module!=='undefined')module.exports={classify};
})(typeof window!=='undefined'?window:globalThis);
