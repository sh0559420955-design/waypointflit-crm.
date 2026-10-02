/* =====================================================================
   WaypointFlit CRM – מוקדי עניין (poi.js)
   כל המקורות חינמיים וללא מפתח:
   OpenStreetMap (Nominatim + Overpass), ויקיפדיה, Open-Meteo,
   REST Countries, open.er-api (שערים), Nager.Date (חגים)
   שימוש:  <script src="poi.js"></script>
           WaypointPOI.open({ destination, customer, phone, start, end, hotel })
   או כפתור: <button data-poi data-destination-field="#dest" ...>
   ===================================================================== */
(function () {
  'use strict';

  const AGENT = { name: 'שמעון שוקר', brand: 'WaypointFlit', site: 'waypointflit.com' };
  const TIMEOUT = 20000;
  const LOGO = 'data:image/png;base64,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';

  /* ---------- סנכרון עם הצעות מחיר ---------- */
  const QUOTE_KEYS = {
    customer: ['customer', 'customerName', 'clientName', 'name', 'fullName', 'שם', 'שם לקוח'],
    phone: ['phone', 'customerPhone', 'mobile', 'tel', 'טלפון'],
    destination: ['destination', 'dest', 'city', 'destinationCity', 'יעד'],
    hotel: ['hotel', 'hotelName', 'מלון'],
    start: ['start', 'startDate', 'checkIn', 'checkin', 'departDate', 'departure', 'outboundDate', 'from', 'יציאה'],
    end: ['end', 'endDate', 'checkOut', 'checkout', 'returnDate', 'inboundDate', 'to', 'חזרה'],
    customerId: ['customerId', 'leadId', 'id']
  };
  function fromQuoteData(q) {
    const o = {};
    if (!q) return o;
    const flat = Object.assign({}, q, q.customer && typeof q.customer === 'object' ? q.customer : {}, q.hotel && typeof q.hotel === 'object' ? q.hotel : {}, q.flight && typeof q.flight === 'object' ? q.flight : {});
    for (const k in QUOTE_KEYS) {
      for (const alt of QUOTE_KEYS[k]) {
        const v = flat[alt];
        if (v != null && typeof v !== 'object' && String(v).trim()) { o[k] = String(v).trim(); break; }
      }
    }
    return o;
  }
  let lastQuote = null;
  document.addEventListener('quote:parsed', e => { lastQuote = fromQuoteData(e.detail); });

  const CATS = [
    { id: 'wiki', label: 'מומלצים', icon: '⭐' },
    { id: 'attr', label: 'אטרקציות ומוזיאונים', icon: '🏛️', sel: ['["tourism"~"^(attraction|museum|gallery|viewpoint)$"]', '["historic"~"^(castle|monument|ruins|archaeological_site|fort|palace)$"]'] },
    { id: 'kids', label: 'משפחות וילדים', icon: '🎢', sel: ['["tourism"~"^(zoo|theme_park|aquarium)$"]', '["leisure"~"^(water_park|amusement_arcade|miniature_golf|trampoline_park)$"]'] },
    { id: 'nature', label: 'טבע וחופים', icon: '🌲', sel: ['["leisure"~"^(park|nature_reserve|garden)$"]', '["natural"~"^(beach|peak|cave_entrance|spring)$"]', '["waterway"="waterfall"]'] },
    { id: 'spa', label: 'ספא ומעיינות', icon: '♨️', sel: ['["leisure"~"^(spa|sauna)$"]', '["amenity"~"^(spa|public_bath)$"]', '["natural"="hot_spring"]'] },
    { id: 'food', label: 'מסעדות וקפה', icon: '🍽️', sel: ['["amenity"~"^(restaurant|cafe)$"]'] },
    { id: 'kosher', label: 'כשר ובתי כנסת', icon: '✡️', sel: ['["amenity"="place_of_worship"]["religion"="jewish"]', '["diet:kosher"~"^(yes|only)$"]', '["cuisine"~"kosher"]'] },
    { id: 'shop', label: 'קניות ושווקים', icon: '🛍️', sel: ['["shop"~"^(mall|department_store)$"]', '["amenity"="marketplace"]'] },
    { id: 'night', label: 'חיי לילה', icon: '🍸', sel: ['["amenity"~"^(bar|pub|nightclub)$"]'] },
    { id: 'health', label: 'בית מרקחת וחירום', icon: '⚕️', sel: ['["amenity"~"^(pharmacy|hospital)$"]'] },
  ];

  const TYPE_HE = {
    attraction: 'אטרקציה', museum: 'מוזיאון', gallery: 'גלריה', viewpoint: 'תצפית', castle: 'טירה',
    monument: 'אנדרטה', ruins: 'חורבות', archaeological_site: 'אתר ארכיאולוגי', fort: 'מבצר', palace: 'ארמון',
    zoo: 'גן חיות', theme_park: 'פארק שעשועים', aquarium: 'אקווריום', water_park: 'פארק מים',
    amusement_arcade: 'משחקייה', miniature_golf: 'מיני גולף', trampoline_park: 'פארק טרמפולינות',
    park: 'פארק', nature_reserve: 'שמורת טבע', garden: 'גן', beach: 'חוף', peak: 'פסגה',
    cave_entrance: 'מערה', spring: 'מעיין', waterfall: 'מפל', spa: 'ספא', sauna: 'סאונה',
    public_bath: 'מרחצאות', hot_spring: 'מעיין חם', restaurant: 'מסעדה', cafe: 'בית קפה',
    place_of_worship: 'בית כנסת', mall: 'קניון', department_store: 'כלבו', marketplace: 'שוק',
    bar: 'בר', pub: 'פאב', nightclub: 'מועדון', pharmacy: 'בית מרקחת', hospital: 'בית חולים'
  };

  // שרתי המפות (Overpass) – חינמיים ולכן לפעמים עמוסים. עוברים ביניהם, מחכים ומנסים שוב.
  const OVERPASS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
  ];
  // כמה מקומות מכל קטגוריה נכנסים לדף "הכל"
  const GUIDE_N = { attr: 6, kids: 4, nature: 5, spa: 4, food: 6, kosher: 4, shop: 3, night: 3, health: 3 };

  const S = {
    opts: {}, place: null, center: null, centerLabel: '', radius: 3000,
    cache: {}, selected: new Map(), cat: 'wiki', facts: {}, filter: '', msgDirty: false,
    inc: { wx: true, cur: true, time: true, drive: false, hol: true, plan: false }
  };
  let root = null;

  /* ---------- helpers ---------- */
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => Array.from(root.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  async function getJSON(url, init) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), TIMEOUT);
    try {
      const r = await fetch(url, Object.assign({}, init, { signal: ac.signal }));
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  }
  function dist(a, b) {
    const R = 6371000, r = x => x * Math.PI / 180;
    const dLat = r(b.lat - a.lat), dLon = r(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  const fmtDist = m => m < 1000 ? Math.round(m / 10) * 10 + ' מ׳' : (m / 1000).toFixed(m < 10000 ? 1 : 0) + ' ק״מ';
  function toISO(d) {
    if (!d) return '';
    if (d instanceof Date) return d.toISOString().slice(0, 10);
    const s = String(d).trim();
    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
    m = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
    if (m) return `${m[3].length === 2 ? '20' + m[3] : m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    return '';
  }
  const heDate = iso => { const p = iso.split('-'); return `${+p[2]}.${+p[1]}`; };
  const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / 864e5);
  const todayISO = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
  function waPhone(p) {
    let d = String(p || '').replace(/\D/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    if (d.startsWith('0')) d = '972' + d.slice(1);
    return d;
  }
  const ll = p => `${p.lat.toFixed(6)},${p.lon.toFixed(6)}`;
  const mapLink = p => `https://maps.google.com/?q=${ll(p)}`;
  const wazeLink = p => `https://waze.com/ul?ll=${ll(p)}&navigate=yes`;
  const dirLink = (from, pts) => 'https://www.google.com/maps/dir/' + [from].concat(pts).map(p => `${p.lat.toFixed(5)},${p.lon.toFixed(5)}`).join('/');
  function tzOffsetMin(tz, date) {
    try {
      const v = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
        .formatToParts(date || new Date()).find(p => p.type === 'timeZoneName').value;
      const m = v.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      return m ? (m[1] === '-' ? -1 : 1) * (+m[2] * 60 + (+m[3] || 0)) : 0;
    } catch (e) { return null; }
  }
  const wxIcon = c => c === 0 ? '☀️' : c <= 3 ? '⛅' : c <= 48 ? '🌫️' : c <= 67 ? '🌧️' : c <= 77 ? '❄️' : c <= 82 ? '🌦️' : '⛈️';

  /* ---------- data sources ---------- */
  async function geocode(q, near) {
    let url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&extratags=1&namedetails=1&accept-language=he&q=' + encodeURIComponent(q);
    if (near) { const d = 0.4; url += `&viewbox=${near.lon - d},${near.lat + d},${near.lon + d},${near.lat - d}`; }
    const r = await getJSON(url);
    if (!r.length) return null;
    const x = r[0], nd = x.namedetails || {}, ad = x.address || {};
    return {
      lat: +x.lat, lon: +x.lon, name: nd['name:he'] || x.name || nd.name || q,
      cc: (ad.country_code || '').toUpperCase(), country: ad.country || '',
      wiki: (x.extratags || {}).wikipedia || ''
    };
  }

  async function geocodeSmart(q) {
    let g = await geocode(q).catch(() => null); if (g) return g;
    const first = q.split(',')[0].trim();
    if (first && first !== q) { g = await geocode(first).catch(() => null); if (g) return g; }
    try {
      const j = await getJSON(`https://he.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(first)}&gsrlimit=1&prop=coordinates|langlinks&lllang=en`);
      const p = Object.values((j.query || {}).pages || {})[0];
      if (p) {
        const en = p.langlinks && p.langlinks[0] && p.langlinks[0]['*'];
        if (en) { g = await geocode(en).catch(() => null); if (g) { g.name = first; return g; } }
        const co = p.coordinates && p.coordinates[0];
        if (co) return { lat: co.lat, lon: co.lon, name: first, cc: '', country: '', wiki: 'he:' + p.title };
      }
    } catch (e) { /* nothing more to try */ }
    return null;
  }

  async function wikiNearby(c, radius) {
    const r = Math.min(radius, 10000);
    const res = await Promise.allSettled(['he', 'en'].map(l =>
      getJSON(`https://${l}.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=geosearch&ggscoord=${c.lat}|${c.lon}&ggsradius=${r}&ggslimit=40&prop=coordinates|pageimages|extracts|info&exintro=1&explaintext=1&exsentences=2&exlimit=max&piprop=thumbnail&pithumbsize=240&inprop=url`)
        .then(j => ({ l, j }))));
    const out = [];
    for (const s of res) {
      if (s.status !== 'fulfilled') continue;
      const pages = Object.values(((s.value.j.query || {}).pages) || {});
      for (const p of pages) {
        const co = p.coordinates && p.coordinates[0];
        if (!co) continue;
        const it = {
          id: `w${s.value.l}${p.pageid}`, name: p.title, lat: co.lat, lon: co.lon,
          desc: (p.extract || '').replace(/\s+/g, ' ').trim(), img: p.thumbnail && p.thumbnail.source,
          url: p.fullurl, urlLabel: 'ויקיפדיה', type: '', famous: true
        };
        if (S.place && (it.name === S.place.name || dist(it, S.place) < 50)) continue;
        if (out.some(o => o.name === it.name || dist(o, it) < 60)) continue;
        out.push(it);
      }
    }
    out.forEach(o => o.d = dist(S.center, o));
    out.sort((a, b) => (!!b.img + !!b.desc) - (!!a.img + !!a.desc) || a.d - b.d);
    return out;
  }

  function toPOI(e) {
    const t = e.tags || {};
    const lat = e.lat != null ? e.lat : e.center && e.center.lat;
    const lon = e.lon != null ? e.lon : e.center && e.center.lon;
    if (lat == null || !(t['name:he'] || t.name)) return null;
    const kind = t.tourism || t.historic || t.leisure || t.natural || (t.waterway === 'waterfall' ? 'waterfall' : '') || t.amenity || t.shop || '';
    let type = TYPE_HE[kind] || '';
    if (/kosher/.test(t.cuisine || '') || /yes|only/.test(t['diet:kosher'] || '')) type = (type ? type + ' ' : '') + 'כשר';
    const cuisine = t.cuisine ? t.cuisine.split(';').slice(0, 2).join(', ').replace(/_/g, ' ') : '';
    return {
      id: `o${e.type[0]}${e.id}`, name: t['name:he'] || t.name,
      alt: t['name:he'] && t.name && t.name !== t['name:he'] ? t.name : '',
      lat, lon, type,
      desc: [cuisine && 'מטבח: ' + cuisine, t.opening_hours && 'שעות: ' + t.opening_hours].filter(Boolean).join('   '),
      url: t.website || t['contact:website'] || '', urlLabel: 'אתר',
      phone: t.phone || t['contact:phone'] || '',
      famous: !!(t.wikipedia || t.wikidata)
    };
  }

  /* ---- Overpass: תור (בקשה אחת בכל פעם), זיכרון ליום, ניסיון חוזר ---- */
  let opQueue = Promise.resolve();
  function queued(fn) { const p = opQueue.then(fn, fn); opQueue = p.catch(() => {}); return p; }
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function cacheGet(k) { try { const v = JSON.parse(sessionStorage.getItem(k) || 'null'); return v && Date.now() - v.t < 864e5 ? v.d : null; } catch (e) { return null; } }
  function cacheSet(k, d) { try { sessionStorage.setItem(k, JSON.stringify({ t: Date.now(), d })); } catch (e) { /* מלא – לא נורא */ } }
  async function overpassRaw(q) {
    const ck = 'wpoi-op:' + q, hit = cacheGet(ck);
    if (hit) return hit;
    return queued(async () => {
      let err;
      for (let round = 0; round < 2; round++) {
        for (const u of OVERPASS) {
          try {
            const j = await getJSON(u, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            const els = j.elements || [];
            if (!els.length && j.remark && /runtime error|timed out|out of memory|rate/i.test(j.remark)) throw new Error(j.remark);
            cacheSet(ck, els);
            return els;
          } catch (e) { err = e; }
        }
        if (round === 0) await sleep(3000);
      }
      throw err;
    });
  }
  const opQuery = (sels, c, radius, max) => `[out:json][timeout:25];(${sels.map(s => `nwr["name"]${s}(around:${radius},${c.lat},${c.lon});`).join('')});out center tags qt ${max};`;
  function toList(els, c) {
    const seen = new Set();
    const list = els.map(toPOI).filter(p => p && !seen.has(p.name) && seen.add(p.name));
    list.forEach(p => p.d = dist(c, p));
    list.sort((a, b) => b.famous - a.famous || a.d - b.d);
    return list;
  }
  async function overpass(cat, c, radius) {
    return toList(await overpassRaw(opQuery(cat.sel, c, radius, 150)), c);
  }
  // שיוך מקום לקטגוריה לפי התגיות שלו (כשר קודם, כדי שמסעדה כשרה תופיע תחת כשר)
  const SEL_RE = /\["([^"]+)"(=|~)"([^"]+)"\]/g;
  function selMatch(sel, t) {
    const parts = [...sel.matchAll(SEL_RE)];
    return parts.length > 0 && parts.every(([, k, op, v]) => t[k] != null && (op === '=' ? t[k] === v : new RegExp(v).test(t[k])));
  }
  function catOfTags(t) {
    const order = ['kosher'].concat(CATS.map(c => c.id).filter(id => id !== 'kosher'));
    for (const id of order) { const c = CATS.find(x => x.id === id); if (c.sel && c.sel.some(s => selMatch(s, t))) return id; }
    return null;
  }
  // בקשה אחת לכל הקטגוריות יחד – בשביל כפתור "הכל"
  async function overpassAll(c, radius) {
    // כל קטגוריה עם תקרה משלה, כדי שמסעדות לא "יבלעו" את שאר המקומות
    const q = '[out:json][timeout:30];' + CATS.filter(x => x.sel).map(x => `(${x.sel.map(s => `nwr["name"]${s}(around:${radius},${c.lat},${c.lon});`).join('')});out center tags qt ${x.id === 'food' ? 80 : 50};`).join('');
    const els = await overpassRaw(q);
    const groups = {};
    els.forEach(e => { const id = catOfTags(e.tags || {}); if (id) (groups[id] = groups[id] || []).push(e); });
    CATS.filter(x => x.sel).forEach(x => { S.cache[x.id + S.radius] = toList(groups[x.id] || [], c); });
  }

  async function weather(c, start, end) {
    const today = todayISO(), horizon = addDays(today, 15);
    const daily = 'weathercode,temperature_2m_max,temperature_2m_min';
    if (!start || (start <= horizon && (end || start) >= today)) {
      const s = !start || start < today ? today : start;
      let e = end || addDays(s, 6); if (e > horizon) e = horizon;
      const j = await getJSON(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&daily=${daily},precipitation_probability_max&timezone=auto&start_date=${s}&end_date=${e}`);
      const d = j.daily;
      const days = d.time.map((t, i) => ({ t, code: d.weathercode[i], max: Math.round(d.temperature_2m_max[i]), min: Math.round(d.temperature_2m_min[i]), rain: d.precipitation_probability_max[i] }));
      const mx = Math.max(...days.map(x => x.max)), mn = Math.min(...days.map(x => x.min)), rn = Math.max(...days.map(x => x.rain || 0));
      return { tz: j.timezone, days, label: 'תחזית', text: `${mn}°–${mx}°, סיכוי לגשם עד ${rn}%` };
    }
    let e = end || addDays(start, 6);
    if (daysBetween(start, e) > 20) e = addDays(start, 20);
    const ly = iso => `${+iso.slice(0, 4) - 1}${iso.slice(4)}`.replace('-02-29', '-02-28');
    const j = await getJSON(`https://archive-api.open-meteo.com/v1/archive?latitude=${c.lat}&longitude=${c.lon}&start_date=${ly(start)}&end_date=${ly(e)}&daily=${daily},precipitation_sum&timezone=auto`);
    const d = j.daily, n = d.time.length;
    const avg = a => Math.round(a.reduce((s, x) => s + (x || 0), 0) / n);
    const rainy = d.precipitation_sum.filter(x => x > 1).length;
    const days = d.time.map((t, i) => ({ t: addDays(t, 365), code: d.weathercode[i], max: Math.round(d.temperature_2m_max[i]), min: Math.round(d.temperature_2m_min[i]) }));
    return { tz: j.timezone, days, label: 'לפי אותם תאריכים בשנה שעברה', text: `בדרך כלל ${avg(d.temperature_2m_min)}°–${avg(d.temperature_2m_max)}°, ${rainy ? rainy + ' ימי גשם מתוך ' + n : 'כמעט ללא גשם'}` };
  }

  async function countryInfo(cc) {
    const j = await getJSON(`https://restcountries.com/v3.1/alpha/${cc}?fields=currencies,car,flag,languages`);
    return Array.isArray(j) ? j[0] : j;
  }
  async function rate(code) {
    const j = await getJSON(`https://open.er-api.com/v6/latest/${code}`);
    const r = j.rates && j.rates.ILS;
    if (!r) return '';
    let unit = 1; while (r * unit < 1) unit *= 10;
    return `${unit} ${code} ≈ ${(r * unit).toFixed(2)} ₪`;
  }
  async function holidays(cc, start, end) {
    const years = [...new Set([start.slice(0, 4), (end || start).slice(0, 4)])];
    const all = (await Promise.all(years.map(y => getJSON(`https://date.nager.at/api/v3/PublicHolidays/${y}/${cc}`)))).flat();
    return all.filter(h => h.date >= start && h.date <= (end || start)).map(h => `${heDate(h.date)} ${h.name}`);
  }
  async function summary(place) {
    const tries = [['he', place.name]];
    if (place.wiki) { const [l, ...t] = place.wiki.split(':'); tries.push([l, t.join(':')]); }
    for (const [l, title] of tries) {
      try {
        const j = await getJSON(`https://${l}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);
        if (j.type !== 'disambiguation' && j.extract) return { text: j.extract, img: j.thumbnail && j.thumbnail.source, lang: l };
      } catch (e) { /* next */ }
    }
    return null;
  }

  /* ---------- trip planner ---------- */
  function buildPlan(list, days) {
    const pts = list.slice(), ordered = [];
    let cur = S.center;
    while (pts.length) {
      let bi = 0, bd = Infinity;
      pts.forEach((p, i) => { const d = dist(cur, p); if (d < bd) { bd = d; bi = i; } });
      cur = pts.splice(bi, 1)[0]; ordered.push(cur);
    }
    const per = Math.ceil(ordered.length / Math.max(1, days)), out = [];
    for (let i = 0; i < ordered.length; i += per) out.push(ordered.slice(i, i + per));
    return out;
  }

  /* ---------- UI ---------- */
  const CSS = `
.wpoi{--n:#16264A;--n2:#22386B;--o:#F47B20;--o2:#FFF1E4;--ink:#1B2236;--mut:#5F6982;--line:#E2E6EF;--bg:#F5F6FA;--card:#fff;
position:fixed;inset:0;z-index:99999;background:rgba(22,38,74,.55);display:flex;align-items:flex-end;justify-content:center;direction:rtl;
font-family:'Assistant',system-ui,-apple-system,'Segoe UI',Arial,sans-serif;color:var(--ink);font-size:16px;line-height:1.45}
.wpoi[hidden]{display:none}
.wpoi *{box-sizing:border-box}
.wpoi button,.wpoi input,.wpoi select,.wpoi textarea{font:inherit;color:inherit}
.wpoi :focus-visible{outline:3px solid var(--o);outline-offset:2px}
.wpoi-sheet{background:var(--bg);width:100%;max-width:1000px;height:100%;display:flex;flex-direction:column;overflow:hidden;padding-top:env(safe-area-inset-top,0)}
@media(min-width:760px){.wpoi{align-items:center;padding:24px}.wpoi-sheet{height:92vh;border-radius:20px}}
.wpoi-top{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--n);color:#fff}
.wpoi-top h1{font:700 1.15rem 'Rubik',sans-serif;margin:0}
.wpoi-x{background:none;border:0;color:#fff;font-size:1.4rem;width:44px;height:44px;border-radius:50%;cursor:pointer}
.wpoi-x:hover{background:var(--n2)}
.wpoi-scroll{flex:1;overflow-y:auto;overscroll-behavior:contain}
.wpoi-search{display:grid;grid-template-columns:1fr;gap:8px;padding:14px 16px;background:var(--n);color:#fff;padding-top:0}
@media(min-width:760px){.wpoi-search{grid-template-columns:2fr 2fr 1fr auto;align-items:end}}
.wpoi-search label{display:flex;flex-direction:column;gap:3px;font-size:.85rem;color:#C9D2E6}
.wpoi-search input,.wpoi-search select{background:#fff;border:0;border-radius:10px;padding:11px 12px;color:var(--ink);width:100%}
.wpoi-go{background:var(--o);color:#fff;border:0;border-radius:10px;padding:12px 22px;font-weight:700;cursor:pointer;min-height:46px}
.wpoi-go:hover{filter:brightness(1.07)}
.wpoi-pass{margin:16px;display:grid;grid-template-columns:1fr;background:var(--n);color:#fff;border-radius:18px;overflow:hidden}
@media(min-width:760px){.wpoi-pass{grid-template-columns:1.6fr 1fr}}
.wpoi-main{padding:18px 20px;position:relative;min-width:0}
.wpoi-route{color:var(--o);font-weight:700;font-size:.9rem}
.wpoi-main h2{font:800 clamp(1.9rem,6vw,2.9rem)/1.05 'Rubik',sans-serif;margin:4px 0 2px;letter-spacing:-.01em}
.wpoi-sub{color:#C9D2E6;margin:0 0 10px}
.wpoi-sum{margin:0;color:#E8ECF5;font-size:.95rem;max-width:60ch;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.wpoi-stub{padding:16px 20px;border-top:2px dashed var(--o)}
@media(min-width:760px){.wpoi-stub{border-top:0;border-right:2px dashed var(--o)}}
.wpoi-stub dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:6px 12px;font-size:.93rem}
.wpoi-stub dt{color:#AEB9D3}.wpoi-stub dd{margin:0;font-weight:600}
.wpoi-wx{display:flex;gap:6px;overflow-x:auto;padding:0 16px 4px}
.wpoi-wx-l{padding:0 16px;color:var(--mut);font-size:.85rem;margin:0 0 4px}
.wpoi-day{flex:0 0 auto;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:6px 10px;text-align:center;font-size:.85rem;min-width:62px}
.wpoi-day b{display:block;font-size:1.25rem}
.wpoi-cats{position:sticky;top:0;z-index:2;background:var(--bg);padding:12px 16px 8px;display:flex;gap:8px;overflow-x:auto;border-bottom:1px solid var(--line)}
.wpoi-chip{flex:0 0 auto;border:1.5px solid var(--line);background:var(--card);border-radius:999px;padding:8px 14px;cursor:pointer;white-space:nowrap;min-height:40px}
.wpoi-chip[aria-pressed="true"]{background:var(--n);border-color:var(--n);color:#fff}
.wpoi-chip.sel{border-color:var(--o)}
.wpoi-chip.all{background:var(--o);border-color:var(--o);color:#fff;font-weight:700}
.wpoi-chip small{opacity:.7;margin-inline-start:4px}
.wpoi-tools{display:flex;gap:8px;padding:10px 16px;flex-wrap:wrap;align-items:center}
.wpoi-tools input{flex:1;min-width:160px;border:1.5px solid var(--line);border-radius:10px;padding:9px 12px;background:var(--card)}
.wpoi-btn{border:1.5px solid var(--n);background:var(--card);color:var(--n);border-radius:10px;padding:9px 14px;cursor:pointer;font-weight:600;min-height:42px}
.wpoi-btn:hover{background:var(--o2)}
.wpoi-list{padding:0 16px 16px;display:grid;gap:10px;grid-template-columns:1fr}
@media(min-width:760px){.wpoi-list{grid-template-columns:1fr 1fr}}
.wpoi-item{display:grid;grid-template-columns:auto 64px 1fr;gap:12px;align-items:start;background:var(--card);border:1.5px solid var(--line);border-radius:14px;padding:12px;cursor:pointer}
.wpoi-item.on{border-color:var(--o);background:var(--o2)}
.wpoi-item input{width:22px;height:22px;accent-color:var(--o);margin:2px 0 0}
.wpoi-thumb{width:64px;height:64px;border-radius:10px;object-fit:cover;background:var(--bg);display:grid;place-items:center;font-size:1.6rem}
.wpoi-item b{display:block;font-size:1.02rem}
.wpoi-meta{display:flex;gap:10px;flex-wrap:wrap;color:var(--mut);font-size:.85rem}
.wpoi-star{color:var(--o);font-weight:700}
.wpoi-item p{margin:4px 0 0;font-size:.9rem;color:#3A4358;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.wpoi-links{display:flex;gap:14px;margin-top:6px;font-size:.88rem}
.wpoi-links a{color:var(--n2);font-weight:600}
.wpoi-msg{padding:28px 16px;text-align:center;color:var(--mut)}
.wpoi-msg.err{color:#B3261E}
.wpoi-panel{background:var(--card);border:1.5px solid var(--line);border-radius:14px;padding:14px;margin:0 16px 14px}
.wpoi-panel h3{font:700 1.05rem 'Rubik',sans-serif;margin:0 0 10px}
.wpoi-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.wpoi-row input[type=text],.wpoi-row input[type=tel],.wpoi-row input[type=number]{border:1.5px solid var(--line);border-radius:10px;padding:9px 12px;flex:1;min-width:120px}
.wpoi-row input.bad{border-color:#B3261E;background:#FDECEA}
.wpoi-toggles{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:10px;font-size:.93rem}
.wpoi-toggles label{display:flex;gap:6px;align-items:center;cursor:pointer}
.wpoi-toggles input{accent-color:var(--o);width:18px;height:18px}
.wpoi-day-plan{border-right:3px solid var(--o);padding:4px 12px;margin:10px 0}
.wpoi-day-plan h4{margin:0 0 4px;font:700 .98rem 'Rubik',sans-serif}
.wpoi-day-plan ol{margin:0;padding-inline-start:20px}
.wpoi textarea{width:100%;min-height:220px;border:1.5px solid var(--line);border-radius:10px;padding:10px;resize:vertical;font-size:.92rem;background:#FBFBFD}
.wpoi-bar{display:flex;gap:8px;align-items:center;padding:10px 16px calc(10px + env(safe-area-inset-bottom,0));background:var(--card);border-top:1px solid var(--line)}
.wpoi-count{flex:1;font-weight:700;color:var(--n)}
.wpoi-wa{background:#1FA855;color:#fff;border:0;border-radius:12px;padding:12px 18px;font-weight:700;cursor:pointer;min-height:48px}
.wpoi-toast{position:absolute;bottom:84px;left:50%;transform:translateX(-50%);background:var(--n);color:#fff;padding:10px 16px;border-radius:10px;font-size:.92rem;max-width:90%;text-align:center}
.wpoi-toast[hidden]{display:none}
.wpoi-launch{display:inline-flex;align-items:center;gap:10px;background:#F47B20;color:#fff;border:0;border-radius:14px;padding:16px 26px;font:700 1.15rem 'Rubik','Assistant',sans-serif;cursor:pointer;box-shadow:0 6px 16px rgba(244,123,32,.35)}
.wpoi-launch:hover{filter:brightness(1.06)}
@media(prefers-reduced-motion:no-preference){.wpoi-sheet{animation:wpoiUp .25s ease-out}@keyframes wpoiUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}}
`;

  function build() {
    if (root) return;
    if (!document.querySelector('link[data-wpoi-font]')) {
      const f = document.createElement('link');
      f.rel = 'stylesheet'; f.dataset.wpoiFont = '1';
      f.href = 'https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&family=Rubik:wght@700;800&display=swap';
      document.head.appendChild(f);
    }
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    root = document.createElement('div');
    root.className = 'wpoi'; root.hidden = true;
    root.innerHTML = `
<div class="wpoi-sheet" role="dialog" aria-modal="true" aria-labelledby="wpoi-h">
  <header class="wpoi-top"><h1 id="wpoi-h">📍 מוקדי עניין ללקוח</h1><button class="wpoi-x" type="button" aria-label="סגור">✕</button></header>
  <div class="wpoi-scroll">
    <form class="wpoi-search">
      <label>יעד<input id="wpoi-dest" placeholder="למשל: ולינגרד, בולגריה" autocomplete="off"></label>
      <label>מלון (לא חובה – החיפוש יהיה סביבו)<input id="wpoi-hotel" placeholder="שם המלון" autocomplete="off"></label>
      <label>רדיוס<select id="wpoi-radius"><option value="1000">1 ק״מ</option><option value="3000" selected>3 ק״מ</option><option value="5000">5 ק״מ</option><option value="10000">10 ק״מ</option><option value="25000">25 ק״מ</option></select></label>
      <button class="wpoi-go" type="submit">חפש מוקדי עניין</button>
    </form>
    <div id="wpoi-hero"></div>
    <nav class="wpoi-cats" id="wpoi-cats" aria-label="קטגוריות"></nav>
    <div id="wpoi-body"><div class="wpoi-msg">הקלידו יעד ולחצו "חפש מוקדי עניין".</div></div>
  </div>
  <footer class="wpoi-bar">
    <span class="wpoi-count" id="wpoi-count">לא נבחרו מקומות</span>
    <button class="wpoi-btn" type="button" id="wpoi-copy">העתק הודעה</button>
    <button class="wpoi-wa" type="button" id="wpoi-send">שלח בוואטסאפ</button>
  </footer>
  <div class="wpoi-toast" id="wpoi-toast" role="status" hidden></div>
</div>`;
    document.body.appendChild(root);

    root.addEventListener('click', e => { if (e.target === root) close(); });
    $('.wpoi-x').onclick = close;
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !root.hidden) close(); });
    $('.wpoi-search').onsubmit = e => { e.preventDefault(); run(); };
    $('#wpoi-copy').onclick = copyMsg;
    $('#wpoi-send').onclick = sendWA;
    $('#wpoi-cats').onclick = e => { const b = e.target.closest('[data-cat]'); if (!b) return; if (b.dataset.cat === 'all') makeGuide(); else loadCat(b.dataset.cat); };
    $('#wpoi-body').addEventListener('change', onBodyChange);
    $('#wpoi-body').addEventListener('input', onBodyInput);
    $('#wpoi-body').addEventListener('click', onBodyClick);
  }

  let toastT;
  function toast(t) { const el = $('#wpoi-toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => el.hidden = true, 3200); }
  function setBody(html) { $('#wpoi-body').innerHTML = html; }

  function renderCats() {
    const chips = CATS.map(c => {
      const n = S.cache[c.id + S.radius];
      return `<button type="button" class="wpoi-chip" data-cat="${c.id}" aria-pressed="${S.cat === c.id}">${c.icon} ${c.label}${n ? `<small>${n.length}</small>` : ''}</button>`;
    }).join('');
    $('#wpoi-cats').innerHTML = `<button type="button" class="wpoi-chip all" data-cat="all">📄 הכל – דף ללקוח</button>` + chips + `<button type="button" class="wpoi-chip sel" data-cat="sel" aria-pressed="${S.cat === 'sel'}">✔ נבחרו והודעה<small>${S.selected.size}</small></button>`;
  }

  function renderHero() {
    const p = S.place, f = S.facts;
    if (!p) { $('#wpoi-hero').innerHTML = ''; return; }
    const { start, end } = S.opts;
    const dates = start ? `${heDate(start)}${end ? '–' + heDate(end) : ''}` : '';
    const dd = v => v === undefined ? '…' : (v || '—');
    const wx = f.wx;
    $('#wpoi-hero').innerHTML = `
<div class="wpoi-pass">
  <div class="wpoi-main">
    <div class="wpoi-route">תל אביב ✈ ${esc(p.country)} ${f.flag || ''}</div>
    <h2>${esc(p.name)}</h2>
    <p class="wpoi-sub">${dates ? 'תאריכי הטיול: ' + dates : 'לא הוזנו תאריכים'}${S.centerLabel !== p.name ? '   |   חיפוש סביב: ' + esc(S.centerLabel) : ''}</p>
    ${f.sum ? `<p class="wpoi-sum">${esc(f.sum.text)}</p>` : ''}
  </div>
  <div class="wpoi-stub"><dl>
    <dt>מטבע</dt><dd>${esc(dd(f.cur))}</dd>
    <dt>הפרש שעות</dt><dd>${esc(dd(f.time))}</dd>
    <dt>נהיגה</dt><dd>${esc(dd(f.drive))}</dd>
    <dt>שפה</dt><dd>${esc(dd(f.lang))}</dd>
    <dt>חגים בטיול</dt><dd>${start ? esc(dd(f.hol)) : 'יש להזין תאריכים'}</dd>
  </dl></div>
</div>
${wx ? `<p class="wpoi-wx-l">מזג אוויר (${esc(wx.label)}): ${esc(wx.text)}</p><div class="wpoi-wx">${wx.days.map(d => `<div class="wpoi-day">${heDate(d.t)}<b>${wxIcon(d.code)}</b>${d.max}°/${d.min}°</div>`).join('')}</div>` : ''}`;
  }

  async function loadFacts() {
    const p = S.place, { start, end } = S.opts, f = S.facts = {};
    const jobs = [
      summary(p).then(r => f.sum = r).catch(() => f.sum = null),
      weather(S.center, start, end).then(w => {
        f.wx = w;
        const tripDate = start ? new Date(start + 'T12:00:00Z') : new Date();
        const a = tzOffsetMin(w.tz, tripDate), b = tzOffsetMin('Asia/Jerusalem', tripDate);
        if (a == null || b == null) f.time = '';
        else { const h = (a - b) / 60; f.time = h === 0 ? 'אותה שעה כמו בישראל' : `${Math.abs(h)} ${Math.abs(h) === 1 ? 'שעה' : 'שעות'} ${h > 0 ? 'קדימה' : 'אחורה'} מישראל`; }
      }).catch(() => { f.wx = null; f.time = ''; }),
      p.cc ? countryInfo(p.cc).then(async c => {
        f.flag = c.flag || '';
        f.drive = c.car && c.car.side ? (c.car.side === 'left' ? 'בצד שמאל ⚠️' : 'בצד ימין') : '';
        f.lang = c.languages ? Object.values(c.languages).slice(0, 2).join(', ') : '';
        const code = c.currencies && Object.keys(c.currencies)[0];
        f.cur = code && code !== 'ILS' ? await rate(code).catch(() => code) : (code ? 'שקל' : '');
      }).catch(() => { f.cur = f.drive = f.lang = ''; }) : Promise.resolve(Object.assign(f, { cur: '', drive: '', lang: '' })),
      start && p.cc ? holidays(p.cc, start, end).then(h => f.hol = h.length ? h.join('; ') : 'אין').catch(() => f.hol = '') : Promise.resolve(f.hol = '')
    ];
    jobs.forEach(j => j.then(() => { if (S.facts === f) { renderHero(); if (S.cat === 'sel') refreshMsg(); } }));
    await Promise.allSettled(jobs);
  }

  async function run() {
    const dest = $('#wpoi-dest').value.trim();
    if (!dest) { $('#wpoi-dest').focus(); toast('הקלידו יעד לחיפוש'); return; }
    S.radius = +$('#wpoi-radius').value;
    S.cache = {};
    setBody('<div class="wpoi-msg">מאתר את היעד…</div>');
    try {
      const place = await geocodeSmart(dest);
      if (!place) { setBody(`<div class="wpoi-msg err">לא נמצא יעד בשם "${esc(dest)}". נסו לכתוב באנגלית או להוסיף את שם המדינה.</div>`); return; }
      S.place = place; S.center = { lat: place.lat, lon: place.lon }; S.centerLabel = place.name;
      const hotel = $('#wpoi-hotel').value.trim();
      if (hotel) {
        const h = await geocode(hotel + ', ' + dest, place).catch(() => null);
        if (h && dist(h, place) < 60000) { S.center = { lat: h.lat, lon: h.lon }; S.centerLabel = hotel; }
        else toast('המלון לא נמצא במפה, החיפוש יהיה סביב מרכז היעד');
      }
      renderHero();
      S.factsP = loadFacts();
      loadCat(S.cat === 'sel' ? 'wiki' : S.cat);
    } catch (e) {
      setBody('<div class="wpoi-msg err">שירות המפות לא זמין כרגע. בדקו חיבור לאינטרנט ונסו שוב בעוד רגע.</div>');
    }
  }

  async function loadCat(id) {
    S.cat = id; S.filter = '';
    renderCats();
    if (id === 'sel') { renderSelected(); return; }
    if (!S.center) { setBody('<div class="wpoi-msg">הקלידו יעד ולחצו "חפש מוקדי עניין".</div>'); return; }
    const key = id + S.radius;
    if (!S.cache[key]) {
      const c = CATS.find(x => x.id === id);
      setBody(`<div class="wpoi-msg">${c.icon} מחפש ${c.label} ברדיוס ${fmtDist(S.radius)}…</div>`);
      try {
        S.cache[key] = id === 'wiki' ? await wikiNearby(S.center, S.radius) : await overpass(c, S.center, S.radius);
      } catch (e) {
        if (S.cat === id) setBody(`<div class="wpoi-msg err">שרת המפות החינמי עמוס כרגע ולא החזיר תשובה. נסו שוב בעוד דקה, או הקטינו את הרדיוס למעלה.<br><button type="button" class="wpoi-btn" data-retry="${id}" style="margin-top:10px">נסה שוב</button></div>`);
        return;
      }
      if (S.cat !== id) return;
      renderCats();
    }
    renderList();
  }

  function itemHTML(p, icon) {
    const on = S.selected.has(p.id);
    return `<label class="wpoi-item${on ? ' on' : ''}" data-id="${esc(p.id)}">
  <input type="checkbox" data-pick="${esc(p.id)}" ${on ? 'checked' : ''} aria-label="בחר ${esc(p.name)}">
  ${p.img ? `<img class="wpoi-thumb" src="${esc(p.img)}" alt="" loading="lazy">` : `<span class="wpoi-thumb">${icon || '📍'}</span>`}
  <span>
    <b>${esc(p.name)}</b>
    <span class="wpoi-meta">${p.famous && !p.img ? '<span class="wpoi-star">★ מוכר</span>' : ''}${p.type ? `<span>${esc(p.type)}</span>` : ''}${p.d != null ? `<span>${fmtDist(p.d)} ממרכז החיפוש</span>` : ''}${p.alt ? `<span dir="auto">${esc(p.alt)}</span>` : ''}</span>
    ${p.desc ? `<p>${esc(p.desc)}</p>` : ''}
    <span class="wpoi-links"><a href="${mapLink(p)}" target="_blank" rel="noopener">מפה</a><a href="${wazeLink(p)}" target="_blank" rel="noopener">Waze</a>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${p.urlLabel}</a>` : ''}${p.phone ? `<a href="tel:${esc(p.phone)}">${esc(p.phone)}</a>` : ''}</span>
  </span>
</label>`;
  }

  function renderList() {
    const list = S.cache[S.cat + S.radius] || [];
    const c = CATS.find(x => x.id === S.cat);
    if (!list.length) {
      setBody(`<div class="wpoi-msg">לא נמצאו ${c.label} ברדיוס ${fmtDist(S.radius)}. נסו להגדיל את הרדיוס למעלה ולחפש שוב.</div>`);
      return;
    }
    setBody(`<div class="wpoi-tools">
      <input type="search" id="wpoi-filter" placeholder="סינון לפי שם…" value="${esc(S.filter)}">
      <button type="button" class="wpoi-btn" data-top="5">סמן 5 מובילים</button>
      <button type="button" class="wpoi-btn" data-clear-cat>נקה בקטגוריה</button>
    </div><div class="wpoi-list" id="wpoi-items"></div>`);
    drawItems();
  }
  function drawItems() {
    const list = S.cache[S.cat + S.radius] || [];
    const c = CATS.find(x => x.id === S.cat);
    const f = S.filter.toLowerCase();
    const shown = f ? list.filter(p => (p.name + ' ' + (p.alt || '') + ' ' + (p.type || '')).toLowerCase().includes(f)) : list;
    $('#wpoi-items').innerHTML = shown.slice(0, 120).map(p => itemHTML(p, c.icon)).join('') || '<div class="wpoi-msg">אין תוצאות לסינון הזה.</div>';
  }

  function findPOI(id) {
    for (const k in S.cache) { const p = S.cache[k].find(x => x.id === id); if (p) return p; }
    return S.selected.get(id);
  }
  function toggle(id, on) {
    const p = findPOI(id); if (!p) return;
    if (on) S.selected.set(id, p); else S.selected.delete(id);
    const row = root.querySelector(`.wpoi-item[data-id="${CSS_ESC(id)}"]`);
    if (row) row.classList.toggle('on', on);
    S.msgDirty = false;
    updateCount(); save();
  }
  const CSS_ESC = s => (window.CSS && window.CSS.escape ? window.CSS.escape(s) : s);
  function updateCount() {
    const n = S.selected.size;
    $('#wpoi-count').textContent = n ? `נבחרו ${n} מקומות` : 'לא נבחרו מקומות';
    const chip = root.querySelector('[data-cat="sel"] small'); if (chip) chip.textContent = n;
  }

  function renderSelected() {
    const list = [...S.selected.values()];
    const o = S.opts;
    const defDays = o.start && o.end ? Math.min(14, Math.max(1, daysBetween(o.start, o.end))) : 3;
    if (!S.days) S.days = defDays;
    const days = S.days;
    const ck = id => S.inc[id] ? 'checked' : '';
    setBody(`
<div class="wpoi-panel">
  <h3>פרטי הלקוח</h3>
  <div class="wpoi-row">
    <input type="text" id="wpoi-name" placeholder="שם הלקוח (חובה)" value="${esc(o.customer || '')}">
    <input type="tel" id="wpoi-phone" placeholder="טלפון לוואטסאפ" value="${esc(o.phone || '')}" dir="ltr">
  </div>
  <div class="wpoi-toggles">
    <label><input type="checkbox" id="wpoi-inc-wx" ${ck('wx')}> מזג אוויר</label>
    <label><input type="checkbox" id="wpoi-inc-cur" ${ck('cur')}> שער מטבע</label>
    <label><input type="checkbox" id="wpoi-inc-time" ${ck('time')}> הפרש שעות</label>
    <label><input type="checkbox" id="wpoi-inc-drive" ${ck('drive')}> צד נהיגה</label>
    <label><input type="checkbox" id="wpoi-inc-hol" ${ck('hol')}> חגים מקומיים</label>
    <label><input type="checkbox" id="wpoi-inc-plan" ${ck('plan')}> לפי ימים</label>
  </div>
</div>
<div class="wpoi-panel">
  <h3>המקומות שנבחרו (${list.length})</h3>
  ${list.length ? `<div class="wpoi-list" style="padding:0">${list.map(p => itemHTML(p)).join('')}</div>` : '<p class="wpoi-msg" style="padding:8px">עוד לא נבחרו מקומות. עברו לקטגוריות למעלה וסמנו.</p>'}
  <div class="wpoi-row" style="margin-top:12px">
    <input type="text" id="wpoi-add" placeholder="הוספת מקום משלך (שם המקום)">
    <button type="button" class="wpoi-btn" id="wpoi-add-btn">הוסף</button>
  </div>
</div>
<div class="wpoi-panel">
  <h3>מסלול לפי ימים</h3>
  <div class="wpoi-row"><span>מספר ימים</span><input type="number" id="wpoi-days" min="1" max="14" value="${days}" style="max-width:90px;flex:0"></div>
  <div id="wpoi-plan"></div>
</div>
<div class="wpoi-panel">
  <h3>ההודעה ללקוח</h3>
  <textarea id="wpoi-text" aria-label="תוכן ההודעה"></textarea>
  <div class="wpoi-row" style="margin-top:8px"><button type="button" class="wpoi-btn" id="wpoi-regen">צור הודעה מחדש</button>${typeof o.onSave === 'function' ? '<button type="button" class="wpoi-btn" id="wpoi-save">שמור בכרטיס הלקוח</button>' : ''}${o.fromQuote || typeof o.onAttach === 'function' ? '<button type="button" class="wpoi-btn" id="wpoi-attach">צרף להודעת הצעת המחיר</button>' : ''}</div>
</div>`);
    drawPlan(); refreshMsg(true);
  }

  function drawPlan() {
    const el = $('#wpoi-plan'); if (!el) return;
    const list = [...S.selected.values()];
    if (list.length < 2) { el.innerHTML = '<p style="color:var(--mut);margin:8px 0 0">בחרו לפחות 2 מקומות כדי לחלק אותם לימים לפי קרבה.</p>'; return; }
    const plan = buildPlan(list, S.days || +$('#wpoi-days').value || 3);
    el.innerHTML = plan.map((d, i) => `<div class="wpoi-day-plan"><h4>יום ${i + 1}</h4><ol>${d.map(p => `<li>${esc(p.name)}</li>`).join('')}</ol><a href="${dirLink(S.center, d)}" target="_blank" rel="noopener">פתח מסלול נסיעה ביום ${i + 1}</a></div>`).join('');
  }

  function firstName(n) { const w = String(n || '').trim().split(/\s+/); return /^משפחת/.test(w[0]) ? w.slice(0, 2).join(' ') : (w[0] || ''); }
  function inc(id) { return !!S.inc[id]; }
  function buildMessage() {
    const name = ($('#wpoi-name') ? $('#wpoi-name').value : S.opts.customer || '').trim();
    const f = S.facts, list = [...S.selected.values()], { start, end } = S.opts;
    const L = [`שלום ${firstName(name)} 👋`, `ריכזתי עבורך מוקדי עניין ב${S.place ? S.place.name : ''} ${f.flag || ''}`.trim()];
    if (start) L.push(`🗓️ ${heDate(start)}${end ? '–' + heDate(end) : ''}`);
    const info = [];
    if (inc('wx') && f.wx) info.push(`🌤️ *מזג אוויר:* ${f.wx.text}`);
    if (inc('cur') && f.cur) info.push(`💶 *מטבע:* ${f.cur}`);
    if (inc('time') && f.time) info.push(`🕒 *שעון:* ${f.time}`);
    if (inc('drive') && f.drive) info.push(`🚗 *נהיגה:* ${f.drive.replace(' ⚠️', '')}`);
    if (inc('hol') && f.hol && f.hol !== 'אין') info.push(`📅 *חגים מקומיים בזמן הטיול:* ${f.hol}`);
    if (info.length) L.push('', ...info);
    if (list.length) {
      L.push('');
      if (inc('plan') && list.length > 1) {
        buildPlan(list, S.days || 3).forEach((d, i) => {
          L.push(`*יום ${i + 1}*`);
          d.forEach(p => L.push(`▫️ ${p.name}${p.type ? ' (' + p.type + ')' : ''}`, mapLink(p)));
          L.push(`🧭 מסלול היום: ${dirLink(S.center, d)}`, '');
        });
      } else {
        L.push('*📍 מה שווה לראות:*');
        list.forEach((p, i) => L.push(`${i + 1}. *${p.name}*${p.type ? ' – ' + p.type : ''}`, mapLink(p)));
        L.push('');
      }
    } else L.push('');
    L.push('נסיעה טובה! ✈️', `${AGENT.name} | ${AGENT.brand}`, AGENT.site);
    return L.join('\n');
  }
  function placesText() {
    const list = [...S.selected.values()];
    if (!list.length) return '';
    const L = [`*📍 מוקדי עניין ב${S.place ? S.place.name : ''}:*`];
    if (inc('plan') && list.length > 1) {
      buildPlan(list, S.days || 3).forEach((d, i) => { L.push(`*יום ${i + 1}*`); d.forEach(p => L.push(`▫️ ${p.name}`, mapLink(p))); });
    } else list.forEach((p, i) => L.push(`${i + 1}. ${p.name}${p.type ? ' – ' + p.type : ''}`, mapLink(p)));
    return L.join('\n');
  }
  function attachToQuote() {
    const text = placesText();
    if (!text) { toast('בחרו קודם מקומות לצירוף'); return; }
    const detail = { text, places: [...S.selected.values()], destination: S.place && S.place.name };
    document.dispatchEvent(new CustomEvent('poi:attach', { detail }));
    if (typeof S.opts.onAttach === 'function') S.opts.onAttach(detail);
    toast('המקומות צורפו להודעת הצעת המחיר ✔');
    setTimeout(close, 1200);
  }
  function refreshMsg(force) {
    const ta = $('#wpoi-text');
    if (ta && (force || !S.msgDirty)) { ta.value = buildMessage(); S.msgDirty = false; }
  }
  function currentMsg() { const ta = $('#wpoi-text'); return ta && S.msgDirty ? ta.value : buildMessage(); }

  function needName() {
    const nameEl = $('#wpoi-name');
    const name = (nameEl ? nameEl.value : S.opts.customer || '').trim();
    if (name) return false;
    if (S.cat !== 'sel') loadCat('sel');
    setTimeout(() => { const el = $('#wpoi-name'); if (el) { el.classList.add('bad'); el.focus(); } }, 30);
    toast('חסר שם לקוח – הכניסו אותו לפני השליחה');
    return true;
  }
  async function copyMsg() {
    if (needName()) return;
    try { await navigator.clipboard.writeText(currentMsg()); toast('ההודעה הועתקה ✔'); }
    catch (e) { if (S.cat !== 'sel') loadCat('sel'); toast('סמנו את הטקסט בתיבת ההודעה והעתיקו ידנית'); }
  }
  function sendWA() {
    if (needName()) return;
    if (!S.selected.size && !confirm('לא נבחרו מקומות. לשלוח רק את פרטי היעד?')) return;
    const phone = waPhone($('#wpoi-phone') ? $('#wpoi-phone').value : S.opts.phone);
    const msg = currentMsg();
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    if (typeof S.opts.onSend === 'function') S.opts.onSend({ message: msg, places: [...S.selected.values()] });
  }

  async function addOwn() {
    const inp = $('#wpoi-add'); const q = inp.value.trim();
    if (!q || !S.place) { inp.focus(); return; }
    toast('מחפש את המקום במפה…');
    try {
      const g = await geocode(`${q}, ${S.place.name}`, S.place) || await geocode(q, S.place);
      if (!g) { toast('המקום לא נמצא. נסו לכתוב את שמו באנגלית'); return; }
      const p = { id: 'u' + Date.now(), name: q, lat: g.lat, lon: g.lon, type: '', desc: '', d: dist(S.center, g) };
      S.selected.set(p.id, p); save(); S.msgDirty = false; updateCount(); renderSelected();
    } catch (e) { toast('שירות המפות לא זמין כרגע'); }
  }

  function onBodyChange(e) {
    const t = e.target;
    if (t.dataset.pick) { toggle(t.dataset.pick, t.checked); if (S.cat === 'sel') renderSelected(); return; }
    if (t.id && t.id.startsWith('wpoi-inc-')) { S.inc[t.id.slice(9)] = t.checked; S.msgDirty = false; refreshMsg(); }
  }
  function onBodyInput(e) {
    const t = e.target;
    if (t.id === 'wpoi-filter') { S.filter = t.value; drawItems(); }
    else if (t.id === 'wpoi-text') S.msgDirty = true;
    else if (t.id === 'wpoi-days') { S.days = Math.min(14, Math.max(1, +t.value || 1)); drawPlan(); refreshMsg(); }
    else if (t.id === 'wpoi-name' || t.id === 'wpoi-phone') {
      t.classList.remove('bad');
      S.opts[t.id === 'wpoi-name' ? 'customer' : 'phone'] = t.value;
      if (t.id === 'wpoi-name') refreshMsg();
    }
  }
  function onBodyClick(e) {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.retry) loadCat(t.dataset.retry);
    else if (t.dataset.top) {
      (S.cache[S.cat + S.radius] || []).slice(0, +t.dataset.top).forEach(p => S.selected.set(p.id, p));
      S.msgDirty = false; updateCount(); save(); drawItems();
    } else if (t.hasAttribute('data-clear-cat')) {
      (S.cache[S.cat + S.radius] || []).forEach(p => S.selected.delete(p.id));
      updateCount(); save(); drawItems();
    } else if (t.id === 'wpoi-add-btn') addOwn();
    else if (t.id === 'wpoi-regen') refreshMsg(true);
    else if (t.id === 'wpoi-attach') attachToQuote();
    else if (t.id === 'wpoi-save') {
      S.opts.onSave({ message: currentMsg(), places: [...S.selected.values()], destination: S.place && S.place.name });
      toast('נשמר בכרטיס הלקוח ✔');
    }
  }


  /* ---------- כפתור "הכל": דף מסודר ללקוח על המקום והסביבה ---------- */
  function guideItems() {
    const out = [];
    const hl = (S.cache['wiki' + S.radius] || []).filter(x => x.desc || x.img).slice(0, 6);
    if (hl.length) out.push({ id: 'wiki', label: 'הכי שווה לראות', icon: '⭐', list: hl });
    CATS.filter(c => c.sel).forEach(c => {
      const used = new Set(out.flatMap(g => g.list.map(x => x.name)));
      const list = (S.cache[c.id + S.radius] || []).filter(x => !used.has(x.name)).slice(0, GUIDE_N[c.id] || 4);
      if (list.length) out.push({ id: c.id, label: c.label, icon: c.icon, list });
    });
    return out;
  }
  function guideText(groups) {
    const name = ($('#wpoi-name') ? $('#wpoi-name').value : S.opts.customer || '').trim();
    const f = S.facts, { start, end } = S.opts, place = S.place ? S.place.name : '';
    const L = [`שלום${name ? ' ' + firstName(name) : ''} 👋`, `הכנתי לך מדריך קצר ל${place} ${f.flag || ''}`.trim()];
    if (start) L.push(`🗓️ ${heDate(start)}${end ? '–' + heDate(end) : ''}`);
    const info = [];
    if (f.wx) info.push(`🌤️ *מזג אוויר:* ${f.wx.text}`);
    if (f.cur) info.push(`💶 *מטבע:* ${f.cur}`);
    if (f.time) info.push(`🕒 *שעון:* ${f.time}`);
    if (f.hol && f.hol !== 'אין') info.push(`📅 *חגים מקומיים:* ${f.hol}`);
    if (info.length) L.push('', ...info);
    groups.forEach(g => {
      L.push('', `*${g.icon} ${g.label}:*`);
      g.list.slice(0, g.id === 'wiki' ? 5 : 3).forEach(p => L.push(`▫️ ${p.name}${p.type ? ' – ' + p.type : ''}`, mapLink(p)));
    });
    L.push('', 'נסיעה טובה! ✈️', `${AGENT.name} | ${AGENT.brand}`, AGENT.site);
    return L.join('\n');
  }
  function guideHTML(groups, partial) {
    const p = S.place, f = S.facts, { start, end } = S.opts;
    const name = ($('#wpoi-name') ? $('#wpoi-name').value : S.opts.customer || '').trim();
    const dates = start ? `${heDate(start)}${end ? ' – ' + heDate(end) : ''}` : '';
    const phone = waPhone($('#wpoi-phone') ? $('#wpoi-phone').value : S.opts.phone);
    const wa = `https://wa.me/${phone}?text=${encodeURIComponent(guideText(groups))}`;
    const facts = [['מזג אוויר', f.wx ? f.wx.text : ''], ['מטבע', f.cur], ['הפרש שעות', f.time], ['שפה', f.lang], ['נהיגה', f.drive], ['חגים בזמן הטיול', start && f.hol && f.hol !== 'אין' ? f.hol : '']].filter(x => x[1]);
    const item = (x, icon) => `<li class="g-it">${x.img ? `<span class="g-th" style="background-image:url('${esc(x.img)}')"></span>` : `<span class="g-ic">${icon}</span>`}<div><b>${esc(x.name)}</b>${x.alt ? ` <small dir="auto">${esc(x.alt)}</small>` : ''}<span class="g-meta">${[x.type, x.d != null ? fmtDist(x.d) + (S.centerLabel !== (p && p.name) ? ' מהמלון' : ' מהמרכז') : ''].filter(Boolean).map(esc).join('   ')}</span>${x.desc ? `<p>${esc(x.desc)}</p>` : ''}<span class="g-links"><a href="${mapLink(x)}" target="_blank" rel="noopener">מפה</a><a href="${wazeLink(x)}" target="_blank" rel="noopener">Waze</a>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.urlLabel || 'אתר')}</a>` : ''}</span></div></li>`;
    return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>מדריך ${esc(p.name)}${name ? ' – ' + esc(name) : ''}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=Secular+One&display=swap">
<style>
:root{--n:#13294b;--o:#f07031;--o2:#fde9dd;--sky:#e8f2fa;--sea:#1f6f9f;--ink:#13294b;--mut:#5d7393;--line:#dbe6f1}
*{box-sizing:border-box}body{margin:0;background:#eef2f8;color:var(--ink);font:16px/1.55 Heebo,Arial,sans-serif}
.g-bar{position:sticky;top:0;z-index:2;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;padding:10px;background:#eef2f8;border-bottom:1px solid var(--line)}
.g-bar button,.g-bar a{font:700 15px Heebo,sans-serif;border:0;border-radius:12px;padding:11px 16px;cursor:pointer;text-decoration:none;color:#fff;background:var(--n)}
.g-bar #g-pdf{background:var(--o)}.g-bar a{background:#1FA855}.g-bar button:disabled{opacity:.6}
.g{max-width:794px;margin:0 auto;background:#fff;overflow:hidden}
.g.pdf{width:794px;max-width:none}
.g-top{display:flex;justify-content:space-between;align-items:center;padding:12px 26px;background:var(--n);color:#fff}
.g-brand{display:flex;align-items:center;gap:10px;font-family:"Secular One",Heebo,sans-serif;font-size:20px}.g-brand img{width:40px;height:auto;display:block}
.g-top small{opacity:.8;font-size:13px}
.g-hero{position:relative;padding:26px 26px 44px;background:linear-gradient(180deg,#13294b 0%,#1f6f9f 62%,#f2a26b 100%);color:#fff;overflow:hidden}
.g-hero:after{content:"";position:absolute;left:-10%;right:-10%;bottom:-40px;height:70px;background:#fff;border-radius:50% 50% 0 0/100% 100% 0 0}
.g-for{margin:0;font-size:15px;opacity:.92}
.g-hero h1{font:400 50px/1.05 "Secular One",Heebo,sans-serif;margin:8px 0 4px}
.g-sub{margin:0;font-size:15px;opacity:.92}
.g-sum{display:flex;gap:16px;align-items:flex-start;padding:4px 26px 18px}
.g-sum p{margin:0;line-height:1.7;font-size:15px;color:#2a4366}
.g-th{width:64px;height:64px;border-radius:12px;flex:none;background:var(--sky) center/cover no-repeat}.g-th.big{width:120px;height:120px;border-radius:16px}
.g-facts{display:grid;grid-template-columns:repeat(3,1fr);margin:0 26px 14px;border:1.5px solid var(--line);border-radius:14px}
.g-facts div{padding:10px 14px;border-inline-start:1.5px dashed var(--line);border-top:1.5px dashed var(--line)}
.g-facts div:nth-child(3n+1){border-inline-start:0}.g-facts div:nth-child(-n+3){border-top:0}
.g-facts span{display:block;font-size:12px;color:var(--mut)}.g-facts b{font-size:15px;font-weight:700}
.g-wx{display:flex;gap:6px;flex-wrap:wrap;padding:0 26px 8px}
.g-wx div{border:1px solid var(--line);border-radius:10px;padding:5px 9px;text-align:center;font-size:13px;min-width:62px}.g-wx b{display:block;font-size:18px}
section{padding:4px 26px 8px}
section h2{display:flex;align-items:center;gap:8px;font:400 22px "Secular One",Heebo,sans-serif;margin:14px 0 10px;padding-bottom:6px;border-bottom:2px dashed var(--line)}
section h2:after{content:"";flex:1}
ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.g-it{display:flex;gap:12px;align-items:flex-start;border:1.5px solid var(--line);border-radius:14px;padding:10px;break-inside:avoid;page-break-inside:avoid;border-inline-start:4px solid var(--o)}
.g-ic{width:64px;height:64px;border-radius:12px;flex:none;background:var(--o2);display:flex;align-items:center;justify-content:center;font-size:26px}
.g-it b{font-size:16px}.g-it small{color:var(--mut)}
.g-meta{display:block;font-size:13px;color:var(--mut)}
.g-it p{margin:4px 0 0;font-size:13.5px;color:#3a4f70}
.g-links{display:flex;gap:14px;margin-top:5px;font-size:14px}.g-links a{color:var(--sea);font-weight:700;text-decoration:underline}
.g-warn{margin:6px 26px 0;padding:10px 14px;border-radius:12px;background:#fdecea;color:#8a1c14;font-size:14px}
.g-foot{margin-top:18px;padding:16px 26px;background:var(--n);color:#fff;font-size:14px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
.g-foot a{color:#ffb489}.g-foot small{flex-basis:100%;opacity:.7;font-size:12px}
@media(max-width:600px){.g:not(.pdf) ul{grid-template-columns:1fr}.g:not(.pdf) .g-facts{grid-template-columns:1fr 1fr}.g:not(.pdf) .g-facts div{border:0;border-top:1.5px dashed var(--line)}.g:not(.pdf) .g-hero h1{font-size:40px}}
@media print{body{background:#fff}.g-bar{display:none}.g{max-width:none}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}section h2{break-after:avoid}}
</style></head><body><div>
</div><div class="g-bar"><button id="g-pdf" type="button">📄 הורדת PDF מעוצב</button><button type="button" onclick="print()">🖨️ הדפסה</button><a href="${esc(wa)}" target="_blank" rel="noopener">💬 סיכום בוואטסאפ</a></div>
<div class="g" id="g-doc">
<div class="g-top"><span class="g-brand"><img src="${LOGO}" alt="">${esc(AGENT.brand)}</span><small>מדריך יעד אישי</small></div>
<div class="g-hero">${name ? `<p class="g-for">הוכן במיוחד עבור <b>${esc(name)}</b></p>` : ''}<h1>${esc(p.name)} ${f.flag || ''}</h1><p class="g-sub">${[p.country, dates, S.centerLabel !== p.name ? 'סביב ' + S.centerLabel : ''].filter(Boolean).map(esc).join('   |   ')}</p></div>
${f.sum ? `<div class="g-sum">${f.sum.img ? `<span class="g-th big" style="background-image:url('${esc(f.sum.img)}')"></span>` : ''}<p>${esc(f.sum.text)}</p></div>` : ''}
${facts.length ? `<div class="g-facts">${facts.map(x => `<div><span>${x[0]}</span><b>${esc(x[1])}</b></div>`).join('')}</div>` : ''}
${f.wx && f.wx.days ? `<div class="g-wx">${f.wx.days.map(d => `<div>${heDate(d.t)}<b>${wxIcon(d.code)}</b>${d.max}°/${d.min}°</div>`).join('')}</div>` : ''}
${partial ? '<p class="g-warn">שרת המפות היה עמוס, ולכן חלק מהקטגוריות חסרות בדף. אפשר לסגור את הדף וללחוץ שוב על "הכל" בעוד דקה.</p>' : ''}
${groups.map(g => `<section><h2>${g.icon} ${esc(g.label)}</h2><ul>${g.list.map(x => item(x, g.icon)).join('')}</ul></section>`).join('')}
<div class="g-foot"><span>${esc(AGENT.name)} | ${esc(AGENT.brand)}</span><a href="https://${esc(AGENT.site)}" target="_blank" rel="noopener">${esc(AGENT.site)}</a><small>המידע נאסף ממקורות פתוחים (OpenStreetMap וויקיפדיה). שעות פתיחה ומחירים עשויים להשתנות – כדאי לבדוק לפני ההגעה.</small></div>
</div>
<script>
(function(){
  var FILE = ${JSON.stringify(('מדריך ' + p.name + (name ? ' - ' + name : '')).replace(/[\\/:*?"<>|]/g, '') + '.pdf')};
  function load(src){return new Promise(function(ok,no){var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s);});}
  var b=document.getElementById('g-pdf');
  b.onclick=async function(){
    var lab=b.textContent;b.disabled=true;b.textContent='מכין PDF…';
    var doc=document.getElementById('g-doc');
    try{
      if(!window.html2pdf) await load('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
      if(document.fonts&&document.fonts.ready) await document.fonts.ready;
      doc.classList.add('pdf');
      await html2pdf().set({
        margin:0, filename:FILE,
        image:{type:'jpeg',quality:0.95},
        html2canvas:{scale:2,useCORS:true,windowWidth:820,backgroundColor:'#ffffff'},
        jsPDF:{unit:'px',format:[794,1123],orientation:'portrait',hotfixes:['px_scaling']},
        pagebreak:{mode:['css','legacy'],avoid:['.g-it','.g-facts','.g-sum','section h2']},
        enableLinks:true
      }).from(doc).save();
      b.textContent='✔ ה-PDF ירד';
    }catch(e){ b.textContent='לא הצלחתי ליצור PDF – נסו "הדפסה" ושמירה כ-PDF'; }
    doc.classList.remove('pdf');
    setTimeout(function(){b.disabled=false;b.textContent=lab;},3500);
  };
})();
</script>
</body></html>`;
  }
  async function makeGuide() {
    if (!S.center || !S.place) { toast('קודם מחפשים יעד ולוחצים "חפש מוקדי עניין"'); return; }
    // פותחים את החלון מיד (אחרת הדפדפן חוסם), וממלאים אחרי שהמידע מגיע
    const w = window.open('', '_blank');
    if (!w) { toast('הדפדפן חסם חלון חדש. אפשרו חלונות קופצים לאתר ונסו שוב'); return; }
    w.document.write('<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>מכין מדריך…</title><body style="font-family:system-ui,Arial;padding:60px 20px;text-align:center;color:#16264A;font-size:18px">✈️ מכין דף מסודר ללקוח…<br><small style="color:#5F6982">זה לוקח בדרך כלל 10–30 שניות</small></body></html>');
    w.document.close();
    toast('מכין דף ללקוח…');
    let partial = false;
    const jobs = [];
    if (!S.cache['wiki' + S.radius]) jobs.push(wikiNearby(S.center, S.radius).then(l => { S.cache['wiki' + S.radius] = l; }).catch(() => {}));
    const need = CATS.filter(c => c.sel && !S.cache[c.id + S.radius]);
    if (need.length) jobs.push(overpassAll(S.center, S.radius).catch(() => { partial = true; }));
    if (S.factsP) jobs.push(S.factsP.catch(() => {}));
    await Promise.all(jobs);
    renderCats();
    if (w.closed) return;
    w.document.open(); w.document.write(guideHTML(guideItems(), partial)); w.document.close();
  }

  /* ---------- per-customer memory (browser only) ---------- */
  const key = () => { const o = S.opts; const k = o.customerId || waPhone(o.phone) || o.customer; return k ? 'wpoi:' + k + ':' + (o.destination || '') : ''; };
  function save() { const k = key(); if (!k) return; try { localStorage.setItem(k, JSON.stringify([...S.selected.values()])); } catch (e) { /* ignore */ } }
  function restore() { S.selected = new Map(); const k = key(); if (!k) return; try { (JSON.parse(localStorage.getItem(k) || '[]')).forEach(p => S.selected.set(p.id, p)); } catch (e) { /* ignore */ } }

  /* ---------- public API ---------- */
  function open(opts) {
    build();
    const o = Object.assign({}, typeof opts === 'function' ? opts() : opts);
    o.start = toISO(o.start); o.end = toISO(o.end);
    const sameTrip = S.opts.destination === o.destination && S.opts.customer === o.customer;
    S.opts = o; S.days = 0; S.msgDirty = false; S.inc.drive = !!o.carRental;
    if (!sameTrip) { S.place = null; S.center = null; S.cache = {}; S.facts = {}; S.cat = 'wiki'; restore(); $('#wpoi-hero').innerHTML = ''; }
    $('#wpoi-dest').value = o.destination || '';
    $('#wpoi-hotel').value = o.hotel || '';
    root.hidden = false; document.documentElement.style.overflow = 'hidden';
    updateCount(); renderCats();
    if (o.destination && !sameTrip) run();
    else if (!o.destination) { setBody('<div class="wpoi-msg">הקלידו יעד ולחצו "חפש מוקדי עניין".</div>'); setTimeout(() => $('#wpoi-dest').focus(), 50); }
  }
  function close() { root.hidden = true; document.documentElement.style.overflow = ''; }

  function readEl(el) {
    const o = el.hasAttribute('data-poi-quote') && lastQuote ? Object.assign({ fromQuote: true }, lastQuote) : {};
    if (el.hasAttribute('data-poi-attach')) o.fromQuote = true;
    ['destination', 'customer', 'phone', 'start', 'end', 'hotel', 'customerId'].forEach(k => {
      const sel = el.dataset[k + 'Field'];
      if (sel) { const f = document.querySelector(sel); const v = f && (f.value || f.textContent || '').trim(); if (v) o[k] = v; }
      else if (el.dataset[k]) o[k] = el.dataset[k];
    });
    return o;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-poi]');
    if (b) { e.preventDefault(); open(readEl(b)); }
  });

  window.WaypointPOI = {
    open, close,
    setQuote: q => { lastQuote = fromQuoteData(q); },
    fromQuote: (q, extra) => open(Object.assign({ fromQuote: true }, fromQuoteData(q), extra || {})),
    placesText: () => placesText()
  };
})();
