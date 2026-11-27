(() => {
  'use strict';

  const employer = 'Unilabs Slovensko, s. r. o.';
  const ico = '31647758';
  const statusLabels = {
    own: 'Adresár Unilabs',
    registry: 'e‑VÚC',
    internal: 'Overiť s klientom',
    archive: 'Historické',
    custom: 'Vlastná evidencia'
  };
  const collator = new Intl.Collator('sk', { sensitivity: 'base', numeric: true });
  const catalog = window.PifoxUnilabsWorkplaces;
  const cities = [...new Set(catalog.map(site => site.city))];
  const preferences = { query: '', city: '', scope: 'work' };
  let draft = null;

  function normal(value) {
    return String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
      .replace(/(\d)\s*\/\s*([a-z])\b/g, '$1$2').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function cityIn(text) {
    const value = ' ' + normal(text) + ' ';
    return cities.find(city => value.includes(' ' + normal(city) + ' ')) || '';
  }

  function addressKeys(address, city) {
    const primary = address.split(',')[0].replace(/\s+\d{3}\s?\d{2}\b.*$/, '');
    const full = normal(primary);
    const cityName = normal(city);
    const street = cityName && full.endsWith(' ' + cityName) ? full.slice(0, -cityName.length - 1) : full;
    const short = normal(primary.replace(/\b\d+\s*\/\s*(\d+)/g, '$1'));
    return [street, cityName && short.endsWith(' ' + cityName) ? short.slice(0, -cityName.length - 1) : short];
  }

  function match(saved) {
    if (!saved?.address) return null;
    const city = cityIn([saved.address, saved.unilabsCity, saved.site, saved.name].filter(Boolean).join(' '));
    const keys = addressKeys(saved.address, city);
    const candidates = catalog.filter(site =>
      (!city || city === site.city) && addressKeys(site.address, site.city).some(key => key && keys.includes(key))
    );
    return candidates.find(site => site.id === saved.unilabsDirectoryId) ||
      (candidates.length === 1 ? candidates[0] : null);
  }

  function savedSiteCity(saved) {
    return cityIn([saved.address, saved.unilabsCity, saved.site, saved.name].filter(Boolean).join(' ')) ||
      saved.unilabsCity || 'Mesto nezadané';
  }

  function sourceDetails(site) {
    const evidence = site.evidence;
    const docs = site.documents || [];
    const origin = site.source && site.scope === 'own' ? site.source + ' · overené 27. 11. 2026' : site.source;
    return '<div class="pu-detail">' +
      (site.note ? '<p class="pu-note">' + esc(site.note) + '</p>' : '') +
      (evidence ? '<div><h4>Z požiarnej identifikačnej karty</h4><small>' + esc(evidence.date) +
        '</small><ul>' + evidence.facts.map(fact => '<li>' + esc(fact) + '</li>').join('') + '</ul></div>' : '') +
      (docs.length ? '<div><h4>Dokumentácia v Unilabs.rar</h4><ul class="pu-files">' +
        docs.map(doc => '<li><strong>' + esc(doc.kind) + '</strong><span>' + esc(doc.filename) +
          '</span><small>' + esc(doc.folder) + '</small></li>').join('') + '</ul></div>' :
        '<p class="pu-source">Priradené dokumenty v dodanom archíve neevidované.</p>') +
      (origin ? '<p class="pu-source">Zdroj adresy a stavu · ' + esc(origin) + '</p>' : '') +
      '</div>';
  }

  function button(label, attribute, value, style = 'secondary') {
    return '<button class="btn ' + style + ' small" type="button" data-pu-' + attribute +
      '="' + esc(value) + '">' + esc(label) + '</button>';
  }

  function renderSite(site, audits) {
    const saved = site.saved || [];
    const details = !!site.source;
    return '<article class="pu-site"><div class="pu-site-main">' +
      '<div class="pu-chips"><span class="pu-status pu-' + site.scope + '">' + statusLabels[site.scope] + '</span>' +
      (site.documents?.length ? '<span class="pu-tag">Dokumentácia BOZP / OPP</span>' : '') + '</div>' +
      '<h3>' + esc(site.name) + '</h3>' +
      '<p class="pu-address">' + esc(site.address || 'Adresa nezadaná') + '</p>' +
      '</div>' +
      (details ? '<details class="pu-more"><summary>Podklady a údaje pre kontrolu</summary>' + sourceDetails(site) + '</details>' : '') +
      '<div class="pu-actions">' +
      (saved.length ? saved.map(entry => {
        const label = saved.length > 1 ? 'Otvoriť ' + (entry.site || entry.name) : 'Otvoriť kartu';
        const count = audits.get(entry.id) || 0;
        return '<div>' + button(label, 'open', entry.id) + '<small class="pu-audits">Audity ' + count + '</small></div>';
      }).join('') : site.scope === 'archive' ? '' : button('Pripraviť kartu pre audit', 'new', site.id)) +
      '</div></article>';
  }

  function directoryRows(savedSites) {
    const bySite = new Map();
    const custom = [];
    for (const saved of savedSites) {
      const site = match(saved);
      if (site) {
        if (!bySite.has(site.id)) bySite.set(site.id, []);
        bySite.get(site.id).push(saved);
      } else {
        custom.push({ scope: 'custom', city: savedSiteCity(saved), name: saved.site || saved.name, address: saved.address, saved: [saved] });
      }
    }
    return [...catalog.map(site => ({ ...site, saved: bySite.get(site.id) })), ...custom]
      .sort((a, b) => collator.compare(a.city, b.city) || collator.compare(a.address || '', b.address || ''));
  }

  function openDirectory(el, savedSites, auditList) {
    const rows = directoryRows(savedSites);
    const audits = new Map();
    for (const audit of auditList) audits.set(audit.companyId, (audits.get(audit.companyId) || 0) + 1);
    const cityOptions = [...new Set(rows.map(site => site.city))];
    const opts = cityOptions.map(city => '<option value="' + esc(city) + '">' + esc(city) + '</option>').join('');
    el.innerHTML = `<section class="pu-directory" aria-labelledby="pu-title">
      <header class="unilabs-banner pu-banner"><div><h1 id="pu-title">Unilabs</h1>
      <p>Pracoviská a podklady pre BOZP a ochranu pred požiarmi</p>
      <p class="pu-employer">IČO ${ico} · Sídlo Záborského 2, 036 01 Martin</p></div>
      ${button('Pridať vlastnú prevádzku', 'new', '', '')}</header>
      <div class="pu-controls">
        <label for="pu-search">Vyhľadávanie<input type="search" id="pu-search" placeholder="Mesto, adresa alebo podklad"></label>
        <label for="pu-city">Mesto alebo obec<select id="pu-city" aria-labelledby="pu-city-label"><option value="">Všetky mestá</option>${opts}</select><span id="pu-city-label" class="pu-visually-hidden">Mesto alebo obec</span></label>
        <label for="pu-scope">Rozsah<select id="pu-scope" aria-labelledby="pu-scope-label">
          <option value="work">Pracoviská</option><option value="docs">S dokumentáciou</option>
          <option value="saved">Moje evidované karty</option><option value="internal">Overiť s klientom</option>
          <option value="archive">Historické pracoviská</option><option value="all">Všetky záznamy</option></select>
          <span id="pu-scope-label" class="pu-visually-hidden">Rozsah</span></label>
      </div>
      <div class="pu-result-line"><p id="pu-count" role="status"></p>
      <button type="button" class="btn secondary small" id="pu-reset">Zrušiť filtre</button></div>
      <div id="pu-results"></div>
      </section>`;
    const search = el.querySelector('#pu-search');
    const city = el.querySelector('#pu-city');
    const scope = el.querySelector('#pu-scope');
    const results = el.querySelector('#pu-results');
    const count = el.querySelector('#pu-count');
    if (!cityOptions.includes(preferences.city)) preferences.city = '';
    const entries = rows.map(site => ({
      site,
      text: normal([site.city, site.address, site.name, ...(site.aliases || []),
        ...(site.documents || []).flatMap(doc => [doc.kind, doc.filename]),
        site.note, ...(site.evidence?.facts || []),
        ...(site.saved || []).map(entry => entry.name)].join(' '))
    }));

    function refresh() {
      const terms = normal(preferences.query).split(' ').filter(Boolean);
      const groups = new Map();
      let total = 0;
      for (const { site, text } of entries) {
        const s = preferences.scope;
        const fits = s === 'all' || (s === 'work' && site.scope !== 'archive') ||
          (s === 'docs' && site.scope !== 'archive' && site.documents?.length) ||
          (s === 'saved' && site.saved?.length) || s === site.scope;
        if (!fits || (preferences.city && site.city !== preferences.city) || !terms.every(term => text.includes(term))) continue;
        if (!groups.has(site.city)) groups.set(site.city, []);
        groups.get(site.city).push(site);
        total++;
      }
      count.textContent = 'Pracoviská ' + total + ' · Mestá a obce ' + groups.size;
      results.innerHTML = groups.size ? [...groups.entries()].map(([name, sites]) =>
        '<section class="pu-city"><h2>' + esc(name) + ' <span>' + sites.length + '</span></h2>' +
        '<div class="pu-grid">' + sites.map(site => renderSite(site, audits)).join('') + '</div></section>'
      ).join('') : '<p class="pu-empty">Žiadne pracovisko pre zvolené filtre.</p>';
    }

    search.value = preferences.query;
    city.value = preferences.city;
    scope.value = preferences.scope;
    search.addEventListener('input', () => { preferences.query = search.value; refresh(); });
    city.addEventListener('change', () => { preferences.city = city.value; refresh(); });
    scope.addEventListener('change', () => { preferences.scope = scope.value; refresh(); });
    el.querySelector('#pu-reset').addEventListener('click', () => {
      search.value = preferences.query = '';
      city.value = preferences.city = '';
      scope.value = preferences.scope = 'work';
      refresh();
    });
    el.querySelector('.pu-directory').addEventListener('click', event => {
      const target = event.target.closest('button');
      if (!target) return;
      if (target.hasAttribute('data-pu-open')) {
        unilabsOpenSite(target.dataset.puOpen);
      } else if (target.hasAttribute('data-pu-new')) {
        draft = catalog.find(site => site.id === target.dataset.puNew) || null;
        go('unilabs-new');
      }
    });
    refresh();
  }

  function fillDraft(el) {
    if (!draft) return;
    el.querySelector('#uni-name').value = employer;
    el.querySelector('#uni-site').value = draft.city + ' · ' + draft.name;
    el.querySelector('#uni-ico').value = ico;
    el.querySelector('#uni-address').value = draft.address;
    if (draft.scope === 'internal' && draft.note) {
      el.querySelector('.unilabs-fields').insertAdjacentHTML('beforebegin',
        '<p class="warning">' + esc(draft.note) + '</p>');
    }
  }

  function saveDraft(site) {
    if (draft && normal(site.address) === normal(draft.address)) {
      site.unilabsDirectoryId = draft.id;
      site.unilabsCity = draft.city;
    }
    draft = null;
  }

  function addSiteDetails(el, saved) {
    const site = match(saved);
    if (!site) return;
    const actions = el.querySelector('.actions');
    if (!actions) return;
    actions.insertAdjacentHTML('afterend',
      '<details class="pu-more pu-in-company"><summary>Podklady BOZP a OPP pre pracovisko</summary>' +
      sourceDetails(site) + '</details>');
  }

  window.PifoxUnilabs = {
    openDirectory(el, savedSites, auditList) {
      draft = null;
      openDirectory(el, savedSites, auditList);
    },
    fillDraft,
    saveDraft,
    addSiteDetails
  };
})();
