/* BOZP Audit V22.12 – operativny prehlad zamestnancov, kontrolna matica a hromadne ukony. */
(function(){
'use strict';

var X={
  company:'',
  search:'',
  status:'all',
  activity:'active',
  profession:'',
  workplace:'',
  sort:'name',
  dir:1,
  pending:[]
};
var baseSetCompany=window.empSetCompany;

function text(v){return String(v==null?'':v).trim()}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function attr(v){return esc(v).replace(/\n/g,' ')}
function norm(v){return text(v).toLocaleLowerCase('sk').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[\s_\-]+/g,'')}
function id(){return 'emp_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8)}
function today(){var d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function fmt(v){if(!v)return '—';var a=String(v).slice(0,10).split('-');return a.length===3?a.reverse().join('. '):String(v)}
function addMonths(v,months){if(!v||!months)return '';var d=new Date(v+'T12:00:00');if(!Number.isFinite(d.getTime()))return '';var day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+Number(months));var end=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(day,end));return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function daysUntil(v){if(!v)return null;return Math.ceil((new Date(v+'T12:00:00')-new Date(today()+'T12:00:00'))/86400000)}
function refresh22(){if(typeof render==='function')render()}
function active(e){return e.active!==false}

function ensure22(){
  db.employees=Array.isArray(db.employees)?db.employees:[];
  db.employeeTrainings=Array.isArray(db.employeeTrainings)?db.employeeTrainings:[];
  db.trainingTypes=Array.isArray(db.trainingTypes)?db.trainingTypes:[];
  db.professions=Array.isArray(db.professions)?db.professions:[];
  db.ppeIssuances=Array.isArray(db.ppeIssuances)?db.ppeIssuances:[];
  db.employeeChangeLog=Array.isArray(db.employeeChangeLog)?db.employeeChangeLog:[];
  if(!X.company&&db.companies&&db.companies.length)X.company=db.companies[0].id;
  if(X.company&&!db.companies.some(function(c){return c.id===X.company}))X.company=db.companies[0]?db.companies[0].id:'';
}
function companyName(cid){var c=(db.companies||[]).find(function(x){return x.id===cid});return c?c.name:'Neznáma firma'}
function companyPeople(includeArchived){
  ensure22();
  return db.employees.filter(function(e){return e.companyId===X.company&&(includeArchived||active(e))});
}
function professions(){return db.professions.filter(function(p){return p.companyId===X.company}).sort(function(a,b){return text(a.name).localeCompare(text(b.name),'sk')})}
function profession(e){return db.professions.find(function(p){return p.companyId===e.companyId&&(p.id===e.professionId||norm(p.name)===norm(e.role))})||null}
function records(e){return db.employeeTrainings.filter(function(t){return t.employeeId===e.id})}
function typeById(typeId){return db.trainingTypes.find(function(t){return t.id===typeId})||null}
function expiry(t){var typ=typeById(t.typeId);return t.expires||addMonths(t.completed,typ&&typ.months)||''}
function recordState(t){
  if(!t||!t.completed)return t&&t.planned?'planned':'absent';
  var end=expiry(t),days=daysUntil(end);
  if(days==null)return 'ok';
  return days<=0?'expired':days<=30?'soon':'ok';
}
function groupedRecords(e){
  var groups={};
  records(e).forEach(function(t){
    var key=t.typeId||('other:'+text(t.otherName));
    (groups[key]||(groups[key]=[])).push(t);
  });
  return groups;
}
function latestFor(e,typeId){
  var list=records(e).filter(function(t){return t.typeId===typeId&&t.completed});
  list.sort(function(a,b){return String(b.completed).localeCompare(String(a.completed))});
  return list[0]||null;
}
function effectiveRecords(e){
  var groups=groupedRecords(e),out=[];
  Object.keys(groups).forEach(function(key){
    var completed=groups[key].filter(function(t){return !!t.completed}).sort(function(a,b){return String(b.completed).localeCompare(String(a.completed))});
    if(completed[0])out.push(completed[0]);
    else{
      var planned=groups[key].filter(function(t){return !!t.planned}).sort(function(a,b){return String(a.planned).localeCompare(String(b.planned))});
      if(planned[0])out.push(planned[0]);
    }
  });
  return out;
}
function requiredTypes(e){var p=profession(e);return p&&Array.isArray(p.trainingTypeIds)?p.trainingTypeIds:[]}
function requirementState(e,typeId){var t=latestFor(e,typeId);return t?recordState(t):'absent'}

function activeCardItems(card){
  return (card&&Array.isArray(card.items)?card.items:[]).filter(function(i){
    return i&&i.id&&!['Nevyžaduje sa','Vyradené','Nevhodné'].includes(i.status)&&!(i.id==='gloves'&&/^Bez rukavíc/i.test(i.type||''));
  });
}
function usableCard(card){var items=activeCardItems(card);return items.length>0&&items.every(function(i){return i.approvalStatus==='Schválené'})}
function ppeCard(e){return window.empResolvePpeCard?window.empResolvePpeCard(e):null}
function ppeName(item){
  var names={helmet:'Ochranná prilba',eyes:'Ochranné okuliare',shoes:'Bezpečnostná obuv',gloves:'Ochranné rukavice',ears:'Chrániče sluchu',resp:'Ochrana dýchacích ciest',clothes:'Ochranný odev',vest:'Reflexná vesta',fall:'Ochrana proti pádu','other-01':'Tvárový štít','other-02':'Chrániče kolien','other-03':'Zástera','other-04':'Rukávniky','other-05':'Návleky','other-06':'Kukla','other-07':'Reflexná vesta','other-08':'Zateplená vesta'};
  return names[item.id]||item.name||item.id;
}
function ppeKey(item){return String(item.id)+'|'+String(item.type||'')}
function plannedItems(card){
  return activeCardItems(card).map(function(item){
    var plan=card.exchangePlans&&card.exchangePlans[item.id];
    if(!plan)return item;
    var amount=plan.mode==='fixed'?Number(plan.amount)||0:0;
    return Object.assign({},item,{replacementDays:plan.unit==='days'?amount:0,replacementMonths:plan.unit==='years'?12*amount:plan.unit==='months'?amount:0});
  });
}
function latestIssue(e,key){
  var list=(db.ppeIssuances||[]).filter(function(b){return b.employeeId===e.id&&b.companyId===e.companyId}).flatMap(function(batch){
    return (batch.items||[]).map(function(it){return Object.assign({},it,{issuedOn:batch.issuedOn,signature:it.signature||batch.signature||'',signedAt:it.signedAt||batch.signedAt||''})});
  }).filter(function(it){return it.key===key});
  list.sort(function(a,b){return (String(b.issuedOn)+'|'+String(b.signedAt)).localeCompare(String(a.issuedOn)+'|'+String(a.signedAt))});
  return list[0]||null;
}
function issueState(it){
  if(!it)return 'missing';
  var days=daysUntil(it.dueDate);
  if(days==null)return 'ok';
  return days<=0?'expired':days<=30?'soon':'ok';
}

function employeeAssessment(e){
  if(!active(e))return {state:'archived',reasons:[{kind:'archive',level:'info',text:'Ukončený pracovný pomer'}],missingTraining:false,ppeProblem:false};
  var reasons=[],p=profession(e),req=requiredTypes(e);
  if(!p)reasons.push({kind:'profile',level:'incomplete',text:'Chýba priradená profesia'});
  if(p&&!req.length)reasons.push({kind:'training',level:'incomplete',text:'Profesia nemá určené školenia'});
  req.forEach(function(typeId){
    var typ=typeById(typeId),r=latestFor(e,typeId),state=r?recordState(r):'absent';
    var name=typ?typ.name:'Neznáme školenie';
    if(state==='absent')reasons.push({kind:'training',level:'danger',text:'Chýba: '+name});
    if(state==='expired')reasons.push({kind:'training',level:'danger',text:'Po termíne: '+name+' ('+fmt(expiry(r))+')'});
    if(state==='soon')reasons.push({kind:'training',level:'warning',text:'Do 30 dní: '+name+' ('+fmt(expiry(r))+')'});
  });
  var card=ppeCard(e);
  if(!card)reasons.push({kind:'ppe',level:'incomplete',text:'Profesia nemá schválenú kartu OOPP'});
  else{
    plannedItems(card).forEach(function(item){
      var issue=latestIssue(e,ppeKey(item)),state=issueState(issue),name=ppeName(item);
      if(state==='missing')reasons.push({kind:'ppe',level:'danger',text:'Nevydané OOPP: '+name});
      if(state==='expired')reasons.push({kind:'ppe',level:'danger',text:'Výmena OOPP po termíne: '+name});
      if(state==='soon')reasons.push({kind:'ppe',level:'warning',text:'Výmena OOPP do 30 dní: '+name});
      if(issue&&!issue.signature)reasons.push({kind:'ppe',level:'danger',text:'Chýba podpis prevzatia: '+name});
    });
  }
  var state=reasons.some(function(r){return r.level==='danger'})?'expired':reasons.some(function(r){return r.level==='incomplete'})?'incomplete':reasons.some(function(r){return r.level==='warning'})?'soon':'ok';
  return {
    state:state,
    reasons:reasons,
    missingTraining:reasons.some(function(r){return r.kind==='training'&&(r.level==='danger'||r.level==='incomplete')}),
    ppeProblem:reasons.some(function(r){return r.kind==='ppe'&&(r.level==='danger'||r.level==='incomplete')})
  };
}
function trainingSummary(e){
  var req=requiredTypes(e),current=req.length?req.map(function(typeId){return latestFor(e,typeId)}).filter(Boolean):effectiveRecords(e);
  var states=req.length?req.map(function(typeId){return requirementState(e,typeId)}):current.map(recordState);
  var missing=states.filter(function(s){return s==='absent'}).length;
  var expired=states.filter(function(s){return s==='expired'}).length;
  var soon=states.filter(function(s){return s==='soon'}).length;
  var valid=states.filter(function(s){return s==='ok'}).length;
  var future=current.filter(function(t){var d=daysUntil(expiry(t));return d!=null&&d>=0}).sort(function(a,b){return String(expiry(a)).localeCompare(String(expiry(b)))})[0];
  var state=missing||expired?'expired':soon?'soon':(!req.length&&!current.length?'incomplete':'ok');
  var label=missing?missing+' chýba':expired?expired+' po termíne':soon?soon+' do 30 dní':state==='incomplete'?'Nenastavené':'V poriadku';
  var description=future?'Najbližšie '+fmt(expiry(future)):(valid+' platných');
  return {state:state,label:label,description:description};
}
function ppeSummary(e){
  var card=ppeCard(e);
  if(!card)return {state:'incomplete',label:'Karta nepriradená',description:'Najprv schváľ OOPP profesie'};
  var items=plannedItems(card),issues=items.map(function(i){return latestIssue(e,ppeKey(i))}),states=issues.map(issueState);
  var missing=states.filter(function(s){return s==='missing'}).length;
  var expired=states.filter(function(s){return s==='expired'}).length;
  var soon=states.filter(function(s){return s==='soon'}).length;
  var noSign=issues.filter(function(i){return i&&!i.signature}).length;
  var state=missing||expired||noSign?'expired':soon?'soon':'ok';
  var label=missing?missing+' nevydané':expired?expired+' po termíne':noSign?noSign+' bez podpisu':soon?soon+' do 30 dní':'V poriadku';
  return {state:state,label:label,description:items.length+' položiek OOPP'};
}
function stateLabel(state){return {ok:'V poriadku',soon:'Do 30 dní',expired:'Treba riešiť',incomplete:'Neúplné nastavenie',archived:'Archivovaný',absent:'Chýba',missing:'Nevydané',planned:'Plánované'}[state]||state}
function badge(state,label){return '<span class="emp-tag emp22-'+esc(state)+'">'+esc(label||stateLabel(state))+'</span>'}

function icon(name){
  var paths={
    people:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    alert:'<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    school:'<path d="m3 10 9-5 9 5-9 5-9-5Z"/><path d="M7 12.5V17c3 2 7 2 10 0v-4.5"/><path d="M21 10v6"/>',
    shield:'<path d="M12 3 5 6v5c0 4.8 2.9 8.1 7 10 4.1-1.9 7-5.2 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/>',
    matrix:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
    upload:'<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 15v5h16v-5"/>',
    add:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18"/>',
    download:'<path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/>'
  };
  return '<svg class="emp22-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.shield)+'</svg>';
}
function option(value,label,selected){return '<option value="'+attr(value)+'"'+(value===selected?' selected':'')+'>'+esc(label)+'</option>'}

function filterPeople(list){
  var query=norm(X.search);
  return list.filter(function(e){
    if(query&&!norm([e.first,e.last,e.number,e.role,e.workplace].join(' ')).includes(query))return false;
    if(X.profession&&e.professionId!==X.profession&&norm(e.role)!==norm((db.professions.find(function(p){return p.id===X.profession})||{}).name))return false;
    if(X.workplace&&text(e.workplace)!==X.workplace)return false;
    var a=employeeAssessment(e);
    if(X.status==='attention'&&!['expired','incomplete'].includes(a.state))return false;
    if(X.status==='soon'&&a.state!=='soon')return false;
    if(X.status==='ok'&&a.state!=='ok')return false;
    if(X.status==='training'&&!a.missingTraining)return false;
    if(X.status==='ppe'&&!a.ppeProblem)return false;
    return true;
  }).sort(function(a,b){
    var va=X.sort==='role'?text(a.role):X.sort==='status'?employeeAssessment(a).state:[a.last,a.first].join(' ');
    var vb=X.sort==='role'?text(b.role):X.sort==='status'?employeeAssessment(b).state:[b.last,b.first].join(' ');
    return X.dir*String(va).localeCompare(String(vb),'sk',{numeric:true});
  });
}
function summaryCard(kind,label,value,note,filter,activeFilter){
  return '<button type="button" class="emp-kpi emp22-kpi '+(X.status===activeFilter?'selected':'')+'" onclick="emp22SetStatus(\''+filter+'\')">'+
    '<span class="icon">'+icon(kind)+'</span><span class="label">'+esc(label)+'</span><strong>'+value+'</strong><small>'+esc(note)+'</small></button>';
}
function reasonPreview(a){
  if(a.state==='ok')return '<span class="emp22-okline">'+icon('shield')+' Bez otvorených úloh</span>';
  if(a.state==='archived')return '<span class="emp22-mutedline">História zostala zachovaná</span>';
  var rows=a.reasons.slice(0,2).map(function(r){return '<span class="emp22-reason '+r.level+'">'+esc(r.text)+'</span>'}).join('');
  if(a.reasons.length>2)rows+='<span class="emp22-more">+'+(a.reasons.length-2)+' ďalšie</span>';
  return rows;
}
function overview22(){
  ensure22();
  var all=companyPeople(true),activeList=all.filter(active),archived=all.filter(function(e){return !active(e)});
  var assessments=activeList.map(employeeAssessment);
  var attention=assessments.filter(function(a){return a.state==='expired'||a.state==='incomplete'}).length;
  var soon=assessments.filter(function(a){return a.state==='soon'}).length;
  var training=assessments.filter(function(a){return a.missingTraining}).length;
  var ppe=assessments.filter(function(a){return a.ppeProblem}).length;
  var base=X.activity==='archived'?archived:activeList;
  var list=filterPeople(base);
  var companyOptions='<option value="">'+(db.companies.length?'Vyber firmu':'Najprv pridaj firmu')+'</option>'+db.companies.map(function(c){return option(c.id,c.name,X.company)}).join('');
  var positionOptions='<option value="">Všetky profesie</option>'+professions().map(function(p){return option(p.id,p.name,X.profession)}).join('');
  var workplaces=Array.from(new Set(all.map(function(e){return text(e.workplace)}).filter(Boolean))).sort(function(a,b){return a.localeCompare(b,'sk')});
  var workplaceOptions='<option value="">Všetky pracoviská</option>'+workplaces.map(function(w){return option(w,w,X.workplace)}).join('');
  var rows=list.map(function(e){
    var tr=trainingSummary(e),pp=ppeSummary(e),a=employeeAssessment(e);
    return '<tr class="'+(!active(e)?'emp22-archived-row':'')+'"><td><div class="emp-person"><span class="emp-avatar">'+esc((text(e.first).slice(0,1)+text(e.last).slice(0,1)).toUpperCase()||'Z')+'</span><span><b>'+esc(e.first)+' '+esc(e.last)+'</b><small>'+(e.number?'Osobné číslo: '+esc(e.number):'Nástup: '+fmt(e.start))+'</small></span></div></td>'+
      '<td><button class="emp-role-link" onclick="empOpenProfessionDetail(\''+attr(e.id)+'\')">'+esc(e.role||'Bez profesie')+' ↗</button><small class="emp22-sub">'+esc(e.workplace||'Bez pracoviska')+'</small></td>'+
      '<td><button class="emp-summary-button" onclick="empOpenDetailTab(\''+attr(e.id)+'\',\'trainings\')">'+badge(tr.state,tr.label)+'<small>'+esc(tr.description)+'</small><span class="emp-summary-more">Otvoriť školenia ›</span></button></td>'+
      '<td><button class="emp-summary-button" onclick="empOpenDetailTab(\''+attr(e.id)+'\',\'ppe\')">'+badge(pp.state,pp.label)+'<small>'+esc(pp.description)+'</small><span class="emp-summary-more">Otvoriť OOPP ›</span></button></td>'+
      '<td class="emp22-action-cell">'+badge(a.state)+reasonPreview(a)+'</td>'+
      '<td><div class="emp-rowactions"><button class="emp-btn plain" onclick="empOpenDetail(\''+attr(e.id)+'\')">Karta</button>'+(!active(e)?'<button class="emp-link" onclick="emp22Restore(\''+attr(e.id)+'\')">Obnoviť</button>':'')+'</div></td></tr>';
  }).join('');
  var empty='<div class="emp-empty"><span class="emp22-empty-icon">'+icon(X.activity==='archived'?'briefcase':'people')+'</span><h3>'+(X.activity==='archived'?'Žiadni archivovaní zamestnanci':'Nenašli sa zamestnanci')+'</h3><p>Uprav filtre alebo pridaj nového zamestnanca.</p></div>';
  return '<main class="emp-view emp22-view">'+
    '<div class="emp-top emp22-top"><div><span class="emp-overline">BOZP Audit · OPERATÍVNY PREHĽAD</span><h1>Zamestnanci</h1><p>Na jednej obrazovke vidíš, kto je v poriadku a komu presne chýba školenie, OOPP alebo podpis.</p></div>'+
      '<div class="emp-hero-actions"><button class="emp-btn yellow" onclick="empOpenForm()">'+icon('add')+' Pridať zamestnanca</button><button class="emp-btn" onclick="emp22OpenImport()">'+icon('upload')+' Import Excel</button><button class="emp-btn" onclick="emp22OpenComplianceMatrix()">'+icon('matrix')+' Kontrolná matica</button></div></div>'+
    '<div class="emp-kpis emp22-kpis">'+
      summaryCard('people','Aktívni',activeList.length,companyName(X.company),'all','all')+
      summaryCard('alert','Treba riešiť',attention,'Chyba alebo neúplné nastavenie','attention','attention')+
      summaryCard('clock','Do 30 dní',soon,'Blížiaci sa termín','soon','soon')+
      summaryCard('school','Chýba školenie',training,'Požiadavka profesie','training','training')+
      summaryCard('shield','OOPP / podpis',ppe,'Nevydané, výmena alebo podpis','ppe','ppe')+
    '</div>'+
    (attention?'<section class="emp22-action-banner">'+icon('alert')+'<div><strong>'+attention+' zamestnancov vyžaduje zásah</strong><span>Najprv rieš červené stavy, potom neúplné nastavenia profesií.</span></div><button class="emp-btn primary" onclick="emp22SetStatus(\'attention\')">Zobraziť úlohy</button></section>':'')+
    '<section class="emp-panel emp22-filter-panel"><div class="emp22-filter-grid">'+
      '<label class="emp-control">Firma / zamestnávateľ<select onchange="emp22SetCompany(this.value)">'+companyOptions+'</select></label>'+
      '<label class="emp-control">Hľadať<input type="search" value="'+attr(X.search)+'" oninput="emp22Search(this.value)" placeholder="Meno, osobné číslo, profesia…"></label>'+
      '<label class="emp-control">Profesia<select onchange="emp22SetProfession(this.value)">'+positionOptions+'</select></label>'+
      '<label class="emp-control">Pracovisko<select onchange="emp22SetWorkplace(this.value)">'+workplaceOptions+'</select></label>'+
      '<label class="emp-control">Stav<select onchange="emp22SetStatus(this.value)">'+
        option('all','Všetky stavy',X.status)+option('attention','Treba riešiť',X.status)+option('soon','Do 30 dní',X.status)+option('ok','V poriadku',X.status)+option('training','Chýba školenie',X.status)+option('ppe','OOPP alebo podpis',X.status)+'</select></label>'+
    '</div><div class="emp22-toolbar">'+
      '<div class="emp22-segment"><button class="'+(X.activity==='active'?'on':'')+'" onclick="emp22SetActivity(\'active\')">Aktívni <b>'+activeList.length+'</b></button><button class="'+(X.activity==='archived'?'on':'')+'" onclick="emp22SetActivity(\'archived\')">Archív <b>'+archived.length+'</b></button></div>'+
      '<div class="emp22-toolbar-actions"><button class="emp-btn plain" onclick="emp22OpenPositions()">'+icon('briefcase')+' Profesie</button><button class="emp-btn plain" onclick="empOpenMatrix()">'+icon('matrix')+' Nastaviť požiadavky</button><button class="emp-btn plain" onclick="emp22OpenBulkTraining()">'+icon('school')+' Hromadné školenie</button><button class="emp-btn plain" onclick="empOpenTypes()">Katalóg školení</button><button class="emp-btn plain" onclick="emp22Export()">'+icon('download')+' Export</button></div>'+
    '</div></section>'+
    '<section class="emp-panel"><h2 class="emp-sectiontitle">'+(X.activity==='archived'?'Archív zamestnancov':'Kontrolný zoznam zamestnancov')+' <small>'+list.length+' záznamov</small></h2>'+
      (list.length?'<div class="emp-table-scroll"><table class="emp-table emp22-table"><thead><tr><th><button class="emp-sort" onclick="emp22Sort(\'name\')">Zamestnanec</button></th><th><button class="emp-sort" onclick="emp22Sort(\'role\')">Profesia / pracovisko</button></th><th>Školenia</th><th>OOPP</th><th><button class="emp-sort" onclick="emp22Sort(\'status\')">Čo treba urobiť</button></th><th>Akcia</th></tr></thead><tbody>'+rows+'</tbody></table></div>':empty)+
    '</section><p class="emp-help">Stav sa počíta z posledného absolvovaného záznamu každého druhu. Staršie školenia zostávajú v histórii, ale nespôsobujú falošný červený stav.</p></main>';
}

window.emp22SetCompany=function(value){
  X.company=value;X.search='';X.status='all';X.profession='';X.workplace='';
  if(typeof baseSetCompany==='function')baseSetCompany(value);else refresh22();
};
window.emp22Search=function(value){
  X.search=value;
  var pos=document.activeElement&&document.activeElement.selectionStart;
  refresh22();
  var input=document.querySelector('.emp22-filter-grid input[type=search]');
  if(input){input.focus();try{input.setSelectionRange(pos,pos)}catch(e){}}
};
window.emp22SetStatus=function(value){X.status=value;refresh22()};
window.emp22SetProfession=function(value){X.profession=value;refresh22()};
window.emp22SetWorkplace=function(value){X.workplace=value;refresh22()};
window.emp22SetActivity=function(value){X.activity=value;X.status='all';refresh22()};
window.emp22Sort=function(key){X.dir=X.sort===key?-X.dir:1;X.sort=key;refresh22()};

function modal22(title,kicker,body,footer,full){
  var old=document.getElementById('emp22-overlay');if(old)old.remove();
  var div=document.createElement('div');
  div.id='emp22-overlay';div.className='emp-modal'+(full?' emp-fullscreen-matrix':'');
  div.innerHTML='<div class="emp-dialog wide" role="dialog" aria-modal="true"><div class="emp-dialog-head"><div><small>'+esc(kicker||'BOZP AUDIT')+'</small><h2>'+esc(title)+'</h2></div><button aria-label="Zavrieť" onclick="emp22Close()">×</button></div><div class="emp-dialog-body">'+body+'</div>'+(footer?'<div class="emp-dialog-footer">'+footer+'</div>':'')+'</div>';
  div.addEventListener('click',function(e){if(e.target===div)window.emp22Close()});
  document.body.appendChild(div);
}
window.emp22Close=function(){var el=document.getElementById('emp22-overlay');if(el)el.remove()};

function logChange(employeeId,action,detail){
  var e=db.employees.find(function(x){return x.id===employeeId});
  db.employeeChangeLog.push({id:id(),employeeId:employeeId,companyId:e?e.companyId:X.company,action:action,detail:detail||'',at:new Date().toISOString()});
}
window.emp22Archive=function(employeeId){
  var e=db.employees.find(function(x){return x.id===employeeId});if(!e)return;
  if(!active(e)){window.emp22Restore(employeeId);return}
  modal22('Ukončiť pracovný pomer','ARCHIVÁCIA · HISTÓRIA ZOSTANE ZACHOVANÁ',
    '<form id="emp22-archive-form" onsubmit="event.preventDefault();emp22ArchiveCommit(\''+attr(employeeId)+'\')"><div class="emp-note"><b>'+esc(e.first)+' '+esc(e.last)+'</b> sa nevymaže. Zachovajú sa školenia, osvedčenia, OOPP aj podpisy.</div><div class="emp-grid"><label class="emp-control">Dátum ukončenia<input name="endDate" type="date" value="'+today()+'" required></label><label class="emp-control">Dôvod / poznámka<input name="reason" maxlength="250" placeholder="Napr. skončenie pracovného pomeru"></label></div><div class="emp-inline emp22-right"><button type="button" class="emp-btn" onclick="emp22Close()">Zrušiť</button><button class="emp-btn warn" type="submit">Archivovať zamestnanca</button></div></form>');
};
window.emp22ArchiveCommit=function(employeeId){
  var f=document.getElementById('emp22-archive-form'),e=db.employees.find(function(x){return x.id===employeeId});if(!f||!e||!f.reportValidity())return;
  var data=new FormData(f);e.active=false;e.endDate=text(data.get('endDate'));e.archiveReason=text(data.get('reason'));e.archivedAt=new Date().toISOString();
  logChange(e.id,'Archivácia',e.archiveReason||('Pracovný pomer ukončený '+fmt(e.endDate)));save();window.emp22Close();X.activity='active';refresh22();
};
window.emp22Restore=function(employeeId){
  var e=db.employees.find(function(x){return x.id===employeeId});if(!e)return;
  if(!confirm('Obnoviť '+e.first+' '+e.last+' medzi aktívnych zamestnancov?'))return;
  e.active=true;e.restoredAt=new Date().toISOString();logChange(e.id,'Obnovenie','Zamestnanec bol obnovený z archívu');save();refresh22();
};
window.empDelete=window.emp22Archive;

function complianceCell(e,typeId){
  if(!requiredTypes(e).includes(typeId))return '<td class="emp22-matrix-na">—</td>';
  var t=latestFor(e,typeId),state=t?recordState(t):'absent';
  var label=state==='ok'?'Platné':state==='soon'?'Do 30 dní':state==='expired'?'Po termíne':'Chýba';
  var detail=t&&expiry(t)?fmt(expiry(t)):'';
  return '<td><button class="emp22-matrix-cell '+state+'" onclick="empOpenDetailTab(\''+attr(e.id)+'\',\'trainings\')" title="'+attr(label+(detail?' · '+detail:''))+'"><b>'+(state==='ok'?'✓':state==='soon'?'!':'×')+'</b><span>'+esc(label)+'</span><small>'+esc(detail)+'</small></button></td>';
}
window.emp22OpenComplianceMatrix=function(){
  ensure22();
  var people=companyPeople(false);
  var typeIds=[];
  professions().forEach(function(p){(p.trainingTypeIds||[]).forEach(function(typeId){if(!typeIds.includes(typeId))typeIds.push(typeId)})});
  var types=typeIds.map(typeById).filter(Boolean).sort(function(a,b){return text(a.name).localeCompare(text(b.name),'sk')});
  var head=types.map(function(t){return '<th title="'+attr(t.name)+'"><span>'+esc(t.name)+'</span><small>'+(t.months?esc(t.months)+' mes.':'individuálne')+'</small></th>'}).join('');
  var body=people.map(function(e){
    var a=employeeAssessment(e),pp=ppeSummary(e);
    return '<tr data-search="'+attr(norm([e.first,e.last,e.role,e.workplace,e.number].join(' ')))+'"><th class="emp-sticky"><b>'+esc(e.first)+' '+esc(e.last)+'</b><small>'+esc(e.role||'Bez profesie')+' · '+esc(e.workplace||'—')+'</small></th>'+
      types.map(function(t){return complianceCell(e,t.id)}).join('')+
      '<td><button class="emp22-matrix-cell '+pp.state+'" onclick="empOpenDetailTab(\''+attr(e.id)+'\',\'ppe\')"><b>'+(pp.state==='ok'?'✓':pp.state==='soon'?'!':'×')+'</b><span>'+esc(pp.label)+'</span></button></td>'+
      '<td><button class="emp22-matrix-cell '+a.state+'" onclick="empOpenDetail(\''+attr(e.id)+'\')"><b>'+(a.state==='ok'?'✓':a.state==='soon'?'!':'×')+'</b><span>'+esc(stateLabel(a.state))+'</span></button></td></tr>';
  }).join('');
  var html='<div class="emp-matrix-help"><b>Kontrolná matica: zamestnanec × skutočný stav</b><p>Toto nie je nastavovacia matica. Ukazuje posledné platné školenie, OOPP a otvorené úlohy každého aktívneho zamestnanca.</p><div class="emp-inline"><label class="emp-control emp22-matrix-search">Hľadať zamestnanca<input type="search" oninput="emp22MatrixSearch(this.value)" placeholder="Meno, profesia, pracovisko…"></label><button class="emp-btn" onclick="emp22Close();empOpenMatrix()">Nastaviť požiadavky profesií</button><button class="emp-btn primary" onclick="emp22Close();emp22OpenBulkTraining()">Hromadné školenie</button></div></div>'+
    '<div class="emp22-legend"><span class="ok">✓ Platné</span><span class="soon">! Do 30 dní</span><span class="bad">× Chýba / po termíne</span><span class="na">— Nevyžaduje sa</span></div>'+
    (people.length?'<div class="emp-matrix-scroll"><table class="emp-matrix emp22-compliance"><thead><tr><th class="emp-sticky">Zamestnanec</th>'+head+'<th>OOPP</th><th>Celkový stav</th></tr></thead><tbody>'+body+'</tbody></table></div>':'<div class="emp-note">Vo firme nie sú aktívni zamestnanci.</div>')+
    '<p class="emp-help">Staré záznamy zostávajú v histórii. Farbu bunky určuje iba posledné absolvované školenie daného druhu.</p>';
  modal22('Matica školení – kontrola zamestnancov','FIRMA: '+companyName(X.company),html,'',true);
};
window.emp22MatrixSearch=function(value){
  var q=norm(value);
  document.querySelectorAll('.emp22-compliance tbody tr').forEach(function(row){row.hidden=q&&!String(row.dataset.search||'').includes(q)});
};

window.emp22OpenBulkTraining=function(){
  ensure22();
  var people=companyPeople(false);
  var positions=professions();
  var typeOptions=db.trainingTypes.slice().sort(function(a,b){return text(a.name).localeCompare(text(b.name),'sk')}).map(function(t){return option(t.id,t.name,'')}).join('');
  var personRows=people.map(function(e){
    return '<label class="emp22-bulk-person" data-search="'+attr(norm([e.first,e.last,e.role,e.workplace,e.number].join(' ')))+'" data-profession="'+attr(e.professionId||'')+'"><input type="checkbox" name="employee" value="'+attr(e.id)+'"><span><b>'+esc(e.first)+' '+esc(e.last)+'</b><small>'+esc(e.role||'Bez profesie')+' · '+esc(e.workplace||'—')+'</small></span></label>';
  }).join('');
  var posOptions='<option value="">Všetky profesie</option>'+positions.map(function(p){return option(p.id,p.name,'')}).join('');
  var html='<form id="emp22-bulk-form" onsubmit="event.preventDefault();emp22SaveBulkTraining()"><div class="emp-grid"><label class="emp-control">Druh školenia *<select name="typeId" required><option value="">Vyber školenie</option>'+typeOptions+'</select></label><label class="emp-control">Absolvované dňa *<input name="completed" type="date" value="'+today()+'" required></label><label class="emp-control">Platnosť do<input name="expires" type="date"></label><label class="emp-control">Školiteľ / organizácia<input name="trainer" maxlength="150"></label><label class="emp-control">Číslo záznamu / osvedčenia<input name="certificate" maxlength="100"></label><label class="emp-control">Poznámka<input name="notes" maxlength="500"></label></div>'+
    '<div class="emp22-bulk-toolbar"><label class="emp-control">Filtrovať profesiu<select onchange="emp22BulkFilter()">'+posOptions+'</select></label><label class="emp-control">Hľadať<input type="search" oninput="emp22BulkFilter()" placeholder="Meno alebo pracovisko"></label><button type="button" class="emp-btn plain" onclick="emp22BulkToggle(true)">Označiť zobrazených</button><button type="button" class="emp-btn plain" onclick="emp22BulkToggle(false)">Zrušiť výber</button></div>'+
    '<div class="emp22-bulk-list">'+(personRows||'<div class="emp-note">Žiadni aktívni zamestnanci.</div>')+'</div>'+
    '<div class="emp-note">Ak už pri zamestnancovi existuje rovnaký druh školenia s rovnakým dátumom, záznam sa bezpečne aktualizuje namiesto vytvorenia duplicity.</div>'+
    '<div class="emp-inline emp22-right"><button type="button" class="emp-btn" onclick="emp22Close()">Zrušiť</button><button type="submit" class="emp-btn primary">Uložiť označeným zamestnancom</button></div></form>';
  modal22('Hromadné zapísanie školenia','JEDEN ÚKON · VIAC ZAMESTNANCOV',html);
};
window.emp22BulkFilter=function(){
  var form=document.getElementById('emp22-bulk-form');if(!form)return;
  var pid=form.querySelector('.emp22-bulk-toolbar select').value,q=norm(form.querySelector('.emp22-bulk-toolbar input').value);
  form.querySelectorAll('.emp22-bulk-person').forEach(function(row){row.hidden=(pid&&row.dataset.profession!==pid)||(q&&!row.dataset.search.includes(q))});
};
window.emp22BulkToggle=function(checked){
  document.querySelectorAll('.emp22-bulk-person:not([hidden]) input').forEach(function(input){input.checked=checked});
};
window.emp22SaveBulkTraining=function(){
  var form=document.getElementById('emp22-bulk-form');if(!form||!form.reportValidity())return;
  var selected=Array.from(form.querySelectorAll('input[name=employee]:checked')).map(function(i){return i.value});
  if(!selected.length){alert('Označ aspoň jedného zamestnanca.');return}
  var data=Object.fromEntries(new FormData(form));
  var added=0,updated=0;
  selected.forEach(function(employeeId){
    var old=db.employeeTrainings.find(function(t){return t.employeeId===employeeId&&t.typeId===data.typeId&&t.completed===data.completed});
    var values={typeId:data.typeId,completed:data.completed,expires:data.expires||'',planned:'',trainer:text(data.trainer),certificate:text(data.certificate),notes:text(data.notes)};
    if(old){Object.assign(old,values,{updated:new Date().toISOString()});updated++}
    else{db.employeeTrainings.push(Object.assign({id:id(),employeeId:employeeId,created:new Date().toISOString()},values));added++}
    var typ=typeById(data.typeId);logChange(employeeId,'Hromadné školenie',(typ?typ.name:'Školenie')+' · '+fmt(data.completed));
  });
  save();window.emp22Close();refresh22();alert('Uložené: '+added+' nových záznamov, '+updated+' aktualizovaných.');
};

window.emp22OpenPositions=function(){
  ensure22();
  var cards=professions().map(function(p){
    var staff=companyPeople(false).filter(function(e){return e.professionId===p.id||norm(e.role)===norm(p.name)});
    var states=staff.map(employeeAssessment),bad=states.filter(function(a){return a.state==='expired'||a.state==='incomplete'}).length,soon=states.filter(function(a){return a.state==='soon'}).length,ok=states.filter(function(a){return a.state==='ok'}).length;
    var card=(db.ooppCards||[]).find(function(c){return c.id===p.ooppCardId&&c.companyId===X.company&&usableCard(c)});
    return '<article class="emp22-position-card"><div class="emp22-position-head"><span>'+icon('briefcase')+'</span><div><h3>'+esc(p.name)+'</h3><small>'+staff.length+' aktívnych zamestnancov</small></div></div>'+
      '<div class="emp22-position-facts"><span><b>'+(p.trainingTypeIds||[]).length+'</b> požadovaných školení</span><span class="'+(card?'ok':'bad')+'">'+(card?'OOPP karta schválená':'OOPP karta chýba')+'</span></div>'+
      '<div class="emp22-position-states"><span class="ok">'+ok+' v poriadku</span><span class="soon">'+soon+' do 30 dní</span><span class="bad">'+bad+' riešiť</span></div>'+
      '<div class="emp-inline"><button class="emp-btn plain" onclick="emp22FilterProfession(\''+attr(p.id)+'\')">Zobraziť ľudí</button><button class="emp-link" onclick="emp22EditPosition(\''+attr(p.id)+'\')">Upraviť profesiu</button></div></article>';
  }).join('');
  var html='<div class="emp-catalog-intro"><b>Každá profesia má mať jasne určené školenia a schválenú kartu OOPP.</b><p>Počty nižšie ukazujú reálny stav aktívnych zamestnancov, nie iba nastavenie profesie.</p></div>'+
    '<div class="emp22-position-grid">'+(cards||'<div class="emp-note">Zatiaľ nie sú vytvorené profesie.</div>')+'</div>'+
    '<div class="emp-inline emp22-right"><button class="emp-btn" onclick="emp22EditPosition(\'\')">Pridať profesiu</button><button class="emp-btn" onclick="emp22Close();empOpenMatrix()">Nastaviť školenia profesií</button><button class="emp-btn primary" onclick="emp22Close();emp22OpenComplianceMatrix()">Kontrolná matica</button></div>';
  modal22('Profesie vo firme','PREHĽAD · ŠKOLENIA · OOPP',html);
};
window.emp22EditPosition=function(positionId){window.emp22Close();if(typeof window.empEditPosition==='function')window.empEditPosition(positionId||undefined)};
window.emp22FilterProfession=function(positionId){X.profession=positionId;X.activity='active';X.status='all';window.emp22Close();refresh22()};

function dateParse(value){
  var v=text(value);if(!v)return '';
  var m=v.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})$/);
  if(m){var d=Number(m[1]),mo=Number(m[2]),y=Number(m[3]),z=new Date(y,mo-1,d);if(z.getFullYear()===y&&z.getMonth()===mo-1&&z.getDate()===d)return [y,String(mo).padStart(2,'0'),String(d).padStart(2,'0')].join('-')}
  if(/^\d+(\.\d+)?$/.test(v)){var n=Number(v);if(n>20000&&n<100000){var dt=new Date(Date.UTC(1899,11,30)+Math.floor(n)*86400000);return dt.toISOString().slice(0,10)}}
  if(/^\d{4}-\d{2}-\d{2}$/.test(v))return v;
  return '';
}
function pick(row,headers,aliases){
  for(var a=0;a<aliases.length;a++){var i=headers.findIndex(function(h){return norm(h)===norm(aliases[a])});if(i>=0)return text(row[i])}
  return '';
}
function rowsToPeople(rows){
  if(!rows.length)return [];
  var h=rows[0],out=[];
  for(var i=1;i<rows.length;i++){
    var r=rows[i];if(!r||!r.some(function(v){return text(v)}))continue;
    var first=pick(r,h,['Meno','First name','FirstName']),last=pick(r,h,['Priezvisko','Surname','Last name','LastName']);
    var rawStart=pick(r,h,['Dátum nástupu','Datum nastupu','Nastup','Start date']);
    out.push({row:i+1,first:first,last:last,start:dateParse(rawStart),role:pick(r,h,['Profesia','Pozícia','Pracovná pozícia','Position']),workplace:pick(r,h,['Pracovisko','Úsek','Oddelenie']),number:pick(r,h,['Osobné číslo','Osobne cislo','ID']),error:(!first||!last)?'Chýba meno alebo priezvisko':rawStart&&!dateParse(rawStart)?'Neplatný dátum nástupu':''});
  }
  return out;
}
async function parseXlsx(file){
  if(typeof JSZip==='undefined')throw Error('XLSX čítačka nie je dostupná.');
  var zip=await JSZip.loadAsync(await file.arrayBuffer()),shared=[],parser=new DOMParser(),ss=zip.file('xl/sharedStrings.xml');
  if(ss){var sx=parser.parseFromString(await ss.async('string'),'text/xml');Array.from(sx.getElementsByTagName('si')).forEach(function(si){shared.push(Array.from(si.getElementsByTagName('t')).map(function(x){return x.textContent}).join(''))})}
  var sheet=Object.keys(zip.files).filter(function(x){return /^xl\/worksheets\/sheet\d+\.xml$/.test(x)}).sort()[0];
  if(!sheet)throw Error('Excel neobsahuje hárok s údajmi.');
  var xml=parser.parseFromString(await zip.file(sheet).async('string'),'text/xml'),rows=[];
  Array.from(xml.getElementsByTagName('row')).forEach(function(row){
    var vals=[];
    Array.from(row.getElementsByTagName('c')).forEach(function(cell){
      var ref=cell.getAttribute('r')||'',letters=(ref.match(/^[A-Z]+/)||['A'])[0],pos=0;
      for(var k=0;k<letters.length;k++)pos=pos*26+letters.charCodeAt(k)-64;
      pos--;var typ=cell.getAttribute('t'),v=(cell.getElementsByTagName('v')[0]||{}).textContent||'';
      vals[pos]=typ==='inlineStr'?Array.from(cell.getElementsByTagName('t')).map(function(x){return x.textContent}).join(''):typ==='s'?(shared[Number(v)]||''):v;
    });rows.push(vals);
  });
  return rows;
}
function parseCsv(source){
  var first=(source.split(/\r?\n/)[0]||''),delimiter=first.split(';').length>=first.split(',').length?';':',',rows=[],row=[],field='',quoted=false;
  for(var i=0;i<source.length;i++){
    var c=source[i];
    if(c==='"'){if(quoted&&source[i+1]==='"'){field+='"';i++}else quoted=!quoted}
    else if(!quoted&&c===delimiter){row.push(field);field=''}
    else if(!quoted&&(c==='\n'||c==='\r')){if(c==='\r'&&source[i+1]==='\n')i++;row.push(field);if(row.some(function(v){return text(v)}))rows.push(row);row=[];field=''}
    else field+=c;
  }
  row.push(field);if(row.some(function(v){return text(v)}))rows.push(row);return rows;
}
function matchImport(p){
  var people=companyPeople(true),matches=[];
  if(p.number)matches=people.filter(function(e){return norm(e.number)===norm(p.number)});
  else if(p.start)matches=people.filter(function(e){return norm(e.first)===norm(p.first)&&norm(e.last)===norm(p.last)&&e.start===p.start});
  if(matches.length>1)return {error:'Nejednoznačná zhoda'};
  return {employee:matches[0]||null};
}
function mergedImport(old,p){
  return {first:p.first||old.first,last:p.last||old.last,start:p.start||old.start||'',role:p.role||old.role||'',workplace:p.workplace||old.workplace||'',number:p.number||old.number||''};
}
function importChanges(old,next){
  return ['first','last','start','role','workplace','number'].filter(function(k){return text(old[k])!==text(next[k])});
}
window.emp22OpenImport=function(){
  ensure22();
  if(!X.company){alert('Najprv vyber firmu.');return}
  var html='<div class="emp-note">Import pridá nových ľudí a podľa <b>osobného čísla</b> bezpečne aktualizuje existujúcich. Ak osobné číslo chýba, zhoda sa hľadá podľa mena, priezviska a dátumu nástupu.</div>'+
    '<div class="emp-inline"><a class="emp-btn plain" href="./zamestnanci_import_sablona.xlsx" download>Stiahnuť vzorový Excel</a></div>'+
    '<label class="emp-control emp22-file">Vybrať Excel alebo CSV<input type="file" accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onchange="emp22ImportLoad(this.files[0])"></label><div id="emp22-import-result"></div>';
  modal22('Import a aktualizácia zamestnancov','FIRMA: '+companyName(X.company),html,'<button class="emp-btn" onclick="emp22Close()">Zavrieť</button><button id="emp22-import-save" class="emp-btn primary" disabled onclick="emp22ImportCommit()">Uložiť zmeny</button>');
};
window.emp22ImportLoad=async function(file){
  if(!file)return;var target=document.getElementById('emp22-import-result'),saveButton=document.getElementById('emp22-import-save');target.textContent='Načítavam súbor…';
  try{
    if(file.size>8*1024*1024)throw Error('Maximálna veľkosť súboru je 8 MB.');
    var rows=file.name.toLowerCase().endsWith('.xlsx')?await parseXlsx(file):parseCsv(await file.text());
    X.pending=rowsToPeople(rows);
    var counts={new:0,update:0,same:0,error:0};
    X.pending.forEach(function(p){
      if(p.error){p.mode='error';counts.error++;return}
      var match=matchImport(p);if(match.error){p.error=match.error;p.mode='error';counts.error++;return}
      p.matchId=match.employee&&match.employee.id;
      if(!match.employee){p.mode='new';counts.new++;return}
      p.next=mergedImport(match.employee,p);p.changes=importChanges(match.employee,p.next);
      p.mode=p.changes.length?'update':'same';counts[p.mode]++;
    });
    var preview=X.pending.slice(0,150).map(function(p){
      var result=p.mode==='new'?badge('ok','Nový'):p.mode==='update'?badge('soon','Aktualizovať: '+p.changes.join(', ')):p.mode==='same'?badge('archived','Bez zmeny'):badge('expired',p.error||'Chyba');
      return '<tr><td>'+p.row+'</td><td><b>'+esc(p.first)+' '+esc(p.last)+'</b><small class="emp22-sub">'+esc(p.number||'bez osobného čísla')+'</small></td><td>'+esc(p.role||'—')+'</td><td>'+result+'</td></tr>';
    }).join('');
    target.innerHTML='<div class="emp22-import-summary"><span><b>'+counts.new+'</b> nových</span><span><b>'+counts.update+'</b> aktualizácií</span><span><b>'+counts.same+'</b> bez zmeny</span><span><b>'+counts.error+'</b> chýb</span></div><div class="emp-previewtable"><table class="emp-table"><thead><tr><th>Riadok</th><th>Zamestnanec</th><th>Profesia</th><th>Výsledok</th></tr></thead><tbody>'+preview+'</tbody></table></div>';
    saveButton.disabled=!(counts.new+counts.update);
  }catch(err){X.pending=[];target.innerHTML='<div class="emp-note warning">Import sa nepodarilo načítať: '+esc(err.message)+'</div>';saveButton.disabled=true}
};
function ensureProfession(name){
  if(!text(name))return null;
  var p=db.professions.find(function(x){return x.companyId===X.company&&norm(x.name)===norm(name)});
  if(!p){p={id:id(),companyId:X.company,name:text(name),trainingTypeIds:[],ooppCardId:''};db.professions.push(p)}
  return p;
}
window.emp22ImportCommit=function(){
  var added=0,updated=0;
  X.pending.forEach(function(p){
    if(p.mode==='new'){
      var prof=ensureProfession(p.role),e={id:id(),companyId:X.company,first:p.first,last:p.last,start:p.start||'',role:prof?prof.name:p.role,professionId:prof?prof.id:'',workplace:p.workplace||'',number:p.number||'',active:true,created:new Date().toISOString()};
      db.employees.push(e);logChange(e.id,'Import','Nový zamestnanec');added++;
    }else if(p.mode==='update'){
      var old=db.employees.find(function(e){return e.id===p.matchId});if(!old)return;
      var next=p.next,position=ensureProfession(next.role);Object.assign(old,next,{role:position?position.name:next.role,professionId:position?position.id:old.professionId,updated:new Date().toISOString()});
      logChange(old.id,'Import','Aktualizované polia: '+p.changes.join(', '));updated++;
    }
  });
  save();X.pending=[];window.emp22Close();refresh22();alert('Import dokončený: '+added+' nových, '+updated+' aktualizovaných zamestnancov.');
};

window.emp22Export=function(){
  ensure22();
  var list=filterPeople(X.activity==='archived'?companyPeople(true).filter(function(e){return !active(e)}):companyPeople(false));
  var rows=[['Meno','Priezvisko','Osobné číslo','Profesia','Pracovisko','Stav','Otvorené úlohy']];
  list.forEach(function(e){var a=employeeAssessment(e);rows.push([e.first,e.last,e.number||'',e.role||'',e.workplace||'',stateLabel(a.state),a.reasons.map(function(r){return r.text}).join('; ')])});
  var csv='\ufeff'+rows.map(function(row){return row.map(function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"'}).join(';')}).join('\r\n');
  var blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='Zamestnanci_'+companyName(X.company).replace(/[^\p{L}\p{N}_-]+/gu,'_')+'_'+today()+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},1000);
};

window.empPage=overview22;
})();
