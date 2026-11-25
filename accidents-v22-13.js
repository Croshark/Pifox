/* BOZP Audit v22.13 – Sapphire sprievodca pracovným úrazom.
   Mení iba zadávanie a navigáciu. Existujúce generátory úradných PDF/DOCX
   a ich presné súradnice ostávajú nedotknuté. */
(function(){
  'use strict';

  const A23_VERSION='22.13';
  let previewTimer=0;
  let previewBusy=false;
  let previewPage=1;
  let previewKind='opu';
  const previewCache={opu:null,rpu:null};

  const E=window.esc||function(v){return String(v??'').replace(/[&<>\"']/g,function(ch){return({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[ch]})};
  const A=function(v){return E(v).replace(/`/g,'&#96;')};
  const filled=function(v){return String(v??'').trim()!==''};

  const iconPaths={
    file:'<path d="M6 2.75h7l5 5V21.25H6z"/><path d="M13 2.75v5h5M9 12h6M9 15.5h6M9 19h4"/>',
    person:'<circle cx="12" cy="8" r="3.25"/><path d="M5.75 20.5c.45-4 2.5-6 6.25-6s5.8 2 6.25 6"/>',
    shield:'<path d="M12 2.75 19 5.5v5.9c0 4.45-2.45 7.55-7 9.85-4.55-2.3-7-5.4-7-9.85V5.5z"/><path d="m8.7 12.1 2.15 2.15 4.5-4.65"/>',
    scale:'<path d="M12 3v18M7 5h10M5 5 2.5 10h5zM19 5l-2.5 5h5zM7 21h10"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"/>',
    check:'<path d="m5 12.5 4.2 4.2L19 7"/>',
    arrow:'<path d="M5 12h14M14 7l5 5-5 5"/>',
    back:'<path d="M19 12H5M10 7l-5 5 5 5"/>',
    eye:'<path d="M2.75 12s3.2-6 9.25-6 9.25 6 9.25 6-3.2 6-9.25 6-9.25-6-9.25-6z"/><circle cx="12" cy="12" r="2.75"/>',
    download:'<path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 20h16"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
    refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M18.2 10A7 7 0 0 0 6.3 6.4L4 9M5.8 14A7 7 0 0 0 17.7 17.6L20 15"/>',
    alert:'<path d="M12 3 2.75 20h18.5z"/><path d="M12 9v5M12 17.5v.1"/>',
    briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V4h7v3M3 12h18M10 12v2h4v-2"/>',
    trash:'<path d="M4 7h16M9 3h6l1 4H8zM7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    moon:'<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
    users:'<path d="M16 20v-1.5c0-2.5-1.8-4.5-4-4.5H7c-2.2 0-4 2-4 4.5V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM16 4a3.5 3.5 0 0 1 0 7M18 14c1.8.4 3 2 3 4v2"/>',
    edit:'<path d="m4 20 4.2-1 10.9-10.9a2.2 2.2 0 0 0-3.1-3.1L5.1 15.9zM14.5 6.5l3 3"/>',
    pages:'<path d="M7 4h11v15H7z"/><path d="M7 7H4v14h11v-2"/>',
    building:'<path d="M4 21V5h10v16M14 10h6v11M8 9h2M8 13h2M8 17h2M17 14h1M17 17h1M2 21h20"/>'
  };
  function I(name,cls){return '<svg class="acc23-icon '+(cls||'')+'" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(iconPaths[name]||iconPaths.file)+'</svg>'}

  const labels={
    eventType:'Druh poistnej udalosti',ico:'IČO zamestnávateľa',nace:'SK NACE',salaryLedger:'Kto vedie evidenciu miezd',salaryOffice:'Útvar alebo subjekt evidencie miezd',
    employee:'Meno a priezvisko poškodeného',address:'Adresa bydliska',birth:'Dátum narodenia',social:'Identifikačné číslo sociálneho zabezpečenia',position:'Pracovné zaradenie',
    date:'Dátum úrazu',time:'Čas úrazu',place:'Miesto vzniku',incomeComp:'Náhrada príjmu pri PN',description:'Podrobný opis úrazu',
    intent:'Úmyselné spôsobenie',alcohol:'Alkohol alebo omamné látky',breach:'Porušené predpisy',discipline:'Porušenie pracovných povinností',investigator:'Vyšetrujúci orgán',injury:'Poškodenie zdravia',deathDate:'Dátum úmrtia',responsibility:'Zodpovednosť zamestnávateľa v %',employeeFault:'Spoluzodpovednosť zamestnanca',
    court:'Súdne konanie a stav',courtDecision:'Rozhodnutie súdu',contact:'Vybavuje – kontakt',statutory:'Štatutárny zástupca',signaturePlace:'Miesto podpisu',signatureDate:'Dátum podpisu',
    nationality:'Štátna príslušnosť',children:'Počet nezaopatrených detí',insured:'Nemocenské poistenie',wageBase:'Denný vymeriavací základ',workplace:'Pracovisko',hireDate:'Nástup na funkciu',occupationCode:'Kód povolania SK ISCO-08',training:'Posledné oboznámenie BOZP',knowledgeChecked:'Overenie znalostí',qualification:'Odborná spôsobilosť',health:'Zdravotná spôsobilosť',shiftStart:'Začiatok zmeny',shiftEnd:'Koniec zmeny',worked:'Odpracované hodiny pred úrazom',serious:'Závažnosť úrazu',
    source:'Zdroj úrazu',sourceCode:'Kód zdroja úrazu',cause:'Príčina úrazu',causeCode:'Kód príčiny úrazu',injuryCode:'Kód druhu poranenia',bodyPart:'Poranená časť tela',bodyCode:'Kód poranenej časti tela',workRelation:'Pracovnoprávny vzťah',pnDays:'Počet dní PN',regionCode:'Kraj NUTS 3',organizationSize:'Veľkosť organizácie',citizenshipCode:'Kód štátnej príslušnosti',workplaceSpec:'Špecifikácia pracoviska',workplaceCode:'Kód pracoviska',processCode:'Pracovný proces – ESAW',activityCode:'Špecifická pracovná činnosť – ESAW',deviationCode:'Odchýlka – ESAW',contactCode:'Kontakt – spôsob poranenia',materialActivity:'Materiálový činiteľ činnosti',materialDeviation:'Materiálový činiteľ odchýlky',materialContact:'Materiálový činiteľ kontaktu',
    employeeStatement:'Vyjadrenie zamestnanca',witnesses:'Svedkovia',investigationDate:'Dátum vyšetrenia',recordDate:'Dátum spísania',technical:'Technické opatrenia',technicalDue:'Termín technických opatrení',organizational:'Organizačné opatrenia',organizationalDue:'Termín organizačných opatrení',educational:'Výchovné opatrenia',educationalDue:'Termín výchovných opatrení',representative:'Zástupca zamestnávateľa',employeeRepresentative:'Zástupca zamestnancov pre BOZP',unionStatement:'Vyjadrenie zástupcov zamestnancov',checkMeasures:'Kontrola opatrení',checkDate:'Dátum kontroly',notes:'Poznámky a prílohy',accidentNumber:'Číslo úrazu',legalForm:'Právna forma',rpuOrganizationUnit:'Organizačný útvar'
  };

  const OPU_SECTIONS=[
    {title:'Zamestnávateľ',hint:'Údaje, ktoré sa prenesú do hornej časti OPU.',icon:'building',fields:['eventType','ico','nace','salaryLedger','salaryOffice']},
    {title:'Poškodený a udalosť',hint:'Najprv vyber zamestnanca, potom skontroluj osobné a časové údaje.',icon:'person',employeePicker:true,fields:['employee','address','birth','social','position','date','time','place','incomeComp','description']},
    {title:'Príčiny a zodpovednosť',hint:'Opisuj iba zistené skutočnosti. Nejasnosti nechaj na odborné posúdenie.',icon:'shield',fields:['intent','alcohol','breach','discipline','investigator','injury','deathDate','responsibility','employeeFault']},
    {title:'Súd, kontakt a podpis',hint:'Dokončenie druhej strany OPU a kontaktných údajov.',icon:'file',fields:['court','courtDecision','contact','statutory','signaturePlace','signatureDate']}
  ];
  const RPU_SECTIONS=[
    {title:'Zamestnanec a pracovné údaje',hint:'Doplň údaje potrebné iba vtedy, keď sa RPU vyhotovuje.',icon:'person',employeePicker:true,fields:['employee','birth','address','social','nationality','children','insured','wageBase','position','workplace','hireDate','occupationCode','training','knowledgeChecked','qualification','health','shiftStart','shiftEnd','worked','serious','deathDate']},
    {title:'Klasifikácia a ESAW',hint:'Kódy vyber z číselníkov; názov sa zobrazí priamo pri kóde.',icon:'search',fields:['description','source','sourceCode','cause','causeCode','injury','injuryCode','bodyPart','bodyCode','workRelation','pnDays','regionCode','organizationSize','citizenshipCode','workplaceSpec','workplaceCode','processCode','activityCode','deviationCode','contactCode','materialActivity','materialDeviation','materialContact']},
    {title:'Vyšetrovanie a opatrenia',hint:'Zaznamenaj výsledok vyšetrovania, konkrétne opatrenia a termíny.',icon:'shield',fields:['employeeStatement','witnesses','investigationDate','recordDate','technical','technicalDue','organizational','organizationalDue','educational','educationalDue','representative','employeeRepresentative','unionStatement','checkMeasures','checkDate','notes','accidentNumber','legalForm','rpuOrganizationUnit']}
  ];

  const fieldTypes={birth:'date',date:'date',deathDate:'date',signatureDate:'date',hireDate:'date',training:'date',investigationDate:'date',recordDate:'date',technicalDue:'date',organizationalDue:'date',educationalDue:'date',checkDate:'date',time:'time',responsibility:'number',children:'number',wageBase:'number',worked:'number',pnDays:'number',description:'textarea',breach:'textarea',discipline:'textarea',employeeFault:'textarea',court:'textarea',courtDecision:'textarea',cause:'textarea',employeeStatement:'textarea',witnesses:'textarea',technical:'textarea',organizational:'textarea',educational:'textarea',unionStatement:'textarea',checkMeasures:'textarea',notes:'textarea'};
  const OPU_REQUIRED=['eventType','ico','salaryLedger','salaryOffice','employee','address','birth','social','position','date','time','place','description','injury'];
  const RPU_REQUIRED=['employee','birth','position','date','time','place','description','sourceCode','causeCode','injuryCode','bodyCode','occupationCode','pnDays','representative','recordDate'];

  function normalize(a){
    if(!a)return a;
    if(!a.eventType)a.eventType='pracovny_uraz';
    if(!a.accidentStage)a.accidentStage='opu';
    if(!Number.isInteger(a.opuSection))a.opuSection=0;
    if(!Number.isInteger(a.rpuSection))a.rpuSection=0;
    if(!['pending','required','not_required'].includes(a.rpuDecision))a.rpuDecision='pending';
    return a;
  }
  function current(){return normalize(typeof currentAccident==='function'?currentAccident():null)}
  function companyNow(){return typeof company==='function'?company():null}
  function missing(keys,a){return keys.filter(function(k){return !filled(a[k]||(k==='ico'&&companyNow()&&(companyNow().ico||companyNow().icoNumber||companyNow().companyIco)))})}
  function percent(keys,a){return Math.round((keys.length-missing(keys,a).length)/keys.length*100)}
  function label(key){return labels[key]||key}
  function stageSectionFor(key){
    let i=OPU_SECTIONS.findIndex(function(s){return s.fields.includes(key)});if(i>=0)return{stage:'opu',section:i};
    i=RPU_SECTIONS.findIndex(function(s){return s.fields.includes(key)});return{stage:'rpu',section:Math.max(0,i)};
  }

  const originalAccidentSet=accidentSet;
  accidentSet=function(k,v){
    originalAccidentSet(k,v);
    updateLiveBits();
    schedulePreview();
  };

  newAccident=function(){
    previewCache.opu=null;previewCache.rpu=null;previewPage=1;
    const a={id:uid(),companyId:state.company,created:new Date().toISOString(),status:'Rozpracované',eventType:'pracovny_uraz',rpuDecision:'pending',accidentStage:'opu',opuSection:0,rpuSection:0};
    db.accidents=db.accidents||[];db.accidents.push(a);save();accidentId=a.id;accidentStep=0;go('accident');
  };
  const originalOpenAccident=openAccident;
  openAccident=function(id){previewCache.opu=null;previewCache.rpu=null;previewPage=1;const a=(db.accidents||[]).find(function(x){return x.id===id});if(a){normalize(a);save()}originalOpenAccident(id)};

  function field(key){
    let html=accidentField(key,label(key),fieldTypes[key]);
    html=html.replace('🔎 Hľadať',I('search')+' Vybrať z číselníka');
    return '<div class="acc23-field" data-field="'+A(key)+'"><span class="acc23-field-number">'+A(key)+'</span>'+html+'</div>';
  }
  function employeePicker(){
    const a=current()||{};
    const people=(db.employees||[]).filter(function(e){return e.companyId===state.company&&e.active!==false&&!e.archived});
    if(!people.length)return '<div class="acc23-helper"><span>'+I('users')+'</span><div><b>Zoznam zamestnancov je prázdny</b><p>Zamestnanca môžeš vyplniť ručne. Po doplnení modulu Zamestnanci sa tu objaví rýchly výber.</p></div></div>';
    return '<label class="acc23-employee-picker"><span>'+I('users')+' Predvyplniť zo zoznamu zamestnancov</span><select onchange="acc23PickEmployee(this.value)"><option value="">— vyber zamestnanca —</option>'+people.sort(function(x,y){return (x.last||'').localeCompare(y.last||'','sk')}).map(function(e){const name=[e.first,e.last].filter(Boolean).join(' ');return '<option value="'+A(e.id)+'" '+(a.employeeSourceId===e.id?'selected':'')+'>'+E(name)+' · '+E(e.role||'bez profesie')+'</option>'}).join('')+'</select><small>Predvyplní sa meno, profesia, pracovisko a dátum nástupu. Údaje pred exportom skontroluj.</small></label>';
  }
  window.acc23PickEmployee=function(id){
    const a=current(),e=(db.employees||[]).find(function(x){return x.id===id});if(!a||!e)return;
    a.employeeSourceId=e.id;a.employee=[e.first,e.last].filter(Boolean).join(' ');a.position=e.role||a.position||'';a.workplace=e.workplace||a.workplace||'';a.hireDate=e.start||a.hireDate||'';a.updated=new Date().toISOString();save();render();setTimeout(schedulePreview,80);
  };

  function sectionTabs(kind,sections,index){
    return '<div class="acc23-section-tabs" role="tablist">'+sections.map(function(s,i){return '<button type="button" class="'+(i===index?'active':'')+'" onclick="acc23Go(\''+kind+'\','+i+')"><span>'+(i+1)+'</span><b>'+E(s.title)+'</b></button>'}).join('')+'</div>';
  }
  function formSection(kind){
    const a=current(),sections=kind==='opu'?OPU_SECTIONS:RPU_SECTIONS,index=kind==='opu'?a.opuSection:a.rpuSection,s=sections[index]||sections[0];
    return '<section class="acc23-form-card"><header><span class="acc23-section-icon">'+I(s.icon)+'</span><div><small>'+(kind==='opu'?'OZNÁMENIE POISTNEJ UDALOSTI':'ZÁZNAM O REGISTROVANOM PRACOVNOM ÚRAZE')+' · ČASŤ '+(index+1)+'/'+sections.length+'</small><h2>'+E(s.title)+'</h2><p>'+E(s.hint)+'</p></div></header>'+(s.employeePicker?employeePicker():'')+'<div class="acc23-field-grid">'+s.fields.map(field).join('')+'</div>'+formActions(kind,index,sections.length)+'</section>';
  }
  function formActions(kind,index,total){
    const back=index>0?'acc23Go(\''+kind+'\','+(index-1)+')':(kind==='rpu'?'acc23Go(\'decision\',0)':'acc23BackToList()');
    const next=index<total-1?'acc23Go(\''+kind+'\','+(index+1)+')':(kind==='opu'?'acc23Go(\'decision\',0)':'acc23Go(\'documents\',0)');
    return '<footer class="acc23-form-actions"><button type="button" class="acc23-btn ghost" onclick="'+back+'">'+I('back')+(index>0?'Predchádzajúca časť':kind==='rpu'?'Späť na rozhodnutie':'Zoznam úrazov')+'</button><span class="acc23-save-state">'+I('check')+' Priebežne uložené v zariadení</span><button type="button" class="acc23-btn primary" onclick="'+next+'">'+(index<total-1?'Pokračovať':'Dokončiť '+(kind==='opu'?'OPU':'RPU'))+I('arrow')+'</button></footer>';
  }

  function decisionView(){
    const a=current();
    return '<section class="acc23-form-card acc23-decision"><header><span class="acc23-section-icon">'+I('scale')+'</span><div><small>KROK 2 · ODBORNÉ ROZHODNUTIE</small><h2>Je potrebné vyhotoviť aj RPU?</h2><p>OPU je už spracované ako prvé. Teraz vedome potvrď ďalší postup podľa zistených skutočností a aktuálnych povinností.</p></div></header><div class="acc23-decision-facts">'+field('pnDays')+field('serious')+'<div class="acc23-helper"><span>'+I('alert')+'</span><div><b>Aplikácia nerozhoduje namiesto bezpečnostného technika</b><p>Voľba iba riadi ďalší pracovný postup. Pred odoslaním over podmienky konkrétneho prípadu.</p></div></div></div><div class="acc23-decision-grid"><button type="button" class="acc23-decision-card yes '+(a.rpuDecision==='required'?'selected':'')+'" onclick="acc23SetDecision(\'required\')"><span>'+I('file')+'</span><b>Áno, vyhotoviť RPU</b><small>Odomkne sa podrobná klasifikácia, ESAW a opatrenia.</small></button><button type="button" class="acc23-decision-card no '+(a.rpuDecision==='not_required'?'selected':'')+'" onclick="acc23SetDecision(\'not_required\')"><span>'+I('check')+'</span><b>Nie, RPU sa nevyžaduje</b><small>Prípad prejde priamo k výstupom OPU. Rozhodnutie možno neskôr zmeniť.</small></button></div><footer class="acc23-form-actions"><button class="acc23-btn ghost" onclick="acc23Go(\'opu\','+(OPU_SECTIONS.length-1)+')">'+I('back')+'Späť na OPU</button><span></span>'+(a.rpuDecision==='required'?'<button class="acc23-btn primary" onclick="acc23Go(\'rpu\',0)">Pokračovať na RPU'+I('arrow')+'</button>':a.rpuDecision==='not_required'?'<button class="acc23-btn primary" onclick="acc23Go(\'documents\',0)">Prejsť na dokumenty'+I('arrow')+'</button>':'<button class="acc23-btn primary" disabled>Najprv vyber rozhodnutie</button>')+'</footer></section>';
  }

  function documentsView(){
    const a=current(),opuMissing=missing(OPU_REQUIRED,a),rpuMissing=missing(RPU_REQUIRED,a),hasRpu=a.rpuDecision==='required';
    return '<section class="acc23-form-card acc23-documents"><header><span class="acc23-section-icon">'+I('pages')+'</span><div><small>KROK '+(hasRpu?'4':'3')+' · KONTROLA A VÝSTUPY</small><h2>Úradné tlačivá pripravené z jedného zadania</h2><p>Dokumenty sa vytvoria pôvodným presným exportným mechanizmom. Pred odoslaním ich vždy skontroluj.</p></div></header><div class="acc23-document-grid">'+documentCard('opu','Oznámenie poistnej udalosti','OPU',opuMissing,false)+(hasRpu?documentCard('rpu','Záznam o registrovanom pracovnom úraze','RPU',rpuMissing,false):documentCard('rpu','Záznam RPU','RPU',[],true))+'</div><div class="acc23-output-note">'+I('shield')+'<div><b>Rozloženie úradných tlačív je chránené</b><p>Sapphire sprievodca mení iba spôsob zadávania. Súradnice PDF a existujúce Word šablóny sa pri tejto aktualizácii nemenia.</p></div></div><footer class="acc23-form-actions"><button class="acc23-btn ghost" onclick="acc23Go(\''+(hasRpu?'rpu':'decision')+'\','+(hasRpu?RPU_SECTIONS.length-1:0)+')">'+I('back')+'Späť</button><span class="acc23-save-state">'+I('check')+' Spis je uložený</span><button class="acc23-btn ghost danger" onclick="deleteAccident(accidentId)">'+I('trash')+'Vymazať spis</button></footer></section>';
  }
  function documentCard(kind,title,abbr,missingFields,disabled){
    if(disabled)return '<article class="acc23-document-card disabled"><span class="acc23-doc-abbr">'+abbr+'</span><div><h3>'+E(title)+'</h3><p>Podľa rozhodnutia sa tento dokument nevyhotovuje.</p><button class="acc23-link-btn" onclick="acc23Go(\'decision\',0)">Zmeniť rozhodnutie</button></div></article>';
    return '<article class="acc23-document-card"><span class="acc23-doc-abbr">'+abbr+'</span><div><h3>'+E(title)+'</h3><p>'+(missingFields.length?'Vyplnenosť: chýba '+missingFields.length+' kontrolovaných údajov.':'Kontrolované údaje sú vyplnené.')+'</p><div class="acc23-doc-actions"><button class="acc23-btn ghost" onclick="acc23Preview(\''+kind+'\')">'+I('eye')+'Presný náhľad</button><button class="acc23-btn primary" onclick="officialExport(\''+kind+'\',\'pdf\')">'+I('download')+'PDF</button><button class="acc23-btn ghost" onclick="officialExport(\''+kind+'\',\'word\')">'+I('file')+'Word</button></div></div></article>';
  }

  function workflow(){
    const a=current(),stage=a.accidentStage,opuPct=percent(OPU_REQUIRED,a),rpuPct=percent(RPU_REQUIRED,a),decision=a.rpuDecision;
    const steps=[
      {stage:'opu',icon:'file',n:'01',title:'Najprv OPU',meta:opuPct+' % vyplnené',state:stage==='opu'?'active':opuPct===100?'done':'ready'},
      {stage:'decision',icon:'scale',n:'02',title:'Rozhodnutie o RPU',meta:decision==='pending'?'Čaká na potvrdenie':decision==='required'?'RPU sa vyhotoví':'RPU sa nevyžaduje',state:stage==='decision'?'active':decision!=='pending'?'done':stage==='opu'?'locked':'ready'},
      {stage:'rpu',icon:decision==='required'?'file':'lock',n:'03',title:'RPU',meta:decision==='required'?rpuPct+' % vyplnené':decision==='not_required'?'Nevyžaduje sa':'Zamknuté do rozhodnutia',state:stage==='rpu'?'active':decision==='required'?(rpuPct===100?'done':'ready'):'locked'},
      {stage:'documents',icon:'pages',n:decision==='required'?'04':'03',title:'Dokumenty',meta:'Náhľad · PDF · Word',state:stage==='documents'?'active':decision!=='pending'?'ready':'locked'}
    ];
    return '<nav class="acc23-workflow" aria-label="Postup spracovania">'+steps.map(function(s){const blocked=(s.stage==='rpu'&&decision!=='required')||(s.stage==='documents'&&decision==='pending');return '<button type="button" class="'+s.state+'" '+(blocked?'disabled':'onclick="acc23Go(\''+s.stage+'\',0)"')+'><span class="acc23-step-icon">'+I(s.icon)+'</span><span><small>'+s.n+'</small><b>'+E(s.title)+'</b><em>'+E(s.meta)+'</em></span>'+(s.state==='done'?I('check','done-mark'):'')+'</button>'}).join('')+'</nav>';
  }

  function livePreview(){
    const a=current(),kind=previewKind;
    return '<aside class="acc23-preview" aria-label="Živý náhľad úradného tlačiva"><header><div><small>ŽIVÝ PRESNÝ NÁHĽAD</small><h2>'+(kind==='rpu'?'Záznam RPU':'Oznámenie poistnej udalosti')+'</h2></div><div class="acc23-preview-switch"><button class="'+(kind==='opu'?'active':'')+'" onclick="acc23Preview(\'opu\')">OPU</button><button class="'+(kind==='rpu'?'active':'')+'" '+(a.rpuDecision!=='required'?'disabled':'')+' onclick="acc23Preview(\'rpu\')">RPU</button></div></header><div class="acc23-preview-toolbar"><span id="acc23-preview-status">'+(previewCache[kind]?'Presný náhľad je pripravený':'Čaká na prvé vykreslenie')+'</span><button type="button" onclick="acc23RefreshPreview()">'+I('refresh')+'Aktualizovať</button></div><div id="acc23-preview-pages" class="acc23-paper-wrap">'+previewPlaceholder(kind)+'</div><div id="acc23-page-controls" class="acc23-page-controls" hidden></div><footer>'+I('shield')+' Biela plocha je skutočná strana generovaného PDF; tmavý režim ju nepremaľuje.</footer></aside>';
  }
  function previewPlaceholder(kind){
    const a=current();if(kind==='rpu'&&a.rpuDecision!=='required')return '<div class="acc23-paper-placeholder">'+I('lock')+'<b>RPU je zatiaľ zamknuté</b><p>Najprv potvrď, že sa má vyhotoviť.</p></div>';
    if(kind==='opu'&&!['ANO','NIE'].includes(a.salaryLedger))return '<div class="acc23-paper-placeholder">'+I('file')+'<b>Vyber evidenciu miezd</b><p>Po vyplnení povinného prepínača sa zobrazí presný živý náhľad OPU.</p></div>';
    return '<div class="acc23-paper-placeholder loading">'+I('refresh')+'<b>Pripravujem úradné tlačivo</b><p>Náhľad vzniká z rovnakého PDF ako export.</p></div>';
  }

  function completeness(){
    const a=current(),kind=a.accidentStage==='rpu'?'rpu':'opu',keys=kind==='rpu'?RPU_REQUIRED:OPU_REQUIRED,miss=missing(keys,a),pct=percent(keys,a);
    return '<aside class="acc23-completeness"><div class="acc23-ring" style="--p:'+pct+'"><span><b id="acc23-percent">'+pct+'%</b><small>vyplnené</small></span></div><div><h3>Kontrola údajov '+kind.toUpperCase()+'</h3><p id="acc23-missing-text">'+(miss.length?'Chýba '+miss.length+' kontrolovaných polí.':'Základné kontrolované polia sú vyplnené.')+'</p></div>'+(miss.length?'<div id="acc23-missing-list" class="acc23-missing-list">'+miss.slice(0,5).map(function(k){return '<button onclick="acc23Focus(\''+k+'\')">'+I('alert')+E(label(k))+'</button>'}).join('')+(miss.length>5?'<small>+ ďalších '+(miss.length-5)+'</small>':'')+'</div>':'<div class="acc23-all-good">'+I('check')+' Pripravené na vizuálnu kontrolu</div>')+'</aside>';
  }

  function header(){
    const a=current(),c=companyNow()||{};
    return '<header class="acc23-top"><div><button class="acc23-back-link" onclick="acc23BackToList()">'+I('back')+'Pracovné úrazy</button><div class="acc23-case-title"><span>'+I('shield')+'</span><div><small>'+E(c.name||'Firma')+' · SAPPHIRE SPRIEVODCA v'+A23_VERSION+'</small><h1>'+(filled(a.employee)?E(a.employee):'Nový pracovný úraz')+'</h1><p>'+(filled(a.date)?E(a.date):'Dátum zatiaľ neurčený')+' · '+(filled(a.place)?E(a.place):'Miesto zatiaľ neurčené')+'</p></div></div></div><div class="acc23-head-actions"><span class="acc23-autosave">'+I('check')+'Automaticky uložené</span><button class="acc23-theme-now" onclick="acc23ToggleTheme()" title="Prepnúť svetlý alebo tmavý režim">'+I(document.documentElement.getAttribute('data-bozp-theme')==='light'?'moon':'sun')+'<span>Zmeniť vzhľad</span></button></div></header>';
  }

  renderAccidentForm=function(){
    const a=current();if(!a)return '<div class="empty">Záznam sa nenašiel.</div>';
    const stage=a.accidentStage;
    if(stage==='rpu'&&a.rpuDecision!=='required')a.accidentStage='decision';
    previewKind=stage==='rpu'?'rpu':'opu';
    let body=stage==='opu'?sectionTabs('opu',OPU_SECTIONS,a.opuSection)+formSection('opu'):stage==='decision'?decisionView():stage==='rpu'?sectionTabs('rpu',RPU_SECTIONS,a.rpuSection)+formSection('rpu'):documentsView();
    setTimeout(function(){if(previewCache[previewKind])drawPdf(previewCache[previewKind],previewKind);else schedulePreview(180)},30);
    return '<div class="acc23-shell">'+header()+workflow()+'<div class="acc23-layout"><main class="acc23-main">'+body+'</main><div class="acc23-right">'+livePreview()+completeness()+'</div></div></div>';
  };

  window.acc23Go=function(stage,section){
    const a=current();if(!a)return;
    if(stage==='rpu'&&a.rpuDecision!=='required'){stage='decision';section=0}
    if(stage==='documents'&&a.rpuDecision==='pending'){stage='decision';section=0}
    a.accidentStage=stage;
    if(stage==='opu')a.opuSection=Math.max(0,Math.min(OPU_SECTIONS.length-1,Number(section)||0));
    if(stage==='rpu')a.rpuSection=Math.max(0,Math.min(RPU_SECTIONS.length-1,Number(section)||0));
    previewKind=stage==='rpu'?'rpu':'opu';save();render();window.scrollTo({top:0,behavior:'smooth'});
  };
  window.acc23SetDecision=function(value){
    const a=current();if(!a||!['required','not_required'].includes(value))return;
    a.rpuDecision=value;a.accidentStage=value==='required'?'rpu':'documents';a.updated=new Date().toISOString();save();render();window.scrollTo({top:0,behavior:'smooth'});
  };
  window.acc23BackToList=function(){go('accidents')};
  window.acc23Focus=function(key){const target=stageSectionFor(key);acc23Go(target.stage,target.section);setTimeout(function(){const el=document.getElementById('ai_'+key)||document.querySelector('[data-field="'+key+'"] input,[data-field="'+key+'"] textarea,[data-field="'+key+'"] select');if(el){el.focus();el.scrollIntoView({behavior:'smooth',block:'center'})}},100)};
  window.acc23ToggleTheme=function(){
    const next=document.documentElement.getAttribute('data-bozp-theme')==='light'?'dark':'light';
    document.documentElement.setAttribute('data-bozp-theme',next);try{localStorage.setItem('bozp-audit-visual-theme-v1',next)}catch(_){}
    const switcher=document.getElementById('bozp-theme-switch');if(switcher)switcher.querySelectorAll('button[data-theme]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.theme===next))});render();
  };

  function schedulePreview(delay){
    clearTimeout(previewTimer);if(state.view!=='accident')return;
    const a=current();if(!a)return;const kind=a.accidentStage==='rpu'?'rpu':previewKind;
    if(kind==='opu'&&!['ANO','NIE'].includes(a.salaryLedger))return;
    if(kind==='rpu'&&a.rpuDecision!=='required')return;
    previewTimer=setTimeout(function(){refreshPreview(kind)},delay==null?1100:delay);
  }
  window.acc23RefreshPreview=function(){refreshPreview(previewKind)};
  window.acc23Preview=function(kind){previewKind=kind;const root=document.querySelector('.acc23-shell');if(root){const temp=livePreview();const old=root.querySelector('.acc23-preview');if(old){const wrap=document.createElement('div');wrap.innerHTML=temp;old.replaceWith(wrap.firstElementChild)}}refreshPreview(kind)};
  window.acc23Page=function(page){previewPage=page;const cached=previewCache[previewKind];if(cached)drawPdf(cached,previewKind)};

  async function refreshPreview(kind){
    const a=current(),status=document.getElementById('acc23-preview-status'),pages=document.getElementById('acc23-preview-pages');if(!a||!pages||previewBusy)return;
    if(kind==='opu'&&!['ANO','NIE'].includes(a.salaryLedger)){pages.innerHTML=previewPlaceholder(kind);if(status)status.textContent='Chýba voľba evidencie miezd';return}
    if(kind==='rpu'&&a.rpuDecision!=='required'){pages.innerHTML=previewPlaceholder(kind);if(status)status.textContent='RPU je zamknuté';return}
    previewBusy=true;if(status)status.textContent='Generujem presný náhľad…';pages.innerHTML='<div class="acc23-paper-placeholder loading">'+I('refresh')+'<b>Generujem presné PDF</b><p>Text sa zapisuje do pôvodných súradníc tlačiva.</p></div>';
    const originalPreview=officialShowPreview;
    let captured=false;
    officialShowPreview=function(bytes,actualKind){captured=true;const copy=bytes instanceof Uint8Array?bytes.slice():new Uint8Array(bytes);previewCache[actualKind]=copy;previewKind=actualKind;previewPage=1;drawPdf(copy,actualKind)};
    try{
      await officialPDF(kind,true);
      if(!captured)throw new Error('Generátor nevrátil údaje náhľadu.');
      if(status)status.textContent='Aktuálne podľa poslednej zmeny';
    }catch(err){console.error('Sapphire preview:',err);pages.innerHTML='<div class="acc23-paper-placeholder error">'+I('alert')+'<b>Náhľad sa nepodarilo vytvoriť</b><p>'+E(err&&err.message?err.message:'Skontroluj zadané údaje.')+'</p><button onclick="acc23RefreshPreview()">Skúsiť znova</button></div>';if(status)status.textContent='Náhľad vyžaduje kontrolu údajov';}
    finally{officialShowPreview=originalPreview;previewBusy=false}
  }
  async function drawPdf(bytes,kind){
    const pages=document.getElementById('acc23-preview-pages'),status=document.getElementById('acc23-preview-status'),controls=document.getElementById('acc23-page-controls');if(!pages||previewKind!==kind)return;
    if(!window.pdfjsLib){pages.innerHTML='<div class="acc23-paper-placeholder error">'+I('alert')+'<b>Prehliadač PDF nie je načítaný</b><p>Použi tlačidlo Presný náhľad v časti Dokumenty.</p></div>';return}
    pages.innerHTML='<div class="acc23-paper-placeholder loading">'+I('refresh')+'<b>Vykresľujem stranu</b></div>';
    try{
      const doc=await window.pdfjsLib.getDocument({data:bytes.slice(),disableWorker:true}).promise;
      previewPage=Math.min(Math.max(1,previewPage),doc.numPages);const page=await doc.getPage(previewPage);const vp=page.getViewport({scale:1.25});const canvas=document.createElement('canvas');canvas.width=Math.ceil(vp.width);canvas.height=Math.ceil(vp.height);canvas.className='acc23-pdf-canvas';pages.innerHTML='';pages.appendChild(canvas);await page.render({canvasContext:canvas.getContext('2d'),viewport:vp}).promise;
      if(controls){controls.hidden=doc.numPages<2;controls.innerHTML=Array.from({length:doc.numPages},function(_,i){return '<button class="'+(previewPage===i+1?'active':'')+'" onclick="acc23Page('+(i+1)+')">Strana '+(i+1)+'</button>'}).join('')}
      if(status)status.textContent='Presný náhľad · strana '+previewPage+' z '+doc.numPages;await doc.destroy();
    }catch(err){console.error('PDF render:',err);pages.innerHTML='<div class="acc23-paper-placeholder error">'+I('alert')+'<b>Stranu sa nepodarilo vykresliť</b><p>'+E(err.message||'Neznáma chyba')+'</p></div>'}
  }

  function updateLiveBits(){
    const a=current();if(!a)return;const kind=a.accidentStage==='rpu'?'rpu':'opu',keys=kind==='rpu'?RPU_REQUIRED:OPU_REQUIRED,pct=percent(keys,a),miss=missing(keys,a);const p=document.getElementById('acc23-percent'),txt=document.getElementById('acc23-missing-text'),ring=document.querySelector('.acc23-ring');if(p)p.textContent=pct+'%';if(txt)txt.textContent=miss.length?'Chýba '+miss.length+' kontrolovaných polí.':'Základné kontrolované polia sú vyplnené.';if(ring)ring.style.setProperty('--p',pct);
    const saveState=document.querySelectorAll('.acc23-save-state');saveState.forEach(function(el){el.innerHTML=I('check')+' Uložené práve teraz'});
  }

  function listCard(x){
    normalize(x);const op=percent(OPU_REQUIRED,x),rp=percent(RPU_REQUIRED,x),decision=x.rpuDecision;return '<article class="acc23-case"><div class="acc23-case-mark">'+I('shield')+'</div><div class="acc23-case-main"><div class="acc23-case-meta"><span>'+(x.date?E(x.date):'Bez dátumu')+'</span><span>'+(x.place?E(x.place):'Bez miesta')+'</span></div><h3>'+E(x.employee||'Nový pracovný úraz')+'</h3><div class="acc23-case-progress"><div><span>OPU</span><b>'+op+' %</b><i><em style="width:'+op+'%"></em></i></div><div class="'+(decision==='required'?'':'muted')+'"><span>RPU</span><b>'+(decision==='required'?rp+' %':decision==='not_required'?'Nevyžaduje sa':'Čaká na rozhodnutie')+'</b><i><em style="width:'+(decision==='required'?rp:0)+'%"></em></i></div></div></div><div class="acc23-case-actions"><button class="acc23-btn primary" onclick="openAccident(\''+A(x.id)+'\')">Otvoriť spis'+I('arrow')+'</button><button class="acc23-icon-btn danger" onclick="deleteAccident(\''+A(x.id)+'\')" aria-label="Vymazať spis">'+I('trash')+'</button></div></article>';
  }
  function renderAccidentList(){
    const c=companyNow();if(!c)return;const items=(db.accidents||[]).filter(function(x){return x.companyId===c.id}).sort(function(a,b){return (b.updated||b.created||'').localeCompare(a.updated||a.created||'')});const open=items.filter(function(x){return normalize(x).rpuDecision==='pending'}).length,ready=items.filter(function(x){return percent(OPU_REQUIRED,normalize(x))===100}).length,rpu=items.filter(function(x){return normalize(x).rpuDecision==='required'}).length;
    document.getElementById('content').innerHTML='<div class="acc23-list"><header class="acc23-list-head"><div><small>PRACOVNÉ ÚRAZY · SAPPHIRE</small><h1>OPU najprv. RPU iba vtedy, keď je potrebné.</h1><p>Jedno prehľadné zadanie, priebežné ukladanie a presný náhľad úradného tlačiva.</p></div><button class="acc23-btn primary large" onclick="newAccident()">'+I('file')+'Nový úraz / OPU</button></header><section class="acc23-list-toolbar"><label>'+I('building')+'<span>Spoločnosť<select onchange="pickAccidentCompany(this.value)">'+db.companies.map(function(x){return '<option value="'+A(x.id)+'" '+(x.id===c.id?'selected':'')+'>'+E(x.name)+'</option>'}).join('')+'</select></span></label><button class="acc23-btn ghost" onclick="go(\'company\')">'+I('back')+'Späť na firmu</button></section><div class="acc23-stats"><article><span>'+I('briefcase')+'</span><div><small>VŠETKY SPISY</small><b>'+items.length+'</b></div></article><article><span>'+I('file')+'</span><div><small>OPU VYPLNENÉ</small><b>'+ready+'</b></div></article><article><span>'+I('scale')+'</span><div><small>ČAKÁ NA ROZHODNUTIE</small><b>'+open+'</b></div></article><article><span>'+I('shield')+'</span><div><small>RPU SA VYHOTOVUJE</small><b>'+rpu+'</b></div></article></div><section class="acc23-case-list"><div class="acc23-list-section-title"><div><small>'+E(c.name)+'</small><h2>Spisy pracovných úrazov</h2></div><span>'+items.length+' záznamov</span></div>'+(items.length?items.map(listCard).join(''):'<div class="acc23-empty">'+I('file')+'<h3>Zatiaľ tu nie je žiadny pracovný úraz</h3><p>Začni OPU. Aplikácia sa na RPU opýta až po jeho dokončení.</p><button class="acc23-btn primary" onclick="newAccident()">Vytvoriť prvé OPU'+I('arrow')+'</button></div>')+'</section></div><div class="foot">BEZPEČNOSTNÝ TECHNIK · pracovná verzia · údaje uložené v zariadení</div>';
  }

  const renderBeforeSapphire=render;
  render=function(){renderBeforeSapphire();if(state.view==='accidents'&&companyNow())renderAccidentList()};
  const versionBadge=document.querySelector('.bozp-version-label');
  if(versionBadge)versionBadge.textContent='V22.13.1';
  if(state.view==='accident'||state.view==='accidents')render();
})();
