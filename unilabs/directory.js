(() => {
  'use strict';

  const labels = {
    own: 'Vlastné prevádzky',
    partner: 'Partnerské miesta',
    registry: 'Register e‑VÚC',
    internal: 'Na potvrdenie',
    archive: 'Archív'
  };
  const badges = {
    own: 'Unilabs',
    partner: 'Partner',
    registry: 'e‑VÚC',
    internal: 'Na potvrdenie',
    archive: 'Archív'
  };
  const collator = new Intl.Collator('sk', { sensitivity: 'base', numeric: true });
  const rows = [...window.UnilabsWorkplaces].sort((a, b) =>
    collator.compare(a.city, b.city) || collator.compare(a.address, b.address) || collator.compare(a.name, b.name)
  );
  const defaultScopes = ['own', 'registry', 'internal'];
  const workplaceTypes = [...new Set(rows.flatMap(row => row.tags))].sort(collator.compare);
  const filters = { scope: 'work', query: '', city: '', type: '' };
  const counts = Object.fromEntries(Object.keys(labels).map(scope => [scope, rows.filter(row => row.scope === scope).length]));
  const ownAddresses = new Set(rows.filter(row => row.scope === 'own').map(row => row.address)).size;
  const ownCities = new Set(rows.filter(row => row.scope === 'own').map(row => row.city)).size;
  const normalize = value => String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ').trim();
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);
  const external = (url, label) => '<a href="' + escape(url) + '" target="_blank" rel="noopener noreferrer">' + escape(label) + '</a>';
  const opt = (value, label) => '<option value="' + escape(value) + '">' + escape(label) + '</option>';
  const searchTerms = new Map(rows.map(row => [row.id, normalize([
    row.city, row.address, row.name, ...row.tags, ...(row.aliases || []), ...(row.folders || [])
  ].join(' '))]));

  function scopeRows(scope) {
    if (scope === 'all') return rows;
    if (scope === 'documents') return rows.filter(row => row.folders?.length);
    if (scope === 'work') return rows.filter(row => defaultScopes.includes(row.scope));
    return rows.filter(row => row.scope === scope);
  }

  function selectRows() {
    const words = normalize(filters.query).split(' ').filter(Boolean);
    return scopeRows(filters.scope).filter(row =>
      (!filters.city || row.city === filters.city) &&
      (!filters.type || row.tags.includes(filters.type)) &&
      words.every(word => searchTerms.get(row.id).includes(word))
    );
  }

  function phoneLabel(value) {
    if (value === '+421850150000') return '0850 150 000';
    return value.replace(/^(\+421)(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4');
  }

  function card(row) {
    const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(row.address);
    const shared = row.phone === '+421850150000';
    const sourceName = row.scope === 'archive' ? 'Zdroj záznamu' : row.scope === 'registry' ? 'Záznam e‑VÚC' : 'Detail a hodiny';
    return '<article class="ul-card">' +
      '<div class="ul-card-top"><span class="ul-badge ul-' + row.scope + '">' + escape(badges[row.scope]) + '</span>' +
      row.tags.map(tag => '<span class="ul-tag">' + escape(tag) + '</span>').join('') + '</div>' +
      '<h3>' + escape(row.name) + '</h3><p class="ul-address">' + escape(row.address) + '</p>' +
      (row.phone ? '<p class="ul-contact"><a href="tel:' + escape(row.phone) + '">' + escape(phoneLabel(row.phone)) +
        '</a> <span>' + (shared ? 'Call centrum' : 'Kontakt pracoviska') + '</span></p>' : '') +
      (row.email ? '<p class="ul-contact"><a href="mailto:' + escape(row.email) + '">' + escape(row.email) + '</a></p>' : '') +
      (row.note ? '<p class="ul-note">' + escape(row.note) + '</p>' : '') +
      (row.folders?.length ? '<details class="ul-docs"><summary>Priečinky v Unilabs.rar (' + row.folders.length + ')</summary><ul>' +
        row.folders.map(folder => '<li>' + escape(folder) + '</li>').join('') + '</ul></details>' : '') +
      '<div class="ul-actions">' + external(map, 'Mapa') +
      (row.source ? external(row.source, sourceName) : '') +
      (row.secondary ? external(...row.secondary) : '') +
      '<button type="button" data-ul-copy="' + escape(row.id) + '">Kopírovať adresu</button></div></article>';
  }

  function html() {
    return '<section class="ul-directory" id="unilabs-directory" aria-labelledby="ul-title">' +
      '<header class="ul-header"><div class="ul-heading"><p>Unilabs Slovensko, s. r. o.</p><h1 id="ul-title">Pobočky a pracoviská</h1>' +
      '<div class="ul-company"><span>IČO 31647758</span><a href="tel:+421850150000">0850 150 000</a>' +
      '<a href="mailto:info.sk@unilabs.com">info.sk@unilabs.com</a><span>Call centrum po–pi 7:00–16:30</span></div></div></header>' +
      '<div class="ul-summary" aria-label="Rýchle filtre">' +
      [['own', 'Vlastné na mape'], ['partner', 'Partnerské na mape'], ['registry', 'Adresy navyše v e‑VÚC'], ['internal', 'Na potvrdenie'], ['archive', 'Archívne záznamy']].map(([scope, label]) =>
        '<button type="button" data-ul-scope="' + scope + '" aria-pressed="false"><strong>' + counts[scope] + '</strong><span>' + label + '</span></button>'
      ).join('') + '</div>' +
      '<div class="ul-controls">' +
      '<label class="ul-search">Vyhľadávanie<input type="search" id="ul-search" placeholder="Mesto, ulica alebo pracovisko"></label>' +
      '<label><span id="ul-scope-label">Evidencia</span><select id="ul-scope" aria-labelledby="ul-scope-label">' + opt('work', 'Pracoviská Unilabs') +
      Object.entries(labels).map(([key, label]) => opt(key, label)).join('') +
      opt('documents', 'S priečinkom v archíve') + opt('all', 'Všetky záznamy') + '</select></label>' +
      '<label><span id="ul-city-label">Mesto</span><select id="ul-city" aria-labelledby="ul-city-label"></select></label>' +
      '<label><span id="ul-type-label">Typ pracoviska</span><select id="ul-type" aria-labelledby="ul-type-label">' + opt('', 'Všetky typy') + workplaceTypes.map(value => opt(value, value)).join('') + '</select></label></div>' +
      '<div class="ul-toolbar"><p id="ul-count" role="status"></p><div>' +
      '<button type="button" id="ul-reset">Zrušiť filtre</button><button type="button" id="ul-export">Stiahnuť CSV</button></div></div>' +
      '<p class="ul-feedback" id="ul-feedback" role="status"></p><div id="ul-results"></div>' +
      '<footer class="ul-footer">Verejné zdroje overené 27. 11. 2026. ' +
      external('https://pracoviska.unilabs.sk/sk/vsetky-prevadzky', 'Mapa Unilabs') + ' · ' +
      external('https://www.unilabs.sk/kontakty', 'Kontakty spoločnosti') + ' · ' +
      external('https://sk.unilabs.online/kde-nas-najdete', 'Odbery pre samoplatcov') + ' · ' +
      external('https://www.e-vuc.sk/e-vuc/poskytovatelia/alpha-medical.html?page_id=105990', 'Register e‑VÚC') +
      '<p>Mapa Unilabs eviduje ' + counts.own + ' vlastných prevádzok na ' + ownAddresses + ' adresách v ' + ownCities + ' mestách a obciach.</p>' +
      '<p>Priečinky odkazujú na priložený archív dokumentácie. Pri záznamoch na potvrdenie si dohodnite presnú adresu a rozsah návštevy s klientom.</p></footer></section>';
  }

  function csvCell(value) {
    let cell = String(value ?? '');
    if (/^[=+\-@\t\r]/.test(cell)) cell = "'" + cell;
    return '"' + cell.replace(/"/g, '""') + '"';
  }

  function exportRows(items) {
    const columns = ['Mesto', 'Pracovisko', 'Adresa', 'Evidencia', 'Typ', 'Telefón', 'E-mail', 'Priečinky v Unilabs.rar', 'Poznámka', 'Zdroj', 'Ďalší zdroj', 'Overené'];
    const data = items.map(row => [row.city, row.name, row.address, labels[row.scope], row.tags.join(', '),
      row.phone ? phoneLabel(row.phone) : '', row.email, row.folders?.join(' | '), row.note, row.source, row.secondary?.[0], '27. 11. 2026']);
    const csv = [columns, ...data].map(line => line.map(csvCell).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Unilabs_pobocky.csv';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  async function copyAddress(address) {
    try {
      await navigator.clipboard.writeText(address);
      return true;
    } catch {
      const field = document.createElement('textarea');
      field.value = address;
      field.className = 'ul-copy-field';
      document.body.append(field);
      field.select();
      try {
        return document.execCommand('copy');
      } catch {
        return false;
      } finally {
        field.remove();
      }
    }
  }

  function mount(root) {
    if (!root) return;
    const search = root.querySelector('#ul-search');
    const scope = root.querySelector('#ul-scope');
    const city = root.querySelector('#ul-city');
    const type = root.querySelector('#ul-type');
    const count = root.querySelector('#ul-count');
    const results = root.querySelector('#ul-results');
    const feedback = root.querySelector('#ul-feedback');
    const exportButton = root.querySelector('#ul-export');
    const scopeButtons = root.querySelectorAll('[data-ul-scope]');

    function syncSelectors() {
      const cities = [...new Set(scopeRows(filters.scope).map(row => row.city))];
      if (!cities.includes(filters.city)) filters.city = '';
      city.innerHTML = opt('', 'Všetky mestá') + cities.map(value => opt(value, value)).join('');
      city.value = filters.city;
      scope.value = filters.scope;
      type.value = filters.type;
      search.value = filters.query;
      for (const button of scopeButtons) button.setAttribute('aria-pressed', String(button.dataset.ulScope === filters.scope));
    }

    function refresh() {
      feedback.textContent = '';
      const visible = selectRows();
      const groups = new Map();
      for (const row of visible) {
        if (!groups.has(row.city)) groups.set(row.city, []);
        groups.get(row.city).push(row);
      }
      count.textContent = 'Záznamy ' + visible.length + ' · Mestá a obce ' + groups.size;
      exportButton.disabled = !visible.length;
      if (visible.length) {
        results.innerHTML = [...groups].map(([name, workplaces]) =>
          '<section class="ul-city"><h2>' + escape(name) + ' <span>' + workplaces.length + '</span></h2>' +
          '<div class="ul-grid">' + workplaces.map(card).join('') + '</div></section>'
        ).join('');
      } else {
        results.innerHTML = '<p class="ul-empty">Pre zvolené filtre sa nenašlo žiadne pracovisko.</p>';
      }
    }

    function setScope(value) {
      filters.scope = value;
      syncSelectors();
      refresh();
    }

    search.addEventListener('input', () => { filters.query = search.value; refresh(); });
    scope.addEventListener('change', () => setScope(scope.value));
    city.addEventListener('change', () => { filters.city = city.value; refresh(); });
    type.addEventListener('change', () => { filters.type = type.value; refresh(); });
    root.querySelector('#ul-reset').addEventListener('click', () => {
      Object.assign(filters, { query: '', city: '', type: '' });
      setScope('work');
    });
    exportButton.addEventListener('click', () => exportRows(selectRows()));
    for (const button of scopeButtons) button.addEventListener('click', () => {
      setScope(filters.scope === button.dataset.ulScope ? 'work' : button.dataset.ulScope);
    });
    results.addEventListener('click', async event => {
      const button = event.target.closest('[data-ul-copy]');
      if (!button) return;
      const row = rows.find(item => item.id === button.dataset.ulCopy);
      const copied = await copyAddress(row.address);
      feedback.textContent = copied ? 'Adresa je skopírovaná.' : 'Adresa: ' + row.address;
      button.textContent = copied ? 'Skopírované' : 'Kopírovať adresu';
      button.focus({ preventScroll: true });
      if (copied) setTimeout(() => { button.textContent = 'Kopírovať adresu'; }, 1800);
    });
    syncSelectors();
    refresh();
  }

  function matchesCompany(company) {
    return normalize(company?.ico) === '31647758' || /\b(?:unilabs|alpha medical)\b/.test(normalize(company?.name));
  }

  window.UnilabsDirectory = { html, mount, matchesCompany };
})();
