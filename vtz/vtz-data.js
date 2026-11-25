/* BOZP Audit V22.40 – compact legal library for VTZ/TZ.
   The classification catalogue is loaded from VŠETKOVEDKO. Intervals are aids;
   the actual date must follow the current regulation, operating conditions and documentation. */
window.VTZ_DATA={
  version:'22.40',
  types:[
    {id:'electric',label:'Elektrické',short:'Elektrické zariadenie',color:'#4e8cff'},
    {id:'pressure',label:'Tlakové',short:'Tlakové zariadenie',color:'#ee9a32'},
    {id:'gas',label:'Plynové',short:'Plynové zariadenie',color:'#75c900'},
    {id:'lifting',label:'Zdvíhacie',short:'Zdvíhacie zariadenie',color:'#28c0e8'},
    {id:'other',label:'Ostatné TZ',short:'Ostatné technické zariadenie',color:'#9a7cff'},
    {id:'fire',label:'Požiarne',short:'Požiarne zariadenie',color:'#ef4e55'}
  ],
  library:[
    {domain:'vtz',kind:'pressure',group:'Tlakové zariadenia',source:'Vyhláška č. 508/2009 Z. z., príloha č. 5',rows:[
      {code:'A/a',title:'Kotly I. až IV. triedy',tasks:[['Vonkajšia prehliadka','3 mesiace','3m'],['Vnútorná prehliadka','1 rok','12m'],['Tlaková skúška','6 rokov','72m'],['OÚS','6 rokov','72m']],note:'Pri nepretržitej prevádzke platia osobitné podmienky uvedené v prílohe a poznámkach pod tabuľkou.'},
      {code:'A/b',title:'Tlakové nádoby stabilné – vyššia kategória',tasks:[['Vonkajšia prehliadka','1 rok','12m'],['Vnútorná prehliadka','5 rokov','60m'],['Tlaková skúška','10 rokov','120m'],['OÚS','10 rokov','120m']],note:'Konkrétne zatriedenie A/b/1 alebo A/b/2 sa určí podľa média, tlaku, objemu a bezpečnostného súčinu.'},
      {code:'A/c',title:'Nádoby na dopravu plynov',tasks:[['Prehliadka a skúška','Pred každým plnením',''],['OÚS','Podľa osobitného predpisu / dokumentácie','']],note:'Lehota sa nepočíta iba z názvu nádoby. Overte režim prepravovateľného tlakového zariadenia.'},
      {code:'A/d',title:'Pojazdné hasiace prístroje – vybrané náplne',tasks:[['Vonkajšia prehliadka','Pred každým plnením',''],['Vnútorná prehliadka','Podľa náplne',''],['OÚS','Podľa náplne','']],note:'Súbežne sa uplatňuje osobitná úprava hasiacich prístrojov.'},
      {code:'A/e',title:'Potrubné vedenia na nebezpečné kvapaliny',tasks:[['Vonkajšia prehliadka','1 rok','12m'],['Vnútorná prehliadka','Nevyžaduje sa',''],['Tlaková skúška','Nevyžaduje sa',''],['OÚS','Nevyžaduje sa','']],note:'Rozsah kontroly upravujú aj prevádzkové podmienky a dokumentácia.'},
      {code:'B/a',title:'Kotly V. triedy',tasks:[['Vonkajšia prehliadka','1 rok','12m'],['Vnútorná prehliadka','1 rok','12m'],['Tlaková skúška','10 rokov','120m'],['OÚS','Nevyžaduje sa','']]},
      {code:'B/b',title:'Tlakové nádoby stabilné – nižšia kategória',tasks:[['Vonkajšia prehliadka','1 rok','12m'],['Vnútorná prehliadka','5 rokov','60m'],['Tlaková skúška','10 rokov','120m'],['OÚS','Nevyžaduje sa','']]},
      {code:'B/c',title:'Nádoby na dopravu plynov',tasks:[['Prehliadka a skúška','Pred každým plnením',''],['OÚS','Podľa osobitného predpisu / dokumentácie','']]},
      {code:'B/d',title:'Prenosné HP a pojazdné CO₂ HP',tasks:[['Vonkajšia prehliadka','Pred každým plnením',''],['Vnútorná prehliadka','Podľa náplne',''],['Tlaková skúška','Podľa náplne','']],note:'Kontrolu hasiaceho prístroja odlišujte od tlakovej skúšky jeho nádoby.'},
      {code:'B/e',title:'Potrubia – nižšie parametre',tasks:[['Vonkajšia prehliadka','1 rok (RT)','12m'],['Ďalšie úkony','Podľa prílohy a dokumentácie','']]},
      {code:'C',title:'Ostatné tlakové zariadenia',tasks:[['Kontrola','Podľa výrobcu / TPV','']],note:'Nie sú VTZ skupiny A alebo B, no prevádzkovateľ musí zabezpečiť ich bezpečný stav.'}
    ]},
    {domain:'vtz',kind:'lifting',group:'Zdvíhacie zariadenia',source:'Vyhláška č. 508/2009 Z. z., príloha č. 7',rows:[
      {code:'A/a',title:'Žeriavy a zdvíhadlá – vyššia nosnosť',tasks:[['Odborná prehliadka','2 roky*','24m'],['Odborná skúška','4 roky*','48m'],['OÚS','10 rokov*','120m']],note:'Hviezdička: skontrolujte osobitné poznámky prílohy č. 7 a prevádzkové podmienky.'},
      {code:'A/b',title:'Pohyblivé pracovné plošiny',tasks:[['Odborná prehliadka','1 rok','12m'],['Odborná skúška','2 roky','24m'],['OÚS','10 rokov','120m']]},
      {code:'A/c/1',title:'Osobné a nákladné výťahy s dopravou osôb',tasks:[['Odborná prehliadka','3 mesiace','3m'],['Odborná skúška','3 roky','36m'],['OÚS','6 rokov','72m']]},
      {code:'A/c/2–3',title:'Vybrané nákladné výťahy',tasks:[['Odborná prehliadka','6 mesiacov','6m'],['Odborná skúška','6 rokov','72m'],['OÚS','10 rokov','120m']]},
      {code:'A/d/1',title:'Stavebný výťah na prepravu osôb a nákladu',tasks:[['Odborná prehliadka','3 mesiace','3m'],['Odborná skúška','3 roky','36m'],['OÚS','10 rokov','120m']]},
      {code:'A/d/2',title:'Nákladný stavebný výťah s prístupom',tasks:[['Odborná prehliadka','Podľa TPV',''],['Odborná skúška','Podľa TPV',''],['OÚS','10 rokov','120m']]},
      {code:'A/e',title:'Regálový zakladač s obsluhou na stroji',tasks:[['Odborná prehliadka','1 rok','12m'],['Odborná skúška','2 roky','24m'],['OÚS','10 rokov','120m']]},
      {code:'A/f',title:'Pohyblivé schody a chodníky',tasks:[['Odborná prehliadka','3 mesiace','3m'],['Odborná skúška','3 roky','36m'],['OÚS','10 rokov','120m']]},
      {code:'A/g',title:'Lyžiarske a vodnolyžiarske vleky',tasks:[['Odborná prehliadka','Podľa TPV',''],['Odborná skúška','1 rok','12m'],['OÚS','10 rokov','120m']]},
      {code:'B',title:'Zdvíhacie zariadenia skupiny B',tasks:[['Odborná prehliadka','Podľa druhu a prílohy č. 7',''],['Odborná skúška','Podľa druhu a prílohy č. 7','']],note:'Skupina B obsahuje rozdielne zariadenia. Kód musí byť vybraný z katalógu; univerzálnu lehotu nemožno bezpečne použiť.'},
      {code:'C',title:'Ostatné zdvíhacie zariadenia',tasks:[['Kontrola','Podľa výrobcu / TPV','']]}
    ]},
    {domain:'vtz',kind:'electric',group:'Elektrické zariadenia',source:'Vyhláška č. 508/2009 Z. z., príloha č. 8; STN 33 1500 a súvisiace normy',rows:[
      {code:'bežné',title:'Murovaná obytná a administratívna budova',tasks:[['Odborná prehliadka a odborná skúška','5 rokov','60m']],note:'Ak tabuľka vonkajších vplyvov určuje kratšiu lehotu, použije sa kratšia.'},
      {code:'školy/hotely',title:'Škola, hotel a obdobný objekt',tasks:[['Odborná prehliadka a odborná skúška','3 roky','36m']]},
      {code:'zhromaždenie',title:'Objekt určený na zhromažďovanie viac ako 250 osôb',tasks:[['Odborná prehliadka a odborná skúška','2 roky','24m']]},
      {code:'výškový',title:'Výšková budova',tasks:[['Odborná prehliadka a odborná skúška','2 roky','24m']]},
      {code:'stavenisko',title:'Dočasná elektrická inštalácia na stavenisku',tasks:[['Odborná prehliadka a odborná skúška','6 mesiacov','6m']]},
      {code:'vplyvy',title:'Priestor s osobitnými vonkajšími vplyvmi',tasks:[['Odborná prehliadka a odborná skúška','Podľa najkratšej lehoty v prílohe č. 8','']],note:'Voda, prach, korózia, vibrácie, požiar a výbuch môžu lehotu významne skrátiť. Zaznamenajte protokol o určení vonkajších vplyvov.'},
      {code:'náradie',title:'Ručné elektrické náradie a spotrebiče počas používania',tasks:[['Kontrola / revízia','Podľa triedy, spôsobu používania a príslušnej normy','']],note:'Vyhláška určuje oprávnené osoby; konkrétny interval vyplýva z bezpečnostnotechnických požiadaviek a noriem.'}
    ]},
    {domain:'vtz',kind:'gas',group:'Plynové zariadenia',source:'Vyhláška č. 508/2009 Z. z., príloha č. 10',rows:[
      {code:'A/a',title:'Výroba plynu',tasks:[['OP','6 mesiacov','6m'],['OS','3 roky','36m'],['OÚS','10 rokov','120m']]},
      {code:'A/b',title:'Skladovanie plynu',tasks:[['OP','1 rok','12m'],['OS','5 rokov','60m'],['OÚS','10 rokov','120m']]},
      {code:'A/c',title:'Plnenie tlakových nádob',tasks:[['OP','3 mesiace','3m'],['OS','1 rok','12m'],['OÚS','10 rokov','120m']]},
      {code:'A/d',title:'Zásobovanie plynom z tlakových nádob',tasks:[['OP','1 rok','12m'],['OS','5 rokov','60m'],['OÚS','10 rokov','120m']]},
      {code:'A/e',title:'Zvyšovanie tlaku plynu',tasks:[['OP','1 rok','12m'],['OS','3 roky','36m'],['OÚS','10 rokov','120m']]},
      {code:'A/f',title:'Znižovanie tlaku plynu',tasks:[['OP','1 rok','12m'],['OS','2 roky','24m'],['OÚS','10 rokov','120m']]},
      {code:'A/g',title:'Rozvod plynu',tasks:[['OP','1 rok','12m'],['OS','5 rokov','60m'],['OÚS','10 rokov','120m']]},
      {code:'A/h',title:'Spotreba plynu spaľovaním',tasks:[['OP','6 mesiacov','6m'],['OS','3 roky','36m'],['OÚS','6 rokov','72m']]},
      {code:'A/i',title:'Chladenie a mrazenie',tasks:[['OP','1 rok','12m'],['OS','5 rokov','60m'],['OÚS','10 rokov','120m']]},
      {code:'B/a',title:'Výroba plynu – skupina B',tasks:[['OP','6 mesiacov','6m'],['OS','3 roky','36m'],['OÚS','10 rokov*','120m']]},
      {code:'B/b',title:'Skladovanie plynu – skupina B',tasks:[['OP','1 rok','12m'],['OS','5 rokov','60m'],['OÚS','Nevyžaduje sa','']]},
      {code:'B/c',title:'Plnenie tlakových nádob – skupina B',tasks:[['OP','3 mesiace','3m'],['OS','1 rok','12m'],['OÚS','Nevyžaduje sa','']]},
      {code:'B/d',title:'Zásobovanie plynom z tlakových nádob – skupina B',tasks:[['OP','1 rok','12m'],['OS','5 rokov','60m'],['OÚS','Nevyžaduje sa','']]},
      {code:'B/e',title:'Zvyšovanie tlaku plynu – skupina B',tasks:[['OP','1 rok','12m'],['OS','3 roky','36m'],['OÚS','Nevyžaduje sa','']]},
      {code:'B/f',title:'Znižovanie tlaku plynu – skupina B',tasks:[['OP','1 rok','12m'],['OS','3 roky','36m'],['OÚS','Nevyžaduje sa','']]},
      {code:'B/g',title:'Rozvod plynu – skupina B',tasks:[['OP','3 roky','36m'],['OS','6 rokov','72m'],['OÚS','Nevyžaduje sa','']]},
      {code:'B/h',title:'Spotreba plynu spaľovaním – skupina B',tasks:[['OP','1 rok','12m'],['OS','3 roky','36m'],['OÚS','Nevyžaduje sa','']]},
      {code:'B/i',title:'Chladenie a mrazenie – skupina B',tasks:[['OP','Podľa výrobcu (TPV)',''],['OS','Podľa výrobcu (TPV)',''],['OÚS','Nevyžaduje sa','']]},
      {code:'C',title:'Ostatné plynové zariadenia',tasks:[['Kontrola','Podľa výrobcu / prevádzkového predpisu','']]}
    ]},
    {domain:'fire',kind:'extinguisher',group:'Hasiace prístroje',source:'Vyhláška č. 347/2022 Z. z.',rows:[
      {code:'HP',title:'Prenosný hasiaci prístroj',tasks:[['Periodická kontrola','Najmenej raz za 24 mesiacov*','24m']],note:'Výrobca, prostredie alebo osobitné podmienky môžu určiť kratšiu lehotu.'},
      {code:'CO₂',title:'Pojazdný hasiaci prístroj CO₂',tasks:[['Periodická kontrola','Najmenej raz za 12 mesiacov*','12m']],note:'Tlakovú skúšku nádoby evidujte ako samostatný úkon podľa príslušného režimu.'},
      {code:'nádoba',title:'Tlaková skúška nádoby hasiaceho prístroja',tasks:[['Tlaková skúška','Podľa dokumentácie a osobitných podmienok','']]}
    ]},
    {domain:'fire',kind:'hydrant',group:'Požiarne vodovody a hydranty',source:'Vyhláška č. 699/2004 Z. z.',rows:[
      {code:'§15',title:'Kontrola zariadenia na dodávku vody',tasks:[['Kontrola','Najmenej raz za 12 mesiacov*','12m']],note:'Ak výrobca jednotlivých častí určí kratšiu lehotu, použije sa kratšia.'},
      {code:'hadica',title:'Tlaková skúška požiarnej hadice',tasks:[['Tlaková skúška','Podľa technickej normy a dokumentácie','']]}
    ]},
    {domain:'fire',kind:'closure',group:'Požiarne uzávery a klapky',source:'Vyhláška č. 478/2008 Z. z.; dokumentácia výrobcu',rows:[
      {code:'uzáver',title:'Preventívna údržba požiarneho uzáveru',tasks:[['Údržba','Najmenej raz za 12 mesiacov*','12m']],note:'Platí, ak dokumentácia neurčí kratšiu lehotu.'},
      {code:'uzáver',title:'Prehliadka požiarneho uzáveru',tasks:[['Prehliadka','Najmenej raz za 12 mesiacov*','12m']]},
      {code:'PPP',title:'Kontrola v rámci preventívnej protipožiarnej prehliadky',tasks:[['Kontrola','Podľa režimu preventívnej protipožiarnej prehliadky','']]},
      {code:'klapka',title:'Požiarna klapka',tasks:[['Kontrola a údržba','Podľa výrobcu, projektu a prevádzkového predpisu','']],note:'Bez dokumentácie konkrétneho výrobku nie je bezpečné použiť univerzálnu lehotu.'}
    ]},
    {domain:'fire',kind:'eps',group:'Elektrická požiarna signalizácia (EPS)',source:'Vyhláška č. 726/2002 Z. z.',rows:[
      {code:'EPS',title:'Denná kontrola EPS',tasks:[['Kontrola','1 deň','1d']]},
      {code:'EPS',title:'Mesačná kontrola EPS',tasks:[['Kontrola','1 mesiac','1m']]},
      {code:'EPS',title:'Štvrťročná kontrola EPS',tasks:[['Kontrola','3 mesiace','3m']]},
      {code:'EPS',title:'Ročná kontrola EPS',tasks:[['Kontrola','12 mesiacov','12m']],note:'Ročnú kontrolu vykonáva osoba s požadovanou odbornou spôsobilosťou podľa vyhlášky.'}
    ]},
    {domain:'fire',kind:'shz',group:'Stabilné a polostabilné hasiace zariadenia',source:'Vyhláška č. 169/2006 Z. z.',rows:[
      {code:'SHZ',title:'Denná kontrola SHZ',tasks:[['Kontrola','1 deň','1d']]},
      {code:'SHZ',title:'Týždenná kontrola SHZ',tasks:[['Kontrola','7 dní','7d']]},
      {code:'SHZ',title:'Mesačná kontrola SHZ',tasks:[['Kontrola','1 mesiac','1m']]},
      {code:'SHZ',title:'Štvrťročná kontrola SHZ',tasks:[['Kontrola','3 mesiace','3m']]},
      {code:'SHZ',title:'Polročná kontrola SHZ',tasks:[['Kontrola','6 mesiacov','6m']]},
      {code:'SHZ',title:'Ročná kontrola SHZ',tasks:[['Kontrola','12 mesiacov','12m']],note:'Obsah a osoby vykonávajúce jednotlivé kontroly určuje vyhláška, technická norma a prevádzkový predpis.'}
    ]},
    {domain:'fire',kind:'zotsh',group:'Zariadenie na odvod tepla a splodín horenia (ZOTSH)',source:'Technické podmienky výrobcu, projekt a prevádzkový predpis',rows:[
      {code:'ZOTSH',title:'Kontrola a funkčná skúška ZOTSH',tasks:[['Kontrola / skúška','Podľa dokumentácie a prevádzkového predpisu','']],note:'Všeobecne nemožno priradiť jednu zákonnú lehotu bez poznania konkrétneho systému a jeho dokumentácie.'}
    ]}
  ]
};
