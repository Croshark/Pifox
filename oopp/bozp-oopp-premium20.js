(()=>{
'use strict';
const VERSION='20.4';
const entries=[];
function add(a,t,name,gear=[],props={}) { entries.push({id:`a${a}-${t}`,atlas:a,tile:t,name,gear,props}); }
// Curated from visually inspected atlas tiles. Never infer gloves/eyes from a profile.
add(1,0,'Pracovník bez ďalšej výstroje');
add(1,1,'Číre okuliare',['eyes'],{eyes:'clear'});
add(1,2,'Žltá prilba',['helmet'],{helmet:'yellow'});
add(1,3,'Žltá prilba, tmavé okuliare',['helmet','eyes'],{helmet:'yellow',eyes:'dark'});
add(1,4,'Žltá prilba, mušľové chrániče',['helmet','ears'],{helmet:'yellow',ears:'muffs'});
add(1,5,'Žltá prilba, mušľové chrániče, okuliare',['helmet','ears','eyes'],{helmet:'yellow',ears:'muffs',eyes:'clear'});
add(1,6,'Žltá prilba, FFP',['helmet','resp'],{helmet:'yellow',resp:'ffp'});
add(1,7,'Žltá prilba, polomaska',['helmet','resp'],{helmet:'yellow',resp:'half'});
add(1,8,'Žltá prilba, tvárový štít',['helmet','other-01'],{helmet:'yellow'});
add(1,9,'Reflexná vesta',['vest']);
add(1,10,'Reflexná vesta, žltá prilba',['vest','helmet'],{helmet:'yellow'});
add(1,11,'Reflexná vesta, číre okuliare',['vest','eyes'],{eyes:'clear'});
add(1,12,'Reflexná vesta, žltá prilba, mušľové chrániče',['vest','helmet','ears'],{helmet:'yellow',ears:'muffs'});
add(2,1,'Tmavé ochranné okuliare',['eyes'],{eyes:'dark'});
add(2,3,'Mechanické rukavice',['gloves'],{gloves:'mechanical'});
add(2,4,'Žlté pracovné rukavice',['gloves'],{gloves:'mechanical'});
add(2,5,'Číre okuliare, chemické rukavice',['eyes','gloves'],{eyes:'clear',gloves:'chemical'});
add(2,6,'Číre okuliare, oranžové chemické rukavice',['eyes','gloves'],{eyes:'clear',gloves:'chemical'});
add(2,7,'Číre okuliare, nitrilové rukavice',['eyes','gloves'],{eyes:'clear',gloves:'nitrile'});
add(2,8,'Číre okuliare, žlté chemické rukavice',['eyes','gloves'],{eyes:'clear',gloves:'chemical'});
add(2,9,'Gumáky',['shoes'],{shoes:'boots'});
add(2,10,'Gumáky a mechanické rukavice',['shoes','gloves'],{shoes:'boots',gloves:'mechanical'});
add(2,11,'Žltá prilba a mechanické rukavice',['helmet','gloves'],{helmet:'yellow',gloves:'mechanical'});
add(2,12,'Žltá prilba a chemické rukavice',['helmet','gloves'],{helmet:'yellow',gloves:'chemical'});
add(2,13,'Žltá prilba a žlté pracovné rukavice',['helmet','gloves'],{helmet:'yellow',gloves:'mechanical'});
add(2,14,'Reflexná vesta a mechanické rukavice',['vest','gloves'],{gloves:'mechanical'});
add(3,0,'Respirátor FFP',['resp'],{resp:'ffp'});
add(3,2,'Polomaska',['resp'],{resp:'half'});
add(3,3,'Polomaska a uzavreté okuliare',['resp','eyes'],{resp:'half',eyes:'goggles'});
add(3,4,'Žltá prilba a FFP',['helmet','resp'],{helmet:'yellow',resp:'ffp'});
add(3,6,'Žltá prilba a polomaska',['helmet','resp'],{helmet:'yellow',resp:'half'});
add(3,7,'Žltá prilba, polomaska a uzavreté okuliare',['helmet','resp','eyes'],{helmet:'yellow',resp:'half',eyes:'goggles'});
add(3,10,'Reflexná vesta a FFP',['vest','resp'],{resp:'ffp'});
add(4,0,'Žltá ochranná prilba',['helmet'],{helmet:'yellow'});
add(4,1,'Žltá prilba a číre okuliare',['helmet','eyes'],{helmet:'yellow',eyes:'clear'});
add(4,2,'Žltá prilba a tmavé okuliare',['helmet','eyes'],{helmet:'yellow',eyes:'dark'});
add(4,3,'Žltá prilba a uzavreté okuliare',['helmet','eyes'],{helmet:'yellow',eyes:'goggles'});
add(4,4,'Mušľové chrániče sluchu',['ears'],{ears:'muffs'});
add(4,5,'Žltá prilba a mušľové chrániče',['helmet','ears'],{helmet:'yellow',ears:'muffs'});
add(4,7,'Žltá prilba, tmavé okuliare a mušľové chrániče',['helmet','eyes','ears'],{helmet:'yellow',eyes:'dark',ears:'muffs'});
add(4,8,'Žltá prilba s tvárovým štítom',['helmet','other-01'],{helmet:'yellow'});
add(4,9,'Žltá prilba, štít a mušľové chrániče',['helmet','other-01','ears'],{helmet:'yellow',ears:'muffs'});
add(4,12,'Žltá prilba, mušľové chrániče a FFP',['helmet','ears','resp'],{helmet:'yellow',ears:'muffs',resp:'ffp'});
add(4,13,'Žltá prilba, mušľové chrániče a polomaska',['helmet','ears','resp'],{helmet:'yellow',ears:'muffs',resp:'half'});
add(5,0,'Reflexná vesta',['vest']);
add(5,1,'Reflexná vesta a žltá prilba',['vest','helmet'],{helmet:'yellow'});
add(5,3,'Reflexná vesta, žltá prilba a chrániče sluchu',['vest','helmet','ears'],{helmet:'yellow',ears:'muffs'});
add(5,4,'Reflexná vesta a FFP',['vest','resp'],{resp:'ffp'});
add(5,5,'Oranžový výstražný odev',['clothes'],{clothes:'hivis'});
add(5,6,'Oranžový výstražný odev a žltá prilba',['clothes','helmet'],{clothes:'hivis',helmet:'yellow'});
add(5,8,'Žltý výstražný pracovný odev',['clothes'],{clothes:'hivis'});
add(5,9,'Žltý výstražný odev a žltá prilba',['clothes','helmet'],{clothes:'hivis',helmet:'yellow'});
add(5,10,'Zateplený reflexný odev',['clothes'],{clothes:'winter'});
add(5,11,'Zateplený reflexný odev a žltá prilba',['clothes','helmet'],{clothes:'winter',helmet:'yellow'});
add(5,14,'Výstražný pracovný odev, prilba a rukavice',['clothes','helmet','gloves'],{clothes:'hivis',helmet:'yellow',gloves:'mechanical'});
add(6,0,'Tmavý pracovný overal',['clothes'],{clothes:'work'});
add(6,1,'Tmavý overal a číre okuliare',['clothes','eyes'],{clothes:'work',eyes:'clear'});
add(6,2,'Tmavý overal a žltá prilba',['clothes','helmet'],{clothes:'work',helmet:'yellow'});
add(6,3,'Tmavý overal, žltá prilba a číre okuliare',['clothes','helmet','eyes'],{clothes:'work',helmet:'yellow',eyes:'clear'});
add(6,10,'Tmavý pracovný overal a rukavice',['clothes','gloves'],{clothes:'work',gloves:'mechanical'});
add(6,15,'Tmavý pracovný overal, prilba a mušľové chrániče',['clothes','helmet','ears'],{clothes:'work',helmet:'yellow',ears:'muffs'});
add(7,0,'Biely ochranný overal',['clothes'],{clothes:'coverall'});
add(7,1,'Biely ochranný overal a nitrilové rukavice',['clothes','gloves'],{clothes:'coverall',gloves:'nitrile'});
add(7,2,'Biely ochranný overal a FFP',['clothes','resp'],{clothes:'coverall',resp:'ffp'});
add(7,3,'Biely ochranný overal a polomaska',['clothes','resp'],{clothes:'coverall',resp:'half'});
add(7,12,'Chemická zástera a chemické rukavice',['other-03','gloves'],{gloves:'chemical'});
add(7,13,'Zástera a nitrilové rukavice',['other-03','gloves'],{gloves:'nitrile'});
add(7,14,'Laboratórny plášť a nitrilové rukavice',['clothes','gloves'],{clothes:'lab',gloves:'nitrile'});
add(7,15,'Laboratórny plášť a respirátor',['clothes','resp'],{clothes:'lab',resp:'ffp'});
add(8,0,'Bezpečnostné gumáky',['shoes'],{shoes:'boots'});
add(8,1,'Bezpečnostné gumáky a žltá prilba',['shoes','helmet'],{shoes:'boots',helmet:'yellow'});
add(8,3,'Gumáky a chemické rukavice',['shoes','gloves'],{shoes:'boots',gloves:'chemical'});
add(9,0,'Zachytávací postroj',['fall']);
add(9,1,'Zachytávací postroj a žltá prilba',['fall','helmet'],{helmet:'yellow'});
add(9,2,'Zachytávací postroj a rukavice',['fall','gloves'],{gloves:'mechanical'});
add(9,3,'Zachytávací postroj, žltá prilba a rukavice',['fall','helmet','gloves'],{helmet:'yellow',gloves:'mechanical'});
add(9,6,'Postroj a reflexná vesta',['fall','vest']);
add(9,9,'Postroj, žltá prilba a okuliare',['fall','helmet','eyes'],{helmet:'yellow',eyes:'goggles'});
add(9,10,'Postroj a polomaska',['fall','resp'],{resp:'half'});
add(9,11,'Postroj, polomaska, uzavreté okuliare a slúchadlá',['fall','resp','eyes','ears'],{resp:'half',eyes:'goggles',ears:'muffs'});
add(9,15,'Postroj, žltá prilba a mušľové chrániče',['fall','helmet','ears'],{helmet:'yellow',ears:'muffs'});
add(10,0,'Zváračská zástera a rukavice',['other-03','gloves'],{gloves:'welding'});
add(10,1,'Zváračská zástera, rukavice a kukla',['other-03','gloves','other-06'],{gloves:'welding'});
add(10,2,'Zváračská zástera, rukavice a štít',['other-03','gloves','other-01'],{gloves:'welding'});
add(10,3,'Lesnícky pracovník – štít, prilba a ochrana sluchu',['helmet','ears','other-01','clothes'],{helmet:'orange',ears:'muffs',clothes:'hivis'});
add(10,4,'Hasičský zásahový odev',['clothes','helmet','gloves'],{clothes:'fire',helmet:'yellow'});
add(10,5,'Hasičský odev s dýchacou technikou',['clothes','helmet','resp','gloves'],{clothes:'fire',helmet:'yellow',resp:'scba'});
add(10,6,'Postroj a záchranársky odev',['fall','clothes','helmet'],{clothes:'work',helmet:'orange'});
add(10,7,'Laboratórny plášť a nitrilové rukavice',['clothes','gloves'],{clothes:'lab',gloves:'nitrile'});
add(10,8,'Biely overal, nitrilové rukavice a FFP',['clothes','gloves','resp'],{clothes:'coverall',gloves:'nitrile',resp:'ffp'});
add(10,9,'Zástera a chemické rukavice',['other-03','gloves'],{gloves:'chemical'});
add(10,10,'Reflexná vesta a rukavice',['vest','gloves'],{gloves:'mechanical'});
add(10,11,'Tmavý overal a rukavice',['clothes','gloves'],{clothes:'work',gloves:'mechanical'});
add(10,12,'Modrý pracovný odev a pracovné rukavice',['clothes','gloves'],{clothes:'work',gloves:'mechanical'});
add(10,13,'Výstražný pracovný odev a rukavice',['clothes','gloves'],{clothes:'hivis',gloves:'mechanical'});
add(10,14,'Biely ochranný overal a polomaska',['clothes','resp'],{clothes:'coverall',resp:'half'});
add(10,15,'Nepremokavý ochranný odev a chemické rukavice',['clothes','gloves'],{clothes:'rain',gloves:'chemical'});
// Legacy image with the right white helmet. Reused only where visually grounded.
function legacy(t,name,gear,props={}) {entries.push({id:`white-${t}`,legacyTile:t,name,gear,props});}
legacy(4,'Biela prilba',['helmet'],{helmet:'white'});
legacy(5,'Biela prilba a tmavé okuliare',['helmet','eyes'],{helmet:'white',eyes:'dark'});
legacy(6,'Biela prilba a pracovné rukavice',['helmet','gloves'],{helmet:'white',gloves:'mechanical'});
legacy(7,'Biela prilba, rukavice a tmavé okuliare',['helmet','eyes','gloves'],{helmet:'white',eyes:'dark',gloves:'mechanical'});
legacy(12,'Biela prilba a reflexná vesta',['helmet','vest'],{helmet:'white'});
legacy(13,'Biela prilba, vesta a tmavé okuliare',['helmet','vest','eyes'],{helmet:'white',eyes:'dark'});
legacy(14,'Biela prilba, vesta a rukavice',['helmet','vest','gloves'],{helmet:'white',gloves:'mechanical'});
legacy(15,'Biela prilba, vesta, rukavice a tmavé okuliare',['helmet','vest','eyes','gloves'],{helmet:'white',eyes:'dark',gloves:'mechanical'});
// Exact combinations have independent, inspectable image assets. This variant was
// assembled from visually aligned helmet+gloves and helmet+glasses atlas tiles.
entries.push({id:'exact-yellow-clear-mechanical',photo:'assets/atlas-exact/helmet-yellow-eyes-clear-gloves-mechanical.webp?v=20.4',name:'Žltá prilba, číre okuliare a mechanické rukavice',gear:['helmet','eyes','gloves'],props:{helmet:'yellow',eyes:'clear',gloves:'mechanical'},verified:true});
const PHOTOS=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,`assets/atlas-v197/atlas-${i+1}.png?v=${VERSION}`]));

// V20.4 | One deterministic 6-bit selector: never substitute a visually unrelated preset.
const OOPP64_FILE_LIST=["assets/oopp64/01_00_základná_postava.webp?v=20.4","assets/oopp64/02_01_ochranné_okuliare.webp?v=20.4","assets/oopp64/03_02_ochranné_rukavice.webp?v=20.4","assets/oopp64/04_03_ochranné_okuliare_ochranné_rukavice.webp?v=20.4","assets/oopp64/05_04_prilba.webp?v=20.4","assets/oopp64/06_05_ochranné_okuliare_prilba.webp?v=20.4","assets/oopp64/07_06_ochranné_rukavice_prilba.webp?v=20.4","assets/oopp64/08_07_ochranné_okuliare_ochranné_rukavice_prilba.webp?v=20.4","assets/oopp64/09_08_reflexná_vesta.webp?v=20.4","assets/oopp64/10_09_ochranné_okuliare_reflexná_vesta.webp?v=20.4","assets/oopp64/11_10_ochranné_rukavice_reflexná_vesta.webp?v=20.4","assets/oopp64/12_11_ochranné_okuliare_ochranné_rukavice_reflexná_vesta.webp?v=20.4","assets/oopp64/13_12_prilba_reflexná_vesta.webp?v=20.4","assets/oopp64/14_13_ochranné_okuliare_prilba_reflexná_vesta.webp?v=20.4","assets/oopp64/15_14_ochranné_rukavice_prilba_reflexná_vesta.webp?v=20.4","assets/oopp64/16_15_ochranné_okuliare_ochranné_rukavice_prilba_reflexná_vesta.webp?v=20.4","assets/oopp64/17_16_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/18_17_ochranné_okuliare_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/19_18_ochranné_rukavice_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/20_19_ochranné_okuliare_ochranné_rukavice_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/21_20_prilba_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/22_21_ochranné_okuliare_prilba_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/23_22_ochranné_rukavice_prilba_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/24_23_ochranné_okuliare_ochranné_rukavice_prilba_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/25_24_reflexná_vesta_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/26_25_ochranné_okuliare_reflexná_vesta_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/27_26_ochranné_rukavice_reflexná_vesta_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/28_27_ochranné_okuliare_ochranné_rukavice_reflexná_vesta_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/29_28_prilba_reflexná_vesta_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/30_29_ochranné_okuliare_prilba_reflexná_vesta_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/31_30_ochranné_rukavice_prilba_reflexná_vesta_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/32_31_ochranné_okuliare_ochranné_rukavice_prilba_reflexná_vesta_mušľové_chrániče_sluchu.webp?v=20.4","assets/oopp64/33_32_respirátor_ffp.webp?v=20.4","assets/oopp64/34_33_ochranné_okuliare_respirátor_ffp.webp?v=20.4","assets/oopp64/35_34_ochranné_rukavice_respirátor_ffp.webp?v=20.4","assets/oopp64/36_35_ochranné_okuliare_ochranné_rukavice_respirátor_ffp.webp?v=20.4","assets/oopp64/37_36_prilba_respirátor_ffp.webp?v=20.4","assets/oopp64/38_37_ochranné_okuliare_prilba_respirátor_ffp.webp?v=20.4","assets/oopp64/39_38_ochranné_rukavice_prilba_respirátor_ffp.webp?v=20.4","assets/oopp64/40_39_ochranné_okuliare_ochranné_rukavice_prilba_respirátor_ffp.webp?v=20.4","assets/oopp64/41_40_reflexná_vesta_respirátor_ffp.webp?v=20.4","assets/oopp64/42_41_ochranné_okuliare_reflexná_vesta_respirátor_ffp.webp?v=20.4","assets/oopp64/43_42_ochranné_rukavice_reflexná_vesta_respirátor_ffp.webp?v=20.4","assets/oopp64/44_43_ochranné_okuliare_ochranné_rukavice_reflexná_vesta_respirátor_ffp.webp?v=20.4","assets/oopp64/45_44_prilba_reflexná_vesta_respirátor_ffp.webp?v=20.4","assets/oopp64/46_45_ochranné_okuliare_prilba_reflexná_vesta_respirátor_ffp.webp?v=20.4","assets/oopp64/47_46_ochranné_rukavice_prilba_reflexná_vesta_respirátor_ffp.webp?v=20.4","assets/oopp64/48_47_ochranné_okuliare_ochranné_rukavice_prilba_reflexná_vesta_respirátor_ffp.webp?v=20.4","assets/oopp64/49_48_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/50_49_ochranné_okuliare_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/51_50_ochranné_rukavice_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/52_51_ochranné_okuliare_ochranné_rukavice_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/53_52_prilba_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/54_53_ochranné_okuliare_prilba_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/55_54_ochranné_rukavice_prilba_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/56_55_ochranné_okuliare_ochranné_rukavice_prilba_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/57_56_reflexná_vesta_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/58_57_ochranné_okuliare_reflexná_vesta_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/59_58_ochranné_rukavice_reflexná_vesta_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/60_59_ochranné_okuliare_ochranné_rukavice_reflexná_vesta_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/61_60_prilba_reflexná_vesta_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/62_61_ochranné_okuliare_prilba_reflexná_vesta_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/63_62_ochranné_rukavice_prilba_reflexná_vesta_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4","assets/oopp64/64_63_ochranné_okuliare_ochranné_rukavice_prilba_reflexná_vesta_mušľové_chrániče_sluchu_respirátor_ffp.webp?v=20.4"];
const OOPP64_BITS={eyes:1,gloves:2,helmet:4,vest:8,ears:16,resp:32};
const OOPP64_PRESENT={eyes:'clear',gloves:'mechanical',helmet:'white',vest:'reflex',ears:'muffs',resp:'ffp'};
function v203ImageEntry(mask){
 const gear=Object.keys(OOPP64_BITS).filter(id=>mask&OOPP64_BITS[id]);
 return {id:'OOPP-64-'+String(mask+1).padStart(2,'0'),photo:OOPP64_FILE_LIST[mask],name:gear.map(id=>labels[id]).join(' + ')||'Základná postava',gear,props:{...OOPP64_PRESENT},verified:false};
}
function v203Mask(items){
 let mask=0;
 for(const item of items){
   const bit=OOPP64_BITS[item.id];if(!bit)continue;
   const variant=getType(item);
   // Unsupported subtypes must NOT be shown as a different product.
   if(item.id==='ears'&&variant!=='muffs')continue;
   if(item.id==='resp'&&variant!=='ffp')continue;
   mask|=bit;
 }
 return mask;
}

const localCache=new Map();
function imageFor(url){if(!localCache.has(url)){localCache.set(url,new Promise(ok=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>ok(null);i.src=url;}));}return localCache.get(url);}
const cleanId=i=>i==='other-07'?'vest':i;
const labels={helmet:'Prilba',eyes:'Ochranné okuliare',gloves:'Rukavice',vest:'Reflexná vesta',ears:'Ochrana sluchu',resp:'Ochrana dýchacích ciest',clothes:'Ochranný / pracovný odev',shoes:'Obuv',fall:'Zachytávací postroj','other-01':'Tvárový štít','other-03':'Zástera','other-04':'Rukávniky','other-05':'Návleky','other-06':'Kukla','other-08':'Zateplená vesta'};
function details(){return (typeof activeVisualRequirements==='function'?activeVisualRequirements():[]).map(x=>({...x,id:cleanId(x.id)}));}
function getType(i){
 const p=(i.productId||'').toLowerCase(),t=(i.label||'').toLowerCase();
 switch(i.id){
 case 'helmet':return p==='helmet-01'?'white':p==='helmet-02'?'yellow':p==='helmet-03'?'orange':p==='helmet-04'?'red':p==='helmet-05'?'green':p==='helmet-08'?'yellow':'unspecified';
 case 'eyes':return /eyes-0[23]/.test(p)||/tmav|dym|zatmav/.test(t)?'dark':p==='eyes-05'?'goggles':'clear';
 case 'gloves':return p==='gloves-03'?'chemical':/gloves-0[89]/.test(p)?'nitrile':/gloves-0[45]/.test(p)?'welding':'mechanical';
 case 'ears':return p==='ears-04'?'plugs':'muffs';
 case 'resp':return p==='resp-05'?'full':/resp-0[46]/.test(p)?'half':'ffp';
 case 'clothes':return p==='clothes-02'?'hivis':p==='clothes-03'||p==='clothes-05'?'coverall':p==='clothes-04'?'welding':p==='clothes-06'?'winter':'work';
 case 'shoes':return /shoes-0[56]/.test(p)?'boots':'regular';
 default:return '';
 }
}
// Stable, exact PPE signature: sorting makes item selection order irrelevant.
function variantKey(items){
 return items.map(i=>i.id+':'+getType(i)).sort().join('|');
}
function entryKey(e){
 return e.gear.map(id=>id+':'+(e.props[id]||'')).sort().join('|');
}
function score(e,items){
 const wanted=new Set(items.map(x=>x.id)), pictured=new Set(e.gear);
 // A photograph may never contain an unselected *category*.
 if([...pictured].some(id=>!wanted.has(id)))return null;
 const missing=[],problems=[],matched=[],mismatched=[];
 for(const i of items){
  if(!pictured.has(i.id)){missing.push(i);continue;}
  const need=getType(i),actual=e.props[i.id]||'';
  if(need&&actual!==need){
   mismatched.push(i);
   problems.push(`${labels[i.id]||i.label}: fotografia ${actual?typeLabel(i.id,actual):'neoverený variant'}; vybrané ${i.label}`);
  }else matched.push(i.id);
 }
 // Required exact match: identical categories AND identical selected subtypes.
 // In particular, helmet color, glove type, and eye protection type cannot be guessed.
 const exact=missing.length===0&&mismatched.length===0&&pictured.size===wanted.size;
 const points=matched.length*100 - missing.length*65 - mismatched.length*145 +
   (e.photo?18:0)+(e.legacyTile!==undefined?0:3);
 return {entry:e,items,matched,missing,unmatched:missing,mismatched,problems,points,exact};
}
function typeLabel(id,v){return {helmet:{white:'biela',yellow:'žltá',orange:'oranžová',red:'červená',green:'zelená'},eyes:{clear:'číre',dark:'tmavé',goggles:'uzavreté'},gloves:{mechanical:'mechanické',chemical:'chemické',nitrile:'nitrilové',welding:'zváračské'},ears:{muffs:'mušľové',plugs:'zátkové'},resp:{ffp:'FFP',half:'polomaska',full:'celotvárová maska'},clothes:{hivis:'výstražný odev',work:'pracovný odev',winter:'zimný odev',coverall:'ochranný overal'},shoes:{boots:'gumáky',regular:'obuv'}}[id]?.[v]||v;}
function choose(){
 const selected=details();
 const mask=v203Mask(selected);
 const entry=v203ImageEntry(mask);
 const actual=new Set(entry.gear);
 const matched=[],missing=[],mismatched=[],problems=[];
 for(const item of selected){
    if(item.id==='shoes'){
      // Safety footwear is always a base garment in the photo. Its specified type/class
      // cannot be proved visually; do not claim verified matching.
      mismatched.push(item);
      problems.push('Pracovná obuv: typ a triedu nemožno overiť z fotografie.');
      continue;
    }
    if(!actual.has(item.id)){
      missing.push(item);continue;
    }
    const want=getType(item),shown=OOPP64_PRESENT[item.id]||'';
    if(item.id==='vest'||want===shown||!want){matched.push(item.id);continue;}
    mismatched.push(item);
    problems.push((labels[item.id]||item.id)+': obrázok zobrazuje '+typeLabel(item.id,shown)+'; vybrané '+typeLabel(item.id,want)+'.');
 }
 const exact=missing.length===0&&mismatched.length===0&&actual.size===selected.length;
 return {entry,items:selected,matched,missing,unmatched:missing,mismatched,problems,exact,
         variant:{id:entry.id},extra:[],signature:variantKey(selected),mask};
}
function h(s){return typeof esc==='function'?esc(String(s)):String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');}
function selectedLabel(i){return `${labels[i.id]||i.id}: ${i.label||i.productId||'vybrané'}`;}
function html(){
 const m=choose(), count=m.items.length;
 const state=m.exact?'zhoda':'čiastočný náhľad';
 const parts=m.items.map(i=>`<span class="pro-chip"><span class="pro-dot"></span>${h(selectedLabel(i))}</span>`).join('')||'<span class="pro-empty">Zatiaľ nebol vybraný žiadny OOPP.</span>';
 const pict=m.entry.gear.map(i=>labels[i]||i).join(' · ')||'Základná postava';
 const warning=m.unmatched.map(i=>'Na fotografii chýba: '+selectedLabel(i)).concat(m.problems);
 Promise.resolve().then(draw);
 return `<div class="pro-visual">
   <div class="pro-status"><span class="pro-kicker">OOPP · FOTOGRAFICKÝ ATLAS</span><span class="pro-match ${m.exact?'good':'partial'}"><span class="pro-status-dot"></span>${m.exact?'Presná atlasová kombinácia':'Neúplná atlasová kombinácia'}</span></div>
   <div class="pro-stage"><div class="pro-stage-halo"></div><canvas data-oopp-premium20 width="640" height="640" role="img" aria-label="${h(m.entry.name)}"></canvas><div class="pro-stage-index">${String(count).padStart(2,'0')} vybraných OOPP</div></div>
   <div class="pro-info-grid"><div class="pro-data"><small>VYBRANÉ V KARTE OOPP</small><div class="pro-chips">${parts}</div></div><div class="pro-data photo"><small>NA FOTOGRAFII JE SKUTOČNE VIDIEŤ</small><strong>${h(pict)}</strong><p>${h(m.entry.name)} · Kód: ${h(m.entry.id)} </p></div></div>
   ${warning.length?`<div class="pro-mismatch"><span class="pro-mismatch-icon">!</span><div><strong>Fotografia nie je úplná zhoda</strong><p>${warning.map(h).join(' · ')}</p></div></div>`:`<div class="pro-success"><span>✓</span> Atlasový variant zodpovedá vybraným kategóriám a typom výstroja.</div>`}
   <p class="pro-legal">Ilustračná fotografia · nie je dôkazom triedy ochrany, certifikácie, kompatibility ani správneho použitia OOPP.</p>
   </div>`;
}
const pendingPaint=new WeakMap();
async function paint(canvas,config){
 const m=(config&&config.premiumMatch)||choose();if(!canvas)return false;
 const ctx=canvas.getContext('2d');if(!ctx)return false;
 const token=Symbol('oopp-paint');pendingPaint.set(canvas,token);
 const entry=m.entry;
 const key=entry.photo||(
   entry.legacyTile!==undefined?'assets/visual/work-basic.webp?v=20.4':PHOTOS[entry.atlas]
 );
 const image=await imageFor(new URL(key,document.baseURI).href);
 // Abort an older asynchronous paint that finished after a newer selection.
 if(pendingPaint.get(canvas)!==token)return false;
 if(!canvas.isConnected && !config)return false;
 canvas.width=640;canvas.height=640;
 ctx.clearRect(0,0,640,640);
 ctx.fillStyle='#eaf1f8';ctx.fillRect(0,0,640,640);
 if(!image){ctx.fillStyle='#375778';ctx.font='20px sans-serif';ctx.fillText('Obrázok nie je dostupný',150,300);return false;}
 if(entry.photo){
  const sw=image.naturalWidth,sh=image.naturalHeight;
  ctx.drawImage(image,0,0,sw,sh,14,14,612,612);
 }else{
  const cols=4;
  const native=entry.legacyTile!==undefined?512:image.naturalWidth/4;
  const tile=entry.tile??entry.legacyTile;
  const sx=(tile%cols)*native,sy=Math.floor(tile/cols)*native;
  const inset=2;
  ctx.drawImage(image,sx+inset,sy+inset,native-inset*2,native-inset*2,14,14,612,612);
 }
 return true;
}
function draw(){document.querySelectorAll('canvas[data-oopp-premium20]').forEach(c=>paint(c));}
function info(){const m=choose();return {labels:m.entry.gear.map(i=>labels[i]||i),other:m.unmatched,atlasMatch:m,premiumMatch:m};}
window.bozpExactVisualHTML=html;
window.bozpExactVisualConfig=info;
window.bozpV192Paint=paint;
window.bozpV192DrawVisible=draw;
window.bozpPremiumDebug=()=>choose();
window.bozpPremiumVariantKey=variantKey;
if(typeof render==='function')render();
})();
