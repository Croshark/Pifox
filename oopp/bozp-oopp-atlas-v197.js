(()=>{
'use strict';
const ATLAS_FILES={
  1:'assets/atlas-v197/atlas-1.png?v=19.9',
  2:'assets/atlas-v197/atlas-2.png?v=19.9',
  3:'assets/atlas-v197/atlas-3.png?v=19.9',
  4:'assets/atlas-v197/atlas-4.png?v=19.9',
  5:'assets/atlas-v197/atlas-5.png?v=19.9',
  6:'assets/atlas-v197/atlas-6.png?v=19.9',
  7:'assets/atlas-v197/atlas-7.png?v=19.9',
  8:'assets/atlas-v197/atlas-8.png?v=19.9',
  9:'assets/atlas-v197/atlas-9.png?v=19.9',
 10:'assets/atlas-v197/atlas-10.png?v=19.9'
};
const PRESETS=[
  {id:'a1-0',atlas:1,tile:0,label:'Základná postava',gear:[],traits:[]},
  {id:'a1-1',atlas:1,tile:1,label:'Ochranné okuliare',gear:['eyes'],traits:['eyes-clear']},
  {id:'a1-2',atlas:1,tile:2,label:'Prilba',gear:['helmet'],traits:[]},
  {id:'a1-3',atlas:1,tile:3,label:'Prilba a tmavé ochranné okuliare',gear:['helmet','eyes'],traits:['eyes-dark']},
  {id:'a1-4',atlas:1,tile:4,label:'Prilba a mušľové chrániče sluchu',gear:['helmet','ears'],traits:['ears-muffs']},
  {id:'a1-6',atlas:1,tile:6,label:'Prilba a respirátor FFP',gear:['helmet','resp'],traits:['resp-ffp']},
  {id:'a1-7',atlas:1,tile:7,label:'Prilba a polomaska',gear:['helmet','resp'],traits:['resp-half']},
  {id:'a1-8',atlas:1,tile:8,label:'Prilba s tvárovým štítom',gear:['helmet','other-01'],traits:['face-shield']},
  {id:'a1-9',atlas:1,tile:9,label:'Reflexná vesta',gear:['vest'],traits:['vest']},
  {id:'a1-10',atlas:1,tile:10,label:'Reflexná vesta a prilba',gear:['vest','helmet'],traits:['vest']},
  {id:'a1-11',atlas:1,tile:11,label:'Reflexná vesta a okuliare',gear:['vest','eyes'],traits:['vest','eyes-clear']},
  {id:'a1-12',atlas:1,tile:12,label:'Reflexná vesta, prilba a mušľové chrániče sluchu',gear:['vest','helmet','ears'],traits:['vest','ears-muffs']},
  {id:'a1-13',atlas:1,tile:13,label:'Pracovný overal',gear:['clothes'],traits:['coverall-dark']},
  {id:'a1-14',atlas:1,tile:14,label:'Pracovný overal a prilba',gear:['clothes','helmet'],traits:['coverall-dark']},
  {id:'a1-15',atlas:1,tile:15,label:'Pracovný overal, prilba a okuliare',gear:['clothes','helmet','eyes'],traits:['coverall-dark','eyes-clear']},

  {id:'a2-3',atlas:2,tile:3,label:'Okuliare a pracovné rukavice',gear:['eyes','gloves'],traits:['eyes-clear','gloves-basic']},
  {id:'a2-4',atlas:2,tile:4,label:'Okuliare a žlté pracovné rukavice',gear:['eyes','gloves'],traits:['eyes-clear','gloves-basic']},
  {id:'a2-5',atlas:2,tile:5,label:'Okuliare a chemické rukavice',gear:['eyes','gloves'],traits:['eyes-clear','chem-gloves']},
  {id:'a2-6',atlas:2,tile:6,label:'Okuliare a dlhé chemické rukavice',gear:['eyes','gloves'],traits:['eyes-clear','chem-gloves']},
  {id:'a2-7',atlas:2,tile:7,label:'Okuliare a nitrilové rukavice',gear:['eyes','gloves'],traits:['eyes-clear','nitrile-gloves']},
  {id:'a2-8',atlas:2,tile:8,label:'Okuliare a žlté chemické rukavice',gear:['eyes','gloves'],traits:['eyes-clear','chem-gloves']},
  {id:'a2-9',atlas:2,tile:9,label:'Gumáky',gear:['shoes'],traits:['boots']},
  {id:'a2-10',atlas:2,tile:10,label:'Gumáky a rukavice',gear:['shoes','gloves'],traits:['boots','gloves-basic']},
  {id:'a2-11',atlas:2,tile:11,label:'Prilba a rukavice',gear:['helmet','gloves'],traits:['gloves-basic']},
  {id:'a2-12',atlas:2,tile:12,label:'Prilba a chemické rukavice',gear:['helmet','gloves'],traits:['chem-gloves']},
  {id:'a2-13',atlas:2,tile:13,label:'Prilba a pracovné rukavice',gear:['helmet','gloves'],traits:['gloves-basic']},
  {id:'a2-14',atlas:2,tile:14,label:'Reflexná vesta a rukavice',gear:['vest','gloves'],traits:['vest','gloves-basic']},
  {id:'a2-15',atlas:2,tile:15,label:'Pracovný overal, okuliare a rukavice',gear:['clothes','eyes','gloves'],traits:['coverall-dark','eyes-clear','gloves-basic']},

  {id:'a3-0',atlas:3,tile:0,label:'Respirátor FFP',gear:['resp'],traits:['resp-ffp']},
  {id:'a3-2',atlas:3,tile:2,label:'Polomaska',gear:['resp'],traits:['resp-half']},
  {id:'a3-3',atlas:3,tile:3,label:'Polomaska a uzavreté okuliare',gear:['resp','eyes'],traits:['resp-half','eyes-goggles']},
  {id:'a3-4',atlas:3,tile:4,label:'Prilba a respirátor FFP',gear:['helmet','resp'],traits:['resp-ffp']},
  {id:'a3-6',atlas:3,tile:6,label:'Prilba a polomaska',gear:['helmet','resp'],traits:['resp-half']},
  {id:'a3-7',atlas:3,tile:7,label:'Prilba, polomaska a uzavreté okuliare',gear:['helmet','resp','eyes'],traits:['resp-half','eyes-goggles']},
  {id:'a3-8',atlas:3,tile:8,label:'Okuliare a respirátor FFP',gear:['eyes','resp'],traits:['eyes-clear','resp-ffp']},
  {id:'a3-9',atlas:3,tile:9,label:'Uzavreté okuliare a polomaska',gear:['eyes','resp'],traits:['eyes-goggles','resp-half']},
  {id:'a3-10',atlas:3,tile:10,label:'Reflexná vesta a respirátor FFP',gear:['vest','resp'],traits:['vest','resp-ffp']},
  {id:'a3-11',atlas:3,tile:11,label:'Pracovný overal a polomaska',gear:['clothes','resp'],traits:['coverall-dark','resp-half']},
  {id:'a3-12',atlas:3,tile:12,label:'Biely ochranný overal a polomaska',gear:['clothes','resp'],traits:['coverall','resp-half']},
  {id:'a3-13',atlas:3,tile:13,label:'Modrý ochranný overal a polomaska',gear:['clothes','resp'],traits:['coverall','resp-half']},
  {id:'a3-14',atlas:3,tile:14,label:'Oranžový ochranný overal a polomaska',gear:['clothes','resp'],traits:['coverall','resp-half']},
  {id:'a3-15',atlas:3,tile:15,label:'Zelený ochranný overal a polomaska',gear:['clothes','resp'],traits:['coverall','resp-half']},

  {id:'a4-0',atlas:4,tile:0,label:'Prilba',gear:['helmet'],traits:[]},
  {id:'a4-1',atlas:4,tile:1,label:'Prilba a číre okuliare',gear:['helmet','eyes'],traits:['eyes-clear']},
  {id:'a4-2',atlas:4,tile:2,label:'Prilba a tmavé okuliare',gear:['helmet','eyes'],traits:['eyes-dark']},
  {id:'a4-3',atlas:4,tile:3,label:'Prilba a uzavreté okuliare',gear:['helmet','eyes'],traits:['eyes-goggles']},
  {id:'a4-4',atlas:4,tile:4,label:'Mušľové chrániče sluchu',gear:['ears'],traits:['ears-muffs']},
  {id:'a4-5',atlas:4,tile:5,label:'Prilba a mušľové chrániče sluchu',gear:['helmet','ears'],traits:['ears-muffs']},
  {id:'a4-7',atlas:4,tile:7,label:'Prilba, tmavé okuliare a mušľové chrániče sluchu',gear:['helmet','eyes','ears'],traits:['eyes-dark','ears-muffs']},
  {id:'a4-8',atlas:4,tile:8,label:'Prilba s tvárovým štítom',gear:['helmet','other-01'],traits:['face-shield']},
  {id:'a4-9',atlas:4,tile:9,label:'Prilba, tvárový štít a mušľové chrániče sluchu',gear:['helmet','other-01','ears'],traits:['face-shield','ears-muffs']},
  {id:'a4-12',atlas:4,tile:12,label:'Prilba, mušľové chrániče sluchu a respirátor FFP',gear:['helmet','ears','resp'],traits:['ears-muffs','resp-ffp']},
  {id:'a4-13',atlas:4,tile:13,label:'Prilba, mušľové chrániče sluchu a polomaska',gear:['helmet','ears','resp'],traits:['ears-muffs','resp-half']},
  {id:'a4-14',atlas:4,tile:14,label:'Reflexná vesta a prilba',gear:['vest','helmet'],traits:['vest']},
  {id:'a4-15',atlas:4,tile:15,label:'Pracovný overal, prilba a okuliare',gear:['clothes','helmet','eyes'],traits:['coverall-dark','eyes-clear']},

  {id:'a5-0',atlas:5,tile:0,label:'Reflexná vesta',gear:['vest'],traits:['vest']},
  {id:'a5-1',atlas:5,tile:1,label:'Reflexná vesta a prilba',gear:['vest','helmet'],traits:['vest']},
  {id:'a5-2',atlas:5,tile:2,label:'Reflexná vesta, prilba a okuliare',gear:['vest','helmet','eyes'],traits:['vest','eyes-clear']},
  {id:'a5-3',atlas:5,tile:3,label:'Reflexná vesta, prilba a mušľové chrániče sluchu',gear:['vest','helmet','ears'],traits:['vest','ears-muffs']},
  {id:'a5-4',atlas:5,tile:4,label:'Reflexná vesta a respirátor FFP',gear:['vest','resp'],traits:['vest','resp-ffp']},
  {id:'a5-5',atlas:5,tile:5,label:'Oranžový výstražný odev',gear:['clothes','vest'],traits:['hi-vis']},
  {id:'a5-6',atlas:5,tile:6,label:'Oranžový výstražný odev a prilba',gear:['clothes','vest','helmet'],traits:['hi-vis']},
  {id:'a5-8',atlas:5,tile:8,label:'Žltý výstražný odev',gear:['clothes','vest'],traits:['hi-vis']},
  {id:'a5-9',atlas:5,tile:9,label:'Žltý výstražný odev a prilba',gear:['clothes','vest','helmet'],traits:['hi-vis']},
  {id:'a5-10',atlas:5,tile:10,label:'Žltý zimný výstražný odev',gear:['clothes','vest'],traits:['hi-vis','winter']},
  {id:'a5-11',atlas:5,tile:11,label:'Žltý zimný výstražný odev a prilba',gear:['clothes','vest','helmet'],traits:['hi-vis','winter']},
  {id:'a5-12',atlas:5,tile:12,label:'Modro-oranžový výstražný odev',gear:['clothes','vest'],traits:['hi-vis']},
  {id:'a5-13',atlas:5,tile:13,label:'Modro-oranžový výstražný odev a prilba',gear:['clothes','vest','helmet'],traits:['hi-vis']},
  {id:'a5-14',atlas:5,tile:14,label:'Modro-oranžový výstražný odev, prilba a rukavice',gear:['clothes','vest','helmet','gloves'],traits:['hi-vis','gloves-basic']},
  {id:'a5-15',atlas:5,tile:15,label:'Modro-oranžový výstražný odev a respirátor FFP',gear:['clothes','vest','resp'],traits:['hi-vis','resp-ffp']},

  {id:'a6-0',atlas:6,tile:0,label:'Tmavý pracovný overal',gear:['clothes'],traits:['coverall-dark']},
  {id:'a6-1',atlas:6,tile:1,label:'Tmavý pracovný overal a okuliare',gear:['clothes','eyes'],traits:['coverall-dark','eyes-clear']},
  {id:'a6-2',atlas:6,tile:2,label:'Tmavý pracovný overal a prilba',gear:['clothes','helmet'],traits:['coverall-dark']},
  {id:'a6-3',atlas:6,tile:3,label:'Tmavý pracovný overal, prilba a okuliare',gear:['clothes','helmet','eyes'],traits:['coverall-dark','eyes-clear']},
  {id:'a6-4',atlas:6,tile:4,label:'Modrý pracovný overal',gear:['clothes'],traits:['coverall-blue']},
  {id:'a6-5',atlas:6,tile:5,label:'Modrý pracovný overal a okuliare',gear:['clothes','eyes'],traits:['coverall-blue','eyes-clear']},
  {id:'a6-6',atlas:6,tile:6,label:'Modrý pracovný overal a prilba',gear:['clothes','helmet'],traits:['coverall-blue']},
  {id:'a6-7',atlas:6,tile:7,label:'Modrý pracovný overal, prilba a rukavice',gear:['clothes','helmet','gloves'],traits:['coverall-blue','gloves-basic']},
  {id:'a6-8',atlas:6,tile:8,label:'Modrý zimný pracovný odev',gear:['clothes'],traits:['winter']},
  {id:'a6-9',atlas:6,tile:9,label:'Tmavý zimný pracovný odev',gear:['clothes'],traits:['winter']},
  {id:'a6-10',atlas:6,tile:10,label:'Tmavý pracovný overal a rukavice',gear:['clothes','gloves'],traits:['coverall-dark','gloves-basic']},
  {id:'a6-11',atlas:6,tile:11,label:'Modrý pracovný overal a rukavice',gear:['clothes','gloves'],traits:['coverall-blue','gloves-basic']},
  {id:'a6-12',atlas:6,tile:12,label:'Reflexná vesta na tmavom pracovnom odeve',gear:['clothes','vest'],traits:['vest','coverall-dark']},
  {id:'a6-13',atlas:6,tile:13,label:'Modro-oranžový výstražný odev',gear:['clothes','vest'],traits:['hi-vis']},
  {id:'a6-14',atlas:6,tile:14,label:'Tmavý pracovný odev a gumáky',gear:['clothes','shoes'],traits:['coverall-dark','boots']},
  {id:'a6-15',atlas:6,tile:15,label:'Tmavý pracovný overal, prilba a mušľové chrániče sluchu',gear:['clothes','helmet','ears'],traits:['coverall-dark','ears-muffs']},

  {id:'a7-0',atlas:7,tile:0,label:'Biely ochranný overal',gear:['clothes'],traits:['coverall']},
  {id:'a7-1',atlas:7,tile:1,label:'Biely ochranný overal a nitrilové rukavice',gear:['clothes','gloves'],traits:['coverall','nitrile-gloves']},
  {id:'a7-2',atlas:7,tile:2,label:'Biely ochranný overal a respirátor FFP',gear:['clothes','resp'],traits:['coverall','resp-ffp']},
  {id:'a7-3',atlas:7,tile:3,label:'Biely ochranný overal, polomaska a uzavreté okuliare',gear:['clothes','resp','eyes'],traits:['coverall','resp-half','eyes-goggles']},
  {id:'a7-4',atlas:7,tile:4,label:'Modrý ochranný overal',gear:['clothes'],traits:['coverall']},
  {id:'a7-5',atlas:7,tile:5,label:'Modrý ochranný overal a polomaska',gear:['clothes','resp'],traits:['coverall','resp-half']},
  {id:'a7-6',atlas:7,tile:6,label:'Žltý ochranný overal',gear:['clothes'],traits:['coverall']},
  {id:'a7-7',atlas:7,tile:7,label:'Žltý ochranný overal a polomaska',gear:['clothes','resp'],traits:['coverall','resp-half']},
  {id:'a7-8',atlas:7,tile:8,label:'Oranžový ochranný overal',gear:['clothes'],traits:['coverall']},
  {id:'a7-9',atlas:7,tile:9,label:'Oranžový ochranný overal a polomaska',gear:['clothes','resp'],traits:['coverall','resp-half']},
  {id:'a7-10',atlas:7,tile:10,label:'Zelený nepremokavý odev',gear:['clothes'],traits:['waterproof']},
  {id:'a7-11',atlas:7,tile:11,label:'Zelený nepremokavý odev a polomaska',gear:['clothes','resp'],traits:['waterproof','resp-half']},
  {id:'a7-12',atlas:7,tile:12,label:'Chemická zástera a dlhé chemické rukavice',gear:['other-03','gloves'],traits:['apron','chem-gloves']},
  {id:'a7-13',atlas:7,tile:13,label:'Modrá zástera a nitrilové rukavice',gear:['other-03','gloves'],traits:['apron','nitrile-gloves']},
  {id:'a7-14',atlas:7,tile:14,label:'Laboratórny plášť a nitrilové rukavice',gear:['clothes','gloves'],traits:['lab','nitrile-gloves','coat']},
  {id:'a7-15',atlas:7,tile:15,label:'Laboratórny plášť a respirátor FFP',gear:['clothes','resp'],traits:['lab','resp-ffp','coat']},

  {id:'a8-0',atlas:8,tile:0,label:'Gumáky',gear:['shoes'],traits:['boots']},
  {id:'a8-1',atlas:8,tile:1,label:'Gumáky a prilba',gear:['shoes','helmet'],traits:['boots']},
  {id:'a8-2',atlas:8,tile:2,label:'Gumáky a okuliare',gear:['shoes','eyes'],traits:['boots','eyes-clear']},
  {id:'a8-3',atlas:8,tile:3,label:'Gumáky a chemické rukavice',gear:['shoes','gloves'],traits:['boots','chem-gloves']},
  {id:'a8-4',atlas:8,tile:4,label:'Žltý nepremokavý odev a gumáky',gear:['clothes','shoes'],traits:['waterproof','boots']},
  {id:'a8-5',atlas:8,tile:5,label:'Žltý nepremokavý odev, gumáky a prilba',gear:['clothes','shoes','helmet'],traits:['waterproof','boots']},
  {id:'a8-6',atlas:8,tile:6,label:'Zelený nepremokavý odev a gumáky',gear:['clothes','shoes'],traits:['waterproof','boots']},
  {id:'a8-7',atlas:8,tile:7,label:'Zelený nepremokavý odev, gumáky a prilba',gear:['clothes','shoes','helmet'],traits:['waterproof','boots']},
  {id:'a8-8',atlas:8,tile:8,label:'Modrý zimný odev a gumáky',gear:['clothes','shoes'],traits:['winter','boots']},
  {id:'a8-9',atlas:8,tile:9,label:'Modrý zimný odev, gumáky a prilba',gear:['clothes','shoes','helmet'],traits:['winter','boots']},
  {id:'a8-10',atlas:8,tile:10,label:'Tmavý zimný odev a gumáky',gear:['clothes','shoes'],traits:['winter','boots']},
  {id:'a8-11',atlas:8,tile:11,label:'Tmavý zimný odev, gumáky a prilba',gear:['clothes','shoes','helmet'],traits:['winter','boots']},
  {id:'a8-12',atlas:8,tile:12,label:'Žltý zimný výstražný odev a gumáky',gear:['clothes','vest','shoes'],traits:['winter','hi-vis','boots']},
  {id:'a8-13',atlas:8,tile:13,label:'Žltý zimný výstražný odev, gumáky a prilba',gear:['clothes','vest','shoes','helmet'],traits:['winter','hi-vis','boots']},
  {id:'a8-14',atlas:8,tile:14,label:'Oranžový zimný výstražný odev a gumáky',gear:['clothes','vest','shoes'],traits:['winter','hi-vis','boots']},
  {id:'a8-15',atlas:8,tile:15,label:'Oranžový zimný výstražný odev, gumáky a prilba',gear:['clothes','vest','shoes','helmet'],traits:['winter','hi-vis','boots']},

  {id:'a9-0',atlas:9,tile:0,label:'Zachytávací postroj',gear:['fall'],traits:['fall']},
  {id:'a9-1',atlas:9,tile:1,label:'Zachytávací postroj a prilba',gear:['fall','helmet'],traits:['fall']},
  {id:'a9-2',atlas:9,tile:2,label:'Zachytávací postroj a rukavice',gear:['fall','gloves'],traits:['fall','gloves-basic']},
  {id:'a9-3',atlas:9,tile:3,label:'Zachytávací postroj, prilba a rukavice',gear:['fall','helmet','gloves'],traits:['fall','gloves-basic']},
  {id:'a9-4',atlas:9,tile:4,label:'Postroj s lanom',gear:['fall'],traits:['fall']},
  {id:'a9-5',atlas:9,tile:5,label:'Postroj s lanom a prilba',gear:['fall','helmet'],traits:['fall']},
  {id:'a9-6',atlas:9,tile:6,label:'Postroj s reflexnou vestou',gear:['fall','vest'],traits:['fall','vest']},
  {id:'a9-7',atlas:9,tile:7,label:'Postroj a výstražný oranžový odev',gear:['fall','clothes','vest'],traits:['fall','hi-vis']},
  {id:'a9-8',atlas:9,tile:8,label:'Výškový pracovník s výstrojom',gear:['fall'],traits:['fall']},
  {id:'a9-9',atlas:9,tile:9,label:'Výškový pracovník s prilbou a okuliarmi',gear:['fall','helmet','eyes'],traits:['fall','eyes-clear']},
  {id:'a9-10',atlas:9,tile:10,label:'Postroj a polomaska',gear:['fall','resp'],traits:['fall','resp-half']},
  {id:'a9-11',atlas:9,tile:11,label:'Postroj, polomaska a uzavreté okuliare',gear:['fall','resp','eyes'],traits:['fall','resp-half','eyes-goggles']},
  {id:'a9-12',atlas:9,tile:12,label:'Postroj a záchranársky oranžový odev',gear:['fall','clothes'],traits:['fall']},
  {id:'a9-13',atlas:9,tile:13,label:'Postroj, pracovný overal a prilba',gear:['fall','clothes','helmet'],traits:['fall','coverall-dark']},
  {id:'a9-14',atlas:9,tile:14,label:'Postroj, tvárový štít a prilba',gear:['fall','helmet','other-01'],traits:['fall','face-shield']},
  {id:'a9-15',atlas:9,tile:15,label:'Postroj, prilba a mušľové chrániče sluchu',gear:['fall','helmet','ears'],traits:['fall','ears-muffs']},

  {id:'a10-0',atlas:10,tile:0,label:'Zváračská zástera, kukla v ruke',gear:['other-03','gloves'],traits:['welder','apron','heat-gloves']},
  {id:'a10-1',atlas:10,tile:1,label:'Zváračská kukla a zástera',gear:['other-03','helmet'],traits:['welder','apron']},
  {id:'a10-2',atlas:10,tile:2,label:'Zváračská zástera, štít a zváračské rukavice',gear:['other-03','other-01','gloves','helmet'],traits:['welder','apron','heat-gloves','face-shield']},
  {id:'a10-3',atlas:10,tile:3,label:'Lesnícky pracovník',gear:['helmet','ears','other-01','clothes'],traits:['forestry']},
  {id:'a10-4',atlas:10,tile:4,label:'Hasič – zásahový odev',gear:['clothes','helmet','gloves'],traits:['fire']},
  {id:'a10-5',atlas:10,tile:5,label:'Hasič – dýchacia technika',gear:['clothes','helmet','resp'],traits:['fire','resp-half']},
  {id:'a10-6',atlas:10,tile:6,label:'Záchranár / špeciálny pracovník vo výškach',gear:['fall','clothes','helmet'],traits:['fall']},
  {id:'a10-7',atlas:10,tile:7,label:'Laborant v plášti a rukaviciach',gear:['clothes','gloves'],traits:['lab','nitrile-gloves','coat']},
  {id:'a10-8',atlas:10,tile:8,label:'Biely ochranný overal, respirátor FFP a rukavice',gear:['clothes','resp','gloves'],traits:['coverall','resp-ffp','nitrile-gloves']},
  {id:'a10-9',atlas:10,tile:9,label:'Chemická zástera a dlhé chemické rukavice',gear:['other-03','gloves'],traits:['apron','chem-gloves']},
  {id:'a10-10',atlas:10,tile:10,label:'Reflexná vesta a rukavice',gear:['vest','gloves'],traits:['vest','gloves-basic']},
  {id:'a10-11',atlas:10,tile:11,label:'Pracovný overal a rukavice',gear:['clothes','gloves'],traits:['coverall-dark','gloves-basic']},
  {id:'a10-12',atlas:10,tile:12,label:'Elektrikár / údržbár s náradím',gear:['clothes','gloves','eyes'],traits:['coverall-blue','gloves-basic','eyes-clear']},
  {id:'a10-13',atlas:10,tile:13,label:'Modro-oranžový pracovný odev a rukavice',gear:['clothes','vest','gloves'],traits:['hi-vis','gloves-basic']},
  {id:'a10-14',atlas:10,tile:14,label:'Biely ochranný overal a polomaska',gear:['clothes','resp'],traits:['coverall','resp-half']},
  {id:'a10-15',atlas:10,tile:15,label:'Zelený nepremokavý odev a chemické rukavice',gear:['clothes','gloves'],traits:['waterproof','chem-gloves']}
];
const WEIGHTS={eyes:58,resp:52,fall:56,helmet:34,gloves:45,ears:40,vest:28,clothes:24,shoes:10,'other-01':18,'other-03':25,'other-04':16,'other-05':16,'other-06':16,'other-07':28,'other-08':14};
const SPECIAL_KEYS={
  welder:/zvár|welder/i,
  fire:/hasič|požiarn|zásah/i,
  forestry:/lesn|píl|pilč/i,
  lab:/labor|lab/i
};
const imageCache=new Map();
function loadImg(url){
  if(!imageCache.has(url))imageCache.set(url,new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=url;}));
  return imageCache.get(url);
}
function unique(arr){return [...new Set(arr)]}
function hasSelected(items,id){return items.some(i=>i.id===id||(id==='vest'&&i.id==='other-07')||(id==='other-07'&&i.id==='vest'))}
function catalogName(id){return (catalog.find(p=>p.id===id)?.name)||id}
function jobText(){return ((s.job==='Iná profesia'?(s.customJob||''):s.job||'')+' '+(s.workplace||'')).toLowerCase()}
function selectedClothesText(items){const c=items.find(i=>i.id==='clothes');return ((c?.label||'')+' '+(c?.productId||'')+' '+(c?.type||'')).toLowerCase()}
function selectedRespTrait(item){if(!item)return '';const text=((item.label||'')+' '+(item.productId||'')).toLowerCase();if(/polomask|resp-0[46]|filtr/.test(text))return 'resp-half';return 'resp-ffp'}
function selectedEyesTrait(item){if(!item)return 'eyes-clear';const text=((item.label||'')+' '+(item.productId||'')).toLowerCase();if(/uzavret|goggle/.test(text)||item.productId==='eyes-05')return 'eyes-goggles';if(/tmav|tint|dark|slneč/.test(text))return 'eyes-dark';return 'eyes-clear'}
function selectedGlovesTrait(item){if(!item)return 'gloves-basic';const text=((item.label||'')+' '+(item.productId||'')+' '+(item.type||'')).toLowerCase();if(/374|chem|kysel|butyl|nitril. dl|neopren/.test(text)||item.productId==='gloves-03')return 'chem-gloves';if(/nitril|jednoraz|latex/.test(text)||item.productId==='gloves-08'||item.productId==='gloves-09')return 'nitrile-gloves';if(/zvára|tepel|hot|heat/.test(text)||item.productId==='gloves-04'||item.productId==='gloves-05')return 'heat-gloves';return 'gloves-basic'}
function selectedEarsTrait(item){if(!item)return '';const text=((item.label||'')+' '+(item.productId||'')).toLowerCase();return /zátkov|earplug/.test(text)?'ears-plugs':'ears-muffs'}
function selectedShoesTrait(item){if(!item)return '';const text=((item.label||'')+' '+(item.productId||'')+' '+(item.type||'')).toLowerCase();return /gum|s4|s5|s6|s7|boots/.test(text)||item.productId==='shoes-05'||item.productId==='shoes-06'?'boots':''}
function selectedOtherTraits(items){
  const role=jobText(), ctext=selectedClothesText(items);
  return {
    wantWinter:/zimn|winter|zatepl/.test(ctext),
    wantWaterproof:/nepremok|waterproof|rain|dažď/.test(ctext),
    wantCoverall:/overal|jednoraz|chemick|tyvek/.test(ctext),
    wantHiVis:hasSelected(items,'vest')||hasSelected(items,'other-07')||/reflex|výstra|hi-vis/.test(ctext),
    wantApron:hasSelected(items,'other-03')||/zástera/.test(ctext),
    wantWelder:SPECIAL_KEYS.welder.test(role),
    wantFire:SPECIAL_KEYS.fire.test(role),
    wantForestry:SPECIAL_KEYS.forestry.test(role),
    wantLab:SPECIAL_KEYS.lab.test(role)||/plášť/.test(ctext)
  }
}
function covers(preset,item){
  if(preset.gear.includes(item.id))return true;
  if(item.id==='vest'&&preset.gear.includes('other-07'))return true;
  if(item.id==='other-07'&&preset.gear.includes('vest'))return true;
  if(item.id==='shoes')return selectedShoesTrait(item)==='boots'?preset.traits.includes('boots'):true;
  return false;
}
function variantPenalty(preset,item){
  if(item.id==='resp'){
    const need=selectedRespTrait(item);return preset.traits.includes(need)?0:(need==='resp-half'&&preset.gear.includes('resp')?16:(need==='resp-ffp'&&preset.gear.includes('resp')?10:0));
  }
  if(item.id==='eyes'){
    const need=selectedEyesTrait(item);if(preset.traits.includes(need))return 0;if(preset.gear.includes('eyes'))return need==='eyes-goggles'?14:8;return 0;
  }
  if(item.id==='gloves'){
    const need=selectedGlovesTrait(item);if(preset.traits.includes(need))return 0;if(preset.gear.includes('gloves'))return need==='chem-gloves'||need==='heat-gloves'||need==='nitrile-gloves'?16:5;return 0;
  }
  if(item.id==='ears'){
    const need=selectedEarsTrait(item);if(need==='ears-plugs'&&preset.gear.includes('ears'))return 18;if(need==='ears-muffs'&&preset.gear.includes('ears'))return 0;
  }
  if(item.id==='shoes'){
    const need=selectedShoesTrait(item);if(need==='boots'&&!preset.traits.includes('boots'))return 20;
  }
  return 0;
}
function contextPenalty(preset,items){
  const wants=selectedOtherTraits(items);let p=0;
  const tr=preset.traits||[], g=preset.gear||[];
  if(g.includes('helmet')&&!hasSelected(items,'helmet'))p+=10;
  if(g.includes('eyes')&&!hasSelected(items,'eyes'))p+=10;
  if(g.includes('ears')&&!hasSelected(items,'ears'))p+=12;
  if(g.includes('resp')&&!hasSelected(items,'resp'))p+=13;
  if(g.includes('gloves')&&!hasSelected(items,'gloves'))p+=12;
  if(g.includes('fall')&&!hasSelected(items,'fall'))p+=30;
  if((g.includes('vest')||g.includes('other-07'))&&!wants.wantHiVis&&!hasSelected(items,'vest')&&!hasSelected(items,'other-07'))p+=18;
  if(g.includes('other-03')&&!wants.wantApron)p+=20;
  if(g.includes('other-01')&&!hasSelected(items,'other-01')&&!hasSelected(items,'eyes'))p+=8;
  if(tr.includes('winter')&&!wants.wantWinter)p+=18;
  if(tr.includes('waterproof')&&!wants.wantWaterproof)p+=18;
  if(tr.includes('coverall')&&!wants.wantCoverall&&!wants.wantLab&&!wants.wantFire)p+=15;
  if(tr.includes('hi-vis')&&!wants.wantHiVis&&!wants.wantWinter)p+=12;
  if(tr.includes('apron')&&!wants.wantApron&&!wants.wantWelder)p+=16;
  if(tr.includes('welder')&&!wants.wantWelder)p+=28;
  if(tr.includes('fire')&&!wants.wantFire)p+=28;
  if(tr.includes('forestry')&&!wants.wantForestry)p+=28;
  if(tr.includes('lab')&&!wants.wantLab&&!wants.wantCoverall)p+=20;
  return p;
}
function shownNamesForMatch(match){
  const names=match.covered.map(i=>i.label||catalogName(i.id));
  if(hasSelected(match.covered,'vest')&&!names.some(n=>/vesta/i.test(n)))names.push('Reflexná vesta');
  if(match.selected){
    for(const item of match.selected){
      if(['other-04','other-05','other-06','other-08'].includes(item.id) && !names.includes(item.label||catalogName(item.id))) names.push(item.label||catalogName(item.id));
    }
  }
  return unique(names);
}
function pickMatch(){
  const items=activeVisualRequirements();
  let best=null;
  // V19.9: exact priority. No unselected visible protective equipment.
  const strictIds=['helmet','eyes','gloves','ears','resp','vest','fall'];
  const exactCandidates=PRESETS.filter(p=>strictIds.every(id=>
    (p.gear.includes(id))===hasSelected(items,id) ||
    (id==='ears' && hasSelected(items,id) && selectedEarsTrait(items.find(x=>x.id==='ears'))==='ears-plugs' && !p.gear.includes('ears'))
  ));
  let candidates=exactCandidates.length?exactCandidates:PRESETS;
  if(items.length===2 && hasSelected(items,'helmet') && hasSelected(items,'eyes')){
    const trait=selectedEyesTrait(items.find(x=>x.id==='eyes'));
    const desired=trait==='eyes-dark'?'a4-2':trait==='eyes-goggles'?'a4-3':'a4-1';
    const forced=PRESETS.find(p=>p.id===desired);
    if(forced)candidates=[forced];
  }
  for(const preset of candidates){
    const covered=items.filter(i=>covers(preset,i));
    const missing=items.filter(i=>!covers(preset,i));
    const displayed=unique(preset.gear.map(g=>g==='other-07'?'vest':g));
    const extra=displayed.filter(g=>!items.some(i=>i.id===g||(g==='vest'&&i.id==='other-07')));
    const coveredScore=covered.reduce((n,i)=>n+(WEIGHTS[i.id]??18),0);
    const missingPenalty=missing.reduce((n,i)=>n+(WEIGHTS[i.id]??18)*0.55,0);
    const wrong=covered.reduce((n,i)=>n+variantPenalty(preset,i),0);
    const extraPenalty=extra.reduce((n,g)=>n+((WEIGHTS[g]??12)*0.90),0);
    const ctx=contextPenalty(preset,items);
    let score=coveredScore-missingPenalty-wrong-extraPenalty-ctx;
    if(missing.length===0&&wrong===0)score+=35;
    if(items.length===0&&preset.id==='a1-0')score+=25;
    const role=jobText();
    if(SPECIAL_KEYS.welder.test(role)&&preset.traits.includes('welder'))score+=16;
    if(SPECIAL_KEYS.fire.test(role)&&preset.traits.includes('fire'))score+=16;
    if(SPECIAL_KEYS.forestry.test(role)&&preset.traits.includes('forestry'))score+=16;
    if(SPECIAL_KEYS.lab.test(role)&&preset.traits.includes('lab'))score+=14;
    const match={variant:preset,covered,missing,extra,score,exact:missing.length===0&&extra.length===0&&wrong===0,wrong,contextPenalty:ctx};
    match.selected=items;
    match.labels=shownNamesForMatch(match);
    if(!best||match.score>best.score)best=match;
  }
  if(!best)best={variant:PRESETS[0],covered:[],missing:[],extra:[],score:0,exact:true,wrong:0,contextPenalty:0,labels:[]};
  best.selected=activeVisualRequirements();
  best.selectedLabels=best.selected.map(i=>i.label||catalogName(i.id));
  best.shownLabels=unique(best.covered.map(i=>i.label||catalogName(i.id)));
  best.hiddenLabels=best.missing.map(i=>i.label||catalogName(i.id));
  return best;
}
async function paintAtlas(canvas,match){
  const m=match||pickMatch();
  const preset=m.variant||PRESETS[0];
  const url=new URL(ATLAS_FILES[preset.atlas],document.baseURI).href;
  const img=await loadImg(url);
  if(!canvas||!canvas.getContext)return false;
  const ctx=canvas.getContext('2d');if(!ctx)return false;
  canvas.width=512;canvas.height=512;
  ctx.clearRect(0,0,512,512);
  ctx.fillStyle='#eef4fb';ctx.fillRect(0,0,512,512);
  if(!img)return false;
  const cols=4,rows=4;
  const tw=img.naturalWidth/cols,th=img.naturalHeight/rows;
  const col=preset.tile%cols,row=Math.floor(preset.tile/cols);
  const sx=col*tw+2,sy=row*th+2,sw=tw-4,sh=th-4;
  // 7% safe border around original atlas tile to prevent head/shoes clipping.
  const margin=34,area=512-margin*2;
  ctx.drawImage(img,sx,sy,sw,sh,margin,margin,area,area);
  return true;
}
function drawVisible(){
  document.querySelectorAll('canvas[data-bozp-atlas-v197]').forEach(canvas=>{
    const m=pickMatch();
    paintAtlas(canvas,m);
  });
}
function htmlForVisual(){
  const m=pickMatch();
  const shown=m.shownLabels.length?m.shownLabels.join(', '):m.variant.label;
  const selected=m.selectedLabels.length?m.selectedLabels.join(', '):'Zatiaľ nie je vybraný žiadny OOPP';
  const missing=m.hiddenLabels.length?m.hiddenLabels.join(', '):'';
  Promise.resolve().then(drawVisible);
  return `<div class="v19-visual"><canvas class="v19-photo" data-bozp-atlas-v197 width="512" height="512" role="img" aria-label="${esc(shown)}"></canvas><div class="v19-caption"><strong>Na postave je zobrazené:</strong> ${esc(shown)}</div><div class="v19-other"><strong>Zamestnanec má mať:</strong> ${esc(selected)}</div>${missing?`<div class="v19-other"><strong>Vybrané, ale na postave nezobrazené:</strong> ${esc(missing)}</div>`:''}<div class="v19-other"><strong>Zdroj vizuálu:</strong> ${esc(m.variant.label)} · atlas ${m.variant.atlas}, pole ${m.variant.tile+1}</div></div>`;
}
function configForVisual(){
  const m=pickMatch();
  return {labels:m.shownLabels.length?m.shownLabels:[m.variant.label],other:m.missing,atlasMatch:m};
}
window.bozpExactVisualConfig=configForVisual;
window.bozpV192Paint=(canvas,config)=>paintAtlas(canvas,(config&&config.atlasMatch)||pickMatch());
window.bozpV192DrawVisible=drawVisible;
window.bozpExactVisualHTML=htmlForVisual;
if(typeof s!=='undefined'){s.visualMode='auto';}
try{if(typeof save==='function')save()}catch(e){}
try{if(typeof render==='function')render()}catch(e){}
})();
