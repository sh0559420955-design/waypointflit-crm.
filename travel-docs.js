// travel-docs.js – מסמכי נסיעה ממותגים מתוך ה-PDF של NEXT (כרטיס טיסה + שובר מלון), בעברית ובאנגלית.
// נטען מ-index.html בשורה אחת: <script type="module" src="travel-docs.js"></script>
// מוסיף לכל ליד כפתור "מסמכי נסיעה", קורא את הקבצים בדפדפן (בלי שרת) ושומר את התוצאה בתיק הלקוח.

// ---- פרטי המותג (בהמשך יגיעו מהגדרות המשרד) ----
const BRAND = { name: "WaypointFlit", site: "waypointflit.com", email: "info@waypointflit.com", phone: "", navy: "#13294b", accent: "#f07031", sky: "#e8f2fa" };

// ===================== קריאת הטקסט =====================
const AIR = { "Arkia":"ארקיע","El Al":"אל על","EL AL":"אל על","Israir":"ישראייר","Aegean":"אג'יאן","Wizz":"וויז אייר","Ryanair":"ריינאייר","Blue Bird":"בלו בירד","Bluebird":"בלו בירד","Sky Express":"סקיי אקספרס","Bulgaria Air":"בולגריה אייר","Air Haifa":"אייר חיפה","easyJet":"איזיג'ט","Smartwings":"סמארטווינגס","Pegasus":"פגסוס","Turkish":"טורקיש","Lufthansa":"לופטהנזה","Austrian":"אוסטריאן","Swiss":"סוויס","Air France":"אייר פראנס","LOT":"לוט","TAROM":"טארום","Cyprus":"סייפרוס","Emirates":"אמירייטס","Etihad":"אתיחאד","flydubai":"פליידובאי","Air Europa":"אייר אירופה","Vueling":"וואלינג","Iberia":"איבריה","British":"בריטיש","ITA":"ITA","KLM":"KLM" };
const CITY = { TLV:"תל אביב",ATH:"אתונה",SKG:"סלוניקי",HER:"כרתים",RHO:"רודוס",JMK:"מיקונוס",JTR:"סנטוריני",CFU:"קורפו",PRG:"פראג",BUD:"בודפשט",VIE:"וינה",SOF:"סופיה",VAR:"וארנה",BOJ:"בורגס",PDV:"פלובדיב",LCA:"לרנקה",PFO:"פאפוס",OTP:"בוקרשט",BER:"ברלין",MUC:"מינכן",FRA:"פרנקפורט",ROM:"רומא",FCO:"רומא",CIA:"רומא",MIL:"מילאנו",MXP:"מילאנו",LIN:"מילאנו",BGY:"מילאנו",VCE:"ונציה",TSF:"ונציה",NAP:"נאפולי",PAR:"פריז",CDG:"פריז",ORY:"פריז",NCE:"ניס",AMS:"אמסטרדם",BCN:"ברצלונה",MAD:"מדריד",LIS:"ליסבון",LON:"לונדון",LHR:"לונדון",LTN:"לונדון",STN:"לונדון",LGW:"לונדון",DXB:"דובאי",AUH:"אבו דאבי",IST:"איסטנבול",SAW:"איסטנבול",AYT:"אנטליה",BUS:"בטומי",TBS:"טביליסי",KUT:"קוטאיסי",KRK:"קרקוב",WAW:"ורשה",BTS:"ברטיסלבה",LJU:"לובליאנה",TIV:"טיבט",TGD:"פודגוריצה",TIA:"טירנה",SPU:"ספליט",DBV:"דוברובניק",ZAG:"זאגרב",BEG:"בלגרד",MLA:"מלטה",RAK:"מרקש",BKK:"בנגקוק",HKT:"פוקט",NYC:"ניו יורק",JFK:"ניו יורק",EWR:"ניו יורק",ZRH:"ציריך",GVA:"ז'נבה",SZG:"זלצבורג",INN:"אינסברוק",CTA:"קטניה",PMO:"פלרמו",BRI:"בארי",SVQ:"סביליה",AGP:"מלגה",PMI:"מיורקה",OPO:"פורטו",GYD:"באקו",EVN:"ירוואן" };

const CITY_EN = { Rome:"רומא",Athens:"אתונה",Prague:"פראג",Budapest:"בודפשט",Vienna:"וינה",Sofia:"סופיה",Velingrad:"ולינגרד",Bansko:"בנסקו",Paris:"פריז",London:"לונדון",Barcelona:"ברצלונה",Madrid:"מדריד",Lisbon:"ליסבון",Amsterdam:"אמסטרדם",Berlin:"ברלין",Munich:"מינכן",Milan:"מילאנו",Venice:"ונציה",Naples:"נאפולי",Florence:"פירנצה",Dubai:"דובאי",Istanbul:"איסטנבול",Batumi:"בטומי",Tbilisi:"טביליסי",Larnaca:"לרנקה",Paphos:"פאפוס",Ayia_Napa:"איה נאפה",Thessaloniki:"סלוניקי",Rhodes:"רודוס",Crete:"כרתים",Krakow:"קרקוב",Warsaw:"ורשה",Bucharest:"בוקרשט",Belgrade:"בלגרד",Antalya:"אנטליה",Bangkok:"בנגקוק",Phuket:"פוקט",New_York:"ניו יורק",Zurich:"ציריך",Salzburg:"זלצבורג",Innsbruck:"אינסברוק" };
const cityHe = n => CITY_EN[String(n || "").trim().replace(/ /g, "_")] || n;
// משפטים נפוצים בתנאי מלונות (Expedia ודומיו) – תרגום לעברית; משפט לא מוכר נשאר באנגלית
const TERMS_HE = [
  [/^Know Before You Go\s*/i, ""],
  [/^Information provided by the property may be translated.*$/i, null],
  [/^Information about the type of meals included.*$/i, null],
  [/^unspecified\.?$/i, null],
  [/^There is no front desk at this property\.?$/i, "אין דלפק קבלה במקום."],
  [/^Front desk is open 24\/7\.?$/i, "דלפק הקבלה פתוח 24/7."],
  [/^To make arrangements for check-in please contact the property at least (\d+) hours before arrival.*$/i, "כדי לתאם צ'ק אין יש ליצור קשר עם המקום לפחות $1 שעות לפני ההגעה, לפי פרטי הקשר בהזמנה."],
  [/^Guests will be asked to provide the property with a copy of their government-issued photo ID.*$/i, "לפני ההגעה המקום יבקש צילום של תעודה מזהה עם תמונה (למשל דרכון)."],
  [/^Guests will receive an email within (\d+) hours before arrival with check-in instructions and an access code\.?$/i, "עד $1 שעות לפני ההגעה יישלח דוא\"ל עם הוראות צ'ק אין וקוד כניסה."],
  [/^Guests will receive an email.*check-in instructions.*$/i, "לפני ההגעה יישלח דוא\"ל עם הוראות צ'ק אין."],
  [/^Guests can access their accommodation through a private entrance\.?$/i, "הכניסה ליחידה היא דרך כניסה פרטית."],
  [/^Cash transactions at this property cannot exceed ([A-Z]{3})\s?([\d,.]+).*$/i, "לפי חוק מקומי, אי אפשר לשלם במקום במזומן יותר מ-$2 $1."],
  [/^For further details, please contact the property.*$/i, "לפרטים נוספים אפשר לפנות למקום לפי פרטי הקשר בהזמנה."],
  [/^The property has connecting\/adjoining rooms.*$/i, "יש במקום חדרים מחוברים, בכפוף לזמינות – אפשר לבקש מול המלון."],
  [/^Check-in and check-out times.*$/i, null]
];
function termsFor(list, lang) {
  const seen = new Set(), out = [];
  list.forEach(x => String(x).split(/(?<=\.)\s+(?=[A-Z])/).forEach(s => {
    s = clean(s); if (!s) return;
    let he = s, drop = false;
    for (const [re, v] of TERMS_HE) { if (!re.test(s)) continue; if (v === null) { drop = true; break; } if (v === "") { s = clean(s.replace(re, "")); he = s; continue; } he = s.replace(re, v); break; }
    if (drop || !s) return;
    const v = lang === "he" ? he : s, k = v.toLowerCase(); if (seen.has(k)) return; seen.add(k);
    out.push({ t: v, en: !/[א-ת]/.test(v) });
  }));
  return out;
}

const clean = s => String(s ?? "").replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "").replace(/[ \t\u00a0]+/g, " ").trim();
const fixParens = s => String(s).replace(/\)([^()]*)\(/g, "($1)");
const lines = t => t.split("\n").map(clean).filter(Boolean);
// ערך של שדה עם תווית בעברית – בלי תלות בצד שבו הערך מופיע
const lab = (L, re) => { const x = L.find(y => re.test(y)); return x ? clean(x.replace(re, " ").replace(/:/g, " ")) : ""; };
const between = (t, a, b) => { const i = t.search(a); if (i < 0) return ""; const r = t.slice(i); const j = r.slice(1).search(b); return j < 0 ? r : r.slice(0, j + 1); };

function parseBag(s) {
  s = fixParens(s).replace(/^[-–•]\s*|\s*[-–]$/g, "").trim();
  const b = { kind: /תיק יד/.test(s) ? "hand" : /טרולי/.test(s) && !/לא טרולי/.test(s) ? "trolley" : "bag" };
  const d = s.match(/(\d{2}\s*x\s*\d{2}\s*x\s*\d{2})/i); if (d) b.dims = d[1].replace(/\s/g, "");
  const kg = s.match(/(\d+)\s*ק["'״”׳]?ג/); if (kg) b.kg = +kg[1];
  const q = s.match(/(\d+)\s*(?:מזוודות|מזוודה|טרולים)/); b.qty = q ? +q[1] : (/אחת|אחד/.test(s) ? 1 : 0);
  b.onePax = /לנוסע אחד בלבד/.test(s); b.perPax = /לכל נוסע/.test(s); b.noTrolley = /לא טרולי/.test(s);
  return b;
}

export function parseTicket(raw) {
  const t = raw.replace(/\u00a0/g, " "), L = lines(t);
  const o = { kind: "flight", pax: [], flights: [], cond: null, notes: {} };
  let m;
  if ((m = t.match(/Reservation\s*#?\s*:?\s*(\d+)/i))) o.res = m[1];
  if ((m = t.match(/Airline\s*#\s*:?\s*([A-Z0-9]{5,8})/))) o.pnr = m[1];
  if ((m = t.match(/Status\s*:?\s*([A-Za-z]+)/))) o.status = m[1];
  if ((m = t.match(/Fare Type\s*:?\s*([^)\n]+)/))) o.fare = clean(m[1]);
  for (const x of t.split("\n")) {
    const p = x.match(/\b(MRS|MR|MS|MSTR|MISS|DR)?\s*\/?\s*(ADT|CHD|CNN|INF|YTH)\s+(.+?)\s+(\d{2}\/\d{2}\/\d{4})\s+(.*)$/);
    if (!p) continue;
    let nm = p[3].trim().split(/\s{2,}/), last, first;
    if (nm.length >= 2) { last = nm[0]; first = nm.slice(1).join(" "); } else { nm = clean(p[3]).split(" "); last = nm[0]; first = nm.slice(1).join(" "); }
    o.pax.push({ title: p[1] || "", type: p[2], last: clean(last), first: clean(first), dob: p[4], ticket: clean(p[5]) });
  }
  L.forEach((x, i) => {
    if (!/^Flight \d+:/.test(x)) return;
    let end = L.findIndex((y, j) => j > i && (/^Flight \d+:/.test(y) || /תנאי שינוי/.test(y))); if (end < 0) end = L.length;
    const seg = L.slice(i + 1, end), J = seg.join("\n"), f = {};
    const at = k => seg.findIndex(y => y === k);
    const di = at("Details"), dp = at("Departure"), ar = at("Arrival");
    if (di >= 0) f.airline = seg[di + 1];
    f.no = ((J.match(/Flight No\.?\s*([A-Z0-9]{2}\s?\d{1,4})/) || [])[1] || "").replace(/\s/g, "");
    f.cls = (seg.find(y => /Class$/i.test(y)) || "").replace(/\s*Class$/i, "");
    f.dur = (J.match(/Duration:\s*(\d{1,2}:\d{2})/) || [])[1] || "";
    if (dp >= 0) { f.from = seg[dp + 1]; f.dt = seg[dp + 2]; f.fromAp = seg[dp + 3]; }
    if (ar >= 0) { f.to = seg[ar + 1]; f.at = seg[ar + 2]; f.toAp = seg[ar + 3]; }
    ["fromAp", "toAp"].forEach(k => { if (f[k] && /[א-ת]|^(Departure|Arrival)$/.test(f[k])) f[k] = ""; });
    f.bags = seg.filter(y => /תיק יד|מזוודה|טרולי/.test(y)).map(parseBag);
    if (f.from && f.to) o.flights.push(f);
  });
  // תנאי שינוי וביטול: ארבעה ערכים לפי סדר העמודות
  const cs = between(t, /תנאי שינוי וביטול/, /ויזות ודרכונים|צ'ק אין לטיסה|בחירת מושבים|מדיניות ביטול והחזרים/).replace(/\s+/g, " ");
  if (cs) {
    const tok = [...cs.matchAll(/קנס \+ הפרש מחיר|לא ניתן לשינוי|בתשלום קנס|ללא עלות|ללא קנס|לא ניתן לביטול|ניתן לביטול|ניתן לשינוי/g)].map(x => x[0]);
    const can = tok.filter(x => /ביטול/.test(x)), chg = tok.filter(x => !/ביטול/.test(x));
    o.cond = { date: chg[0] || "", route: chg[1] || "", name: chg[2] || "", cancel: can[can.length - 1] || "", byAirline: /בהתאם לתנאי/.test(cs) };
  }
  const N = o.notes;
  if (/ויזות ודרכונים/.test(t)) N.visa = 1;
  if (/צ'ק אין לטיסה/.test(t)) N.checkin = { paid: /צ'ק אין בשדה התעופה הינו בתשלום/.test(t), h: +((t.match(/אונליין\s+(\d{1,3})/) || [])[1] || 0) };
  if (/בחירת מושבים/.test(t)) N.seats = 1;
  if (/לא יוגשו ארוחות/.test(t)) N.food = 1;
  if (/No Show|אי הגעה לטיסה/.test(t)) N.noshow = 1;
  if (/אימות שעת הטיסה/.test(t)) N.verify = 1;
  if (/עדכונים מחברת התעופה/.test(t)) N.updates = 1;
  if ((m = t.match(/\$\s?(\d+)\s*(לאדם|לחדר)/))) N.refund = { fee: +m[1], per: m[2] === "לחדר" ? "room" : "pax" };
  return o;
}

export function parseHotel(raw) {
  const t = raw.replace(/\u00a0/g, " "), L = lines(t);
  const o = { kind: "hotel", rooms: [], cancel: [], fees: [], terms: [] };
  let m;
  if ((m = t.match(/Reservation\s*#?\s*:?\s*(\d+)/i))) o.res = m[1];
  if ((m = t.match(/Confirmation\s*:?\s*([A-Z0-9-]{4,})/i))) o.conf = m[1];
  if ((m = t.match(/Status\s*:?\s*([A-Za-z]+)/))) o.status = m[1];
  o.name = lab(L, /שם מלון/);
  const head = L.find(y => o.name && y.startsWith(o.name + ",")) || "";
  const hp = head.slice(o.name.length + 1).split(",").map(clean).filter(Boolean);
  o.city = hp[0] || ""; o.country = hp[1] || "";
  o.address = clean(lab(L, /כתובת/).replace(/[()]?\s*הצגה על המפה\s*[()]?/, ""));
  const ph = (lab(L, /טלפון/).match(/\+?[\d][\d\- ]{6,}\d/) || [])[0] || "";
  o.phone = ph ? (/^\+/.test(ph) ? ph : /^\d{1,3}-\d{6,}$/.test(ph) ? "+" + ph : ph) : "";
  o.email = ((L.find(y => /דוא"ל|Email/i.test(y)) || "").match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [])[0] || "";
  const ds = between(t, /צ'ק אין/, /פרטי חדר/);
  const dd = ds.match(/\d{2}\/\d{2}\/\d{2,4}/g) || [], tt = ds.match(/\b\d{1,2}:\d{2}\b/g) || [];
  o.ci = dd[0] || ""; o.co = dd[1] || ""; o.ciT = tt[0] || ""; o.coT = tt[1] || "";
  if (!o.ciT && (m = t.match(/Check in from (\d{1,2}:\d{2})/i))) o.ciT = m[1];
  if (!o.coT && (m = t.match(/Check out until (\d{1,2}:\d{2})/i))) o.coT = m[1];
  const nl = ds.split("\n").map(clean).find(y => (y.match(/\d{2}\/\d{2}\/\d{2,4}/g) || []).length >= 2) || "";
  o.nights = +((nl.match(/(?:^|\s)(\d{1,2})\s*$/) || [])[1] || 0) || nightsBetween(o.ci, o.co);
  const F = { type: /סוג חדר/, board: /בסיס אירוח/, occ: /הרכב החדר/, bed: /סוג מיטה/, guest: /אורח ראשי/, appr: /אישור(?!ים)/ };
  const starts = L.map((y, i) => F.type.test(y) ? i : -1).filter(i => i >= 0);
  if (starts.length <= 1) { const r = {}; for (const k in F) r[k] = lab(L, F[k]); o.rooms.push(r); }
  else starts.forEach((s, n) => { const seg = L.slice(s, starts[n + 1] || L.length), r = {}; for (const k in F) r[k] = lab(seg, F[k]) || lab(L, F[k]); o.rooms.push(r); });
  o.rooms.forEach(r => { r.appr = (r.appr.match(/[A-Z0-9-]{4,}/i) || [""])[0]; });
  L.forEach(y => {
    if (!/מתאריך|עד לתאריך|עד תאריך/.test(y) || /והחזרים/.test(y)) return;
    const d = (y.match(/\d{2}\/\d{2}\/\d{2,4}/) || [])[0]; if (!d) return;
    const tm = (y.match(/\b\d{1,2}:\d{2}\b/) || [])[0] || "";
    const rest = clean(y.replace(/מתאריך|עד לתאריך|עד תאריך|בשעה/g, " ").replace(d, " ").replace(tm, " "));
    o.cancel.push({ from: /מתאריך/.test(y), date: d, time: tm, text: rest });
  });
  L.forEach(y => {
    if (!/(EUR|USD|GBP|ILS|€|\$)/.test(y) || !/(Tax|Fee|מס|עמלה)/i.test(y) || /דמי טיפול|לאדם|לחדר/.test(y)) return;
    const a = y.match(/(?:[\d.,]+\s*(?:EUR|USD|GBP|ILS)|[€$]\s?[\d.,]+)(?:\s*\(~?[^)]*\))?/);
    if (a) o.fees.push({ amount: clean(a[0]), name: clean(y.replace(a[0], " ")) });
  });
  const ts = between(t, /תנאים והגבלות/, /מדיניות ביטול והחזרים/).split("\n").slice(1);
  let cur = null;
  ts.forEach(y => { y = clean(y); if (!y) return; if (/^•/.test(y)) { cur = clean(y.slice(1)); if (cur) o.terms.push(cur); } else if (o.terms.length && cur !== null) o.terms[o.terms.length - 1] += " " + y; });
  o.terms = o.terms.filter(x => x && !/^Check in from/i.test(x));
  const em = between(t, /קו חירום/, /Booking Date|Powered by/);
  if (em) { const g = em.slice(8).match(/\d+/g) || []; const gg = g.filter(x => x !== "24" && x !== "7"); if (gg.join("").length >= 9) o.emergency = "+" + gg.join("-"); }
  if ((m = t.match(/Booking Date\s*:?\s*(\d{2}\/\d{2}\/\d{2,4})/i))) o.booked = m[1];
  if ((m = t.match(/\$\s?(\d+)\s*(לאדם|לחדר)/))) o.refund = { fee: +m[1], per: m[2] === "לחדר" ? "room" : "pax" };
  return o;
}

export function parseDoc(text) {
  if (/Hotel Voucher|שם מלון/.test(text)) return parseHotel(text);
  if (/E-?Ticket|Flight \d+:/.test(text)) return parseTicket(text);
  return null;
}

// ===================== תצוגה =====================
function toISO(d) { const m = String(d || "").match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/); if (!m) return ""; let y = +m[3]; if (y < 100) y += 2000; return y + "-" + m[2].padStart(2, "0") + "-" + m[1].padStart(2, "0"); }
function nightsBetween(a, b) { a = toISO(a); b = toISO(b); return a && b ? Math.round((new Date(b) - new Date(a)) / 864e5) : 0; }
const hm = s => (String(s || "").match(/(\d{1,2}:\d{2})/) || [])[1] || "";
const code = s => (String(s || "").match(/\(([A-Z]{3})\)/) || [])[1] || "";
const plain = s => clean(String(s || "").replace(/\s*\([A-Z]{3}\)\s*/, ""));
const E = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const heAir = a => { const k = Object.keys(AIR).sort((x, y) => y.length - x.length).find(k => String(a).toLowerCase().includes(k.toLowerCase())); return k ? AIR[k] : a; };

const T = {
  he: { dir: "rtl", title: "מסמכי נסיעה", for: "תיק הנסיעה של", codes: "המספרים שחשוב לשמור", pnr: "קוד הזמנה בחברת התעופה", pnrHint: "לצ'ק אין אונליין ובשדה", res: "מספר הזמנה", conf: "מספר אישור במלון", confHint: "להציג בקבלה", conf2: "מספר אישור הזמנה", pax: "נוסעים", name: "שם", type: "סוג", dob: "תאריך לידה", ticket: "כרטיס", flights: "טיסות", out: "הלוך", back: "חזור", flight: "טיסה", dur: "משך", cls: "מחלקה", fare: "סוג כרטיס", bags: "כבודה", cond: "תנאי שינוי וביטול של חברת התעופה", cDate: "שינוי תאריכים", cRoute: "שינוי מסלול", cName: "שינוי שם נוסע", cCancel: "ביטול כרטיס", byAir: "בהתאם לתנאי חברת התעופה", hotel: "מלון", addr: "כתובת", map: "פתיחה במפה", phone: "טלפון", email: "דוא\"ל", ci: "צ'ק אין", co: "צ'ק אאוט", from: "מהשעה", until: "עד השעה", nights: "לילות", room: "חדר", rType: "סוג חדר", board: "בסיס אירוח", occ: "הרכב", bed: "מיטות", guest: "אורח ראשי", appr: "אישור", cancel: "מדיניות ביטול", fromD: "מתאריך", untilD: "עד", fees: "לתשלום ישירות במלון", terms: "תנאים מהמלון", termsNote: "כפי שנמסרו על ידי המלון", info: "חשוב לדעת", refund: "ביטולים והחזרים", emerg: "קו חירום 24/7 – רק אם המלון לא מוצא את ההזמנה", contact: "לכל שאלה, שינוי או ביטול – אנחנו כאן", status: { Approved: "מאושר", Confirmed: "מאושר" }, adt: "מבוגר", chd: "ילד", inf: "תינוק", booked: "תאריך הזמנה", issued: "הופק" },
  en: { dir: "ltr", title: "Travel Documents", for: "Travel file for", codes: "Numbers to keep handy", pnr: "Airline booking code", pnrHint: "for online and airport check-in", res: "Reservation no.", conf: "Hotel confirmation no.", confHint: "show at reception", conf2: "Booking confirmation no.", pax: "Passengers", name: "Name", type: "Type", dob: "Date of birth", ticket: "Ticket", flights: "Flights", out: "Outbound", back: "Return", flight: "Flight", dur: "Duration", cls: "Class", fare: "Fare", bags: "Baggage", cond: "Airline change & cancellation rules", cDate: "Date change", cRoute: "Route change", cName: "Name change", cCancel: "Cancellation", byAir: "Subject to airline rules", hotel: "Hotel", addr: "Address", map: "Open in maps", phone: "Phone", email: "Email", ci: "Check-in", co: "Check-out", from: "from", until: "until", nights: "Nights", room: "Room", rType: "Room type", board: "Board", occ: "Occupancy", bed: "Beds", guest: "Lead guest", appr: "Confirmation", cancel: "Cancellation policy", fromD: "From", untilD: "Until", fees: "Payable directly at the hotel", terms: "Hotel terms", termsNote: "as provided by the hotel", info: "Good to know", refund: "Cancellations & refunds", emerg: "24/7 emergency line – only if the hotel cannot find your booking", contact: "Questions, changes or cancellations – we're here for you", status: { Approved: "Approved", Confirmed: "Confirmed" }, adt: "Adult", chd: "Child", inf: "Infant", booked: "Booked on", issued: "Issued" }
};
const PH = {
  "קנס + הפרש מחיר": ["קנס + הפרש מחיר", "Penalty + fare difference"], "לא ניתן לשינוי": ["לא ניתן", "Not allowed"], "בתשלום קנס": ["בתשלום קנס", "Penalty applies"],
  "ללא עלות": ["ללא עלות", "Free"], "ללא קנס": ["ללא קנס", "No penalty"], "לא ניתן לביטול": ["לא ניתן לביטול", "Non-refundable"], "ניתן לביטול": ["ניתן לביטול", "Refundable"], "ניתן לשינוי": ["ניתן לשינוי", "Allowed"],
  "ללא אפשרות ביטול": ["ללא אפשרות ביטול", "Non-refundable"], "ביטול בחינם": ["ביטול בחינם", "Free cancellation"],
  "חדר בלבד": ["חדר בלבד", "Room only"], "לינה בלבד": ["לינה בלבד", "Room only"], "ארוחת בוקר": ["ארוחת בוקר", "Breakfast"], "חצי פנסיון": ["חצי פנסיון", "Half board"], "פנסיון מלא": ["פנסיון מלא", "Full board"], "הכל כלול": ["הכל כלול", "All inclusive"]
};
const ph = (s, lang) => { s = clean(s); const k = Object.keys(PH).find(k => s === k || s.includes(k)); if (k) return PH[k][lang === "en" ? 1 : 0]; if (lang === "en" && /^[$€]?\s?[\d.,]+/.test(s)) return "Cancellation fee " + s; if (lang === "he" && /^[$€]?\s?[\d.,]+/.test(s)) return "דמי ביטול " + s; return s; };
const occT = (s, lang) => lang === "en" ? clean(s).replace(/(\d+)\s*מבוגרים?/, "$1 adults").replace(/(\d+)\s*ילדים?/, "$1 children").replace(/(\d+)\s*תינוק(?:ות)?/, "$1 infants").replace(/\s*ו-?\s*/, ", ") : s;

function fmtDate(iso, lang, opt) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (lang === "en") return d.toLocaleDateString("en-GB", Object.assign({ weekday: "short", day: "numeric", month: "short", year: "numeric" }, opt || {}));
  return "יום " + ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"][d.getDay()] + " " + iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4);
}
const cityName = (s, lang) => lang === "he" ? (CITY[code(s)] || plain(s)) : plain(s);

function bagText(b, lang) {
  const he = lang === "he";
  if (b.kind === "hand") return he ? "תיק יד קטן לכל נוסע" + (b.noTrolley ? " (לא טרולי)" : "") + (b.dims ? " עד " + b.dims + " ס\"מ" : "") : "Small personal item per passenger" + (b.noTrolley ? " (no trolley)" : "") + (b.dims ? ", up to " + b.dims + " cm" : "");
  const n = b.qty || 1, kg = b.kg ? (he ? " עד " + b.kg + " ק\"ג" : " up to " + b.kg + " kg") : "";
  if (b.kind === "trolley") return he ? (n > 1 ? n + " טרולים" : "טרולי") + kg + (b.onePax ? " – לנוסע אחד בלבד" : " לכל נוסע") : (n > 1 ? n + " cabin trolleys" : "Cabin trolley") + kg + (b.onePax ? " – for one passenger only" : " per passenger");
  return he ? (n > 1 ? n + " מזוודות" : "מזוודה אחת") + kg + (b.onePax ? " – לנוסע אחד בלבד" : b.perPax ? " לכל נוסע" : "") : (n > 1 ? n + " checked bags" : "1 checked bag") + kg + (b.onePax ? " – for one passenger only" : b.perPax ? " per passenger" : "");
}

function notesList(fl, lang) {
  const he = lang === "he", out = [];
  const N = Object.assign({}, ...fl.map(f => f.notes || {}));
  const air = fl[0] && fl[0].flights[0] ? fl[0].flights[0].airline : "", pnr = fl.map(f => f.pnr).filter(Boolean)[0] || "";
  const airN = he ? heAir(air) : air;
  if (N.checkin) out.push(he
    ? (N.checkin.paid ? "צ'ק אין בדלפק בשדה כרוך בתשלום לחברת התעופה, לכן מומלץ מאוד לעשות צ'ק אין אונליין. " : "מומלץ לעשות צ'ק אין אונליין. ") + (N.checkin.h ? "הצ'ק אין נפתח " + N.checkin.h + " שעות לפני ההמראה" : "הצ'ק אין נעשה") + (airN ? " באתר או באפליקציה של " + airN : "") + (pnr ? ", עם קוד ההזמנה " + pnr : "") + "."
    : (N.checkin.paid ? "Airport check-in is charged by the airline, so online check-in is strongly recommended. " : "Online check-in is recommended. ") + (N.checkin.h ? "It opens " + N.checkin.h + " hours before departure" : "Check in") + (airN ? " on the " + airN + " website or app" : "") + (pnr ? ", using booking code " + pnr : "") + ".");
  if (N.verify) out.push(he ? "48–72 שעות לפני ההמראה כדאי לוודא ששעת הטיסה לא השתנתה, באתר חברת התעופה או בלוח ההמראות של השדה." : "48–72 hours before departure, check that the flight time hasn't changed on the airline website or the airport departures board.");
  if (N.updates) out.push(he ? "עדכונים על שינויים בטיסה נשלחים בדוא\"ל לכתובת שנמסרה בהזמנה – כדאי לבדוק את תיבת הדואר, כולל ספאם." : "Flight change notices are sent by email to the address given at booking – keep an eye on your inbox, including spam.");
  if (N.seats) out.push(he ? "בחירת מושבים מראש כרוכה בתשלום ונעשית רק באתר חברת התעופה או במוקד השירות שלה." : "Advance seat selection is charged and can only be made on the airline website or through its call centre.");
  if (N.food) out.push(he ? "בטיסות האלה לא מוגשים אוכל ושתייה – כדאי להצטייד מראש." : "No food or drinks are served on these flights – bring your own snacks.");
  if (N.noshow) out.push(he ? "אם לא מגיעים לאחת הטיסות, כל הטיסות הבאות בהזמנה מתבטלות אוטומטית וללא החזר. אם אתם לא מתכוונים לטוס באחת הטיסות – עדכנו אותנו מראש." : "If you miss one flight, all following flights in the booking are cancelled automatically with no refund. If you won't take a flight, let us know in advance.");
  if (N.visa) out.push(he ? "רוב המדינות דורשות דרכון בתוקף לפחות 6 חודשים מיום הטיסה. באחריות הנוסעים לבדוק אם נדרשת ויזה ליעד או למדינת מעבר בקונקשן." : "Most countries require a passport valid for at least 6 months from the travel date. Please check whether a visa is needed for your destination or any transit country.");
  return out;
}

const svg = p => '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>";
const IC = {
  plane: svg('<path d="M10.5 21l1.5-1v-5l7 2v-2l-7-4V5.5a1.5 1.5 0 0 0-3 0V11l-7 4v2l7-2v5l1.5 1z" fill="currentColor"/>'),
  bed: svg('<path d="M3 18V7m0 7h18m0 4v-6a3 3 0 0 0-3-3h-8v6M7 11.5a1.5 1.5 0 1 0 0-.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  bag: svg('<path d="M7 7h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm2 0V5h6v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  info: svg('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6M12 7.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>')
};

export function renderDocs(data, lang, brand) {
  const L = T[lang] || T.he, he = lang === "he", B = Object.assign({}, BRAND, brand || {});
  const fl = data.items.filter(x => x.kind === "flight"), ho = data.items.filter(x => x.kind === "hotel");
  const allF = fl.flatMap(f => f.flights);
  const dest = allF.length ? cityName(allF[0].to, lang) : ho[0] ? (he ? cityHe(ho[0].city) : ho[0].city) : "";
  const d1 = allF.length ? toISO(allF[0].dt) : ho[0] ? toISO(ho[0].ci) : "", d2 = allF.length > 1 ? toISO(allF[allF.length - 1].dt) : ho[0] ? toISO(ho[0].co) : "";
  const pax = fl.flatMap(f => f.pax);
  const lat = pax[0] ? pax[0].first + " " + pax[0].last : ho[0] && ho[0].rooms[0] ? ho[0].rooms[0].guest : "";
  const who = !he && /[א-ת]/.test(data.customer || "") && lat ? lat : data.customer || (pax[0] ? pax[0].first + " " + pax[0].last : ho[0] && ho[0].rooms[0] ? ho[0].rooms[0].guest : "");
  const st = s => (L.status[s] || s || "");
  let h = '<article class="td-sheet" dir="' + L.dir + '" lang="' + lang + '" style="--nv:' + B.navy + ";--or:" + B.accent + ";--sky:" + B.sky + '">';
  h += '<header class="td-top"><div class="td-brand">' + (B.logo ? '<img src="' + E(B.logo) + '" alt="">' : "") + "<span>" + E(B.name) + '</span></div><div class="td-doc">' + E(L.title) + "</div></header>";
  h += '<section class="td-hero"><p class="td-for">' + E(L.for) + " <b>" + E(who) + '</b></p><h2 class="td-dest">' + E(dest) + '</h2><p class="td-dates">' + E([fmtDate(d1, lang), fmtDate(d2, lang)].filter(Boolean).join(he ? " – " : " – ")) + "</p></section>";
  // מספרים חשובים
  const codes = [];
  fl.forEach(f => { if (f.pnr) codes.push([L.pnr, f.pnr, L.pnrHint, true]); });
  ho.forEach(x => {
    const nm = ho.length > 1 ? " – " + x.name : "", ap = [...new Set(x.rooms.map(r => r.appr).filter(Boolean))];
    if (ap.length) { codes.push([L.conf + nm, ap.join(" / "), L.confHint, true]); if (x.conf) codes.push([L.conf2 + nm, x.conf, "", false]); }
    else if (x.conf) codes.push([L.conf + nm, x.conf, L.confHint, true]);
  });
  [...fl, ...ho].forEach(x => { if (x.res) codes.push([L.res + " (" + (x.kind === "flight" ? L.flights : L.hotel) + ")", x.res, st(x.status), false]); });
  if (codes.length) h += '<section class="td-codes"><h3>' + E(L.codes) + '</h3><div class="td-cgrid">' + codes.map(c => '<div class="td-code' + (c[3] ? " big" : "") + (String(c[1]).length > 9 ? " long" : "") + '"><span>' + E(c[0]) + "</span><b dir=\"ltr\">" + E(c[1]) + "</b>" + (c[2] ? "<small>" + E(c[2]) + "</small>" : "") + "</div>").join("") + "</div></section>";
  // נוסעים
  if (pax.length) h += '<section class="td-sec"><h3>' + E(L.pax) + '</h3><div class="td-scroll"><table class="td-tbl"><thead><tr><th>' + [L.name, L.type, L.dob, L.ticket].map(E).join("</th><th>") + "</th></tr></thead><tbody>" + pax.map(p => "<tr><td dir=\"ltr\"><b>" + E(p.first + " " + p.last) + "</b></td><td>" + E(p.type === "ADT" ? L.adt : p.type === "INF" ? L.inf : L.chd) + '</td><td dir="ltr">' + E(p.dob) + '</td><td dir="ltr">' + E(p.ticket) + "</td></tr>").join("") + "</tbody></table></div></section>";
  // טיסות
  if (allF.length) {
    h += '<section class="td-sec"><h3>' + IC.plane + E(L.flights) + (fl[0] && fl[0].fare ? ' <small class="td-fare">' + E(L.fare) + ": " + E(fl[0].fare) + "</small>" : "") + "</h3>";
    allF.forEach((f, i) => {
      const lab = allF.length === 2 ? (i ? L.back : L.out) : L.flight + " " + (i + 1);
      h += '<div class="td-flight"><div class="td-fhead"><span class="td-tag">' + E(lab) + "</span><b>" + E(fmtDate(toISO(f.dt), lang)) + "</b><span>" + E((he ? heAir(f.airline) : f.airline) + (f.no ? " · " + f.no : "")) + "</span></div>";
      h += '<div class="td-route" dir="' + L.dir + '"><div><span class="td-code3">' + E(code(f.from)) + '</span><b class="td-time">' + E(hm(f.dt)) + "</b><span>" + E(cityName(f.from, lang)) + "</span><small>" + E(f.fromAp || "") + "</small></div>";
      h += '<div class="td-line"><i></i>' + IC.plane + "<i></i>" + (f.dur ? "<small>" + E(L.dur + " " + f.dur) + "</small>" : "") + "</div>";
      h += '<div><span class="td-code3">' + E(code(f.to)) + '</span><b class="td-time">' + E(hm(f.at)) + (toISO(f.at) && toISO(f.at) !== toISO(f.dt) ? "<sup>+1</sup>" : "") + "</b><span>" + E(cityName(f.to, lang)) + "</span><small>" + E(f.toAp || "") + "</small></div></div>";
      if (f.cls) h += '<p class="td-meta">' + E(L.cls + ": " + (he && /Economy/i.test(f.cls) ? "תיירים" : f.cls)) + "</p>";
      if (f.bags && f.bags.length) h += '<ul class="td-bags">' + f.bags.map(b => "<li>" + IC.bag + "<span>" + E(bagText(b, lang)) + "</span></li>").join("") + "</ul>";
      h += "</div>";
    });
    const c = fl.map(f => f.cond).find(Boolean);
    if (c) h += '<div class="td-cond"><h4>' + E(L.cond) + '</h4><div class="td-cgrid4">' + [[L.cDate, c.date], [L.cRoute, c.route], [L.cName, c.name], [L.cCancel, c.cancel]].map(x => "<div><span>" + E(x[0]) + "</span><b>" + E(ph(x[1], lang) || "–") + "</b></div>").join("") + "</div>" + (c.byAirline ? "<small>" + E(L.byAir) + "</small>" : "") + "</div>";
    h += "</section>";
  }
  // מלונות
  ho.forEach(x => {
    h += '<section class="td-sec td-hotel"><h3>' + IC.bed + E(L.hotel) + "</h3><h2 dir=\"ltr\">" + E(x.name) + "</h2>";
    const q = encodeURIComponent([x.name, x.address].filter(Boolean).join(", "));
    h += '<p class="td-addr">' + (x.address ? '<span dir="ltr">' + E(x.address) + '</span> <a href="https://www.google.com/maps/search/?api=1&query=' + q + '" target="_blank" rel="noopener">' + E(L.map) + "</a>" : "") + "</p>";
    const ct = [x.phone && [L.phone, '<a dir="ltr" href="tel:' + E(x.phone.replace(/[^\d+]/g, "")) + '">' + E(x.phone) + "</a>"], x.email && [L.email, '<a href="mailto:' + E(x.email) + '">' + E(x.email) + "</a>"]].filter(Boolean);
    if (ct.length) h += '<p class="td-meta">' + ct.map(c => E(c[0]) + ": " + c[1]).join(" &nbsp; ") + "</p>";
    h += '<div class="td-stay"><div><span>' + E(L.ci) + "</span><b>" + E(fmtDate(toISO(x.ci), lang)) + "</b>" + (x.ciT ? "<small>" + E(L.from + " " + x.ciT) + "</small>" : "") + '</div><div class="td-n"><b>' + E(x.nights || "") + "</b><span>" + E(L.nights) + "</span></div><div><span>" + E(L.co) + "</span><b>" + E(fmtDate(toISO(x.co), lang)) + "</b>" + (x.coT ? "<small>" + E(L.until + " " + x.coT) + "</small>" : "") + "</div></div>";
    x.rooms.forEach((r, i) => {
      const rows = [[L.rType, r.type, 1], [L.board, ph(r.board, lang)], [L.occ, occT(r.occ, lang)], [L.bed, r.bed, 1], [L.guest, r.guest, 1], [L.appr, r.appr, 1]].filter(y => y[1]);
      h += '<div class="td-room"><h4>' + E(L.room + (x.rooms.length > 1 ? " " + (i + 1) : "")) + "</h4><dl>" + rows.map(y => "<div><dt>" + E(y[0]) + "</dt><dd" + (y[2] ? ' dir="ltr"' : "") + ">" + E(y[1]) + "</dd></div>").join("") + "</dl></div>";
    });
    if (x.cancel.length) h += '<div class="td-sub"><h4>' + E(L.cancel) + "</h4><ul>" + x.cancel.map(c => "<li><b>" + E((c.from ? L.fromD : L.untilD) + " " + c.date + (c.time ? " " + c.time : "")) + "</b> – " + E(ph(c.text, lang)) + "</li>").join("") + "</ul></div>";
    if (x.fees.length) h += '<div class="td-sub"><h4>' + E(L.fees) + "</h4><ul>" + x.fees.map(f => "<li><b dir=\"ltr\">" + E(f.amount) + "</b> – " + E(he && /Mandatory Tax/i.test(f.name) ? "מס חובה (Mandatory Tax)" : he && /City|Property/i.test(f.name) ? "מס עיר (" + f.name + ")" : f.name) + "</li>").join("") + "</ul></div>";
    const tm = termsFor(x.terms, lang);
    if (tm.length) h += '<div class="td-sub td-terms"><h4>' + E(L.terms) + " <small>(" + E(he ? "תורגם מהמקור באנגלית" : L.termsNote) + ")</small></h4><ul>" + tm.map(y => "<li" + (y.en ? ' dir="ltr"' : "") + ">" + E(y.t) + "</li>").join("") + "</ul></div>";
    if (x.emergency) h += '<p class="td-emerg">' + E(L.emerg) + ': <a dir="ltr" href="tel:' + E(x.emergency.replace(/[^\d+]/g, "")) + '">' + E(x.emergency) + "</a></p>";
    h += "</section>";
  });
  const notes = notesList(fl, lang);
  if (notes.length) h += '<section class="td-sec td-info"><h3>' + IC.info + E(L.info) + "</h3><ul>" + notes.map(n => "<li>" + E(n) + "</li>").join("") + "</ul></section>";
  const rf = [...fl.map(f => f.notes && f.notes.refund), ...ho.map(x => x.refund)].filter(Boolean);
  if (rf.length) {
    const fees = rf.map(r => he ? "$" + r.fee + (r.per === "room" ? " לחדר" : " לנוסע") : "$" + r.fee + (r.per === "room" ? " per room" : " per passenger"));
    h += '<section class="td-sec td-small"><h4>' + E(L.refund) + "</h4><p>" + E(he
      ? "ביטול ושינוי כפופים לתנאי הספק. החזר כספי, אם מגיע, מועבר לאמצעי התשלום המקורי תוך כ-30–90 יום מבקשת ההחזר, בניכוי עלויות סליקה, ריבית והפרשי שער (כ-2.5% מסכום העסקה) ודמי טיפול של " + [...new Set(fees)].join(" / ") + ". שירותי התיירות מתומחרים בדולרים; בתשלום בשקלים נקבע השער ביום החיוב, ובביטול ההחזר מומר לשקלים לפי השער ביום ההחזר, כך שהסכום עשוי להשתנות."
      : "Changes and cancellations are subject to supplier terms. Any refund is returned to the original payment method within about 30–90 days of the request, minus clearing, interest and exchange costs (about 2.5% of the booking) and a handling fee of " + [...new Set(fees)].join(" / ") + ". Travel services are priced in US dollars; payments in shekels use the rate on the charge date, and refunds are converted at the rate on the refund date, so amounts may differ.") + "</p></section>";
  }
  const bk = ho.map(x => x.booked).find(Boolean);
  h += '<footer class="td-foot"><b>' + E(L.contact) + "</b><span>" + [B.name, B.phone && '<a dir="ltr" href="tel:' + E(B.phone) + '">' + E(B.phone) + "</a>", B.email && '<a href="mailto:' + E(B.email) + '">' + E(B.email) + "</a>", B.site && '<a href="https://' + E(B.site) + '" target="_blank" rel="noopener">' + E(B.site) + "</a>"].filter(Boolean).join(" | ") + "</span><small>" + E(L.issued + " " + new Date().toLocaleDateString(he ? "he-IL" : "en-GB") + (bk ? " · " + L.booked + " " + bk : "")) + "</small></footer>";
  return h + "</article>";
}

export function waSummary(data, lang, first) {
  const he = lang === "he", L = [];
  const fl = data.items.filter(x => x.kind === "flight"), ho = data.items.filter(x => x.kind === "hotel");
  L.push((he ? "היי" : "Hi") + (first ? " " + first : "") + " 👋", he ? "מצורפים פרטי הנסיעה שלך ✈️" : "Here are your travel details ✈️", "");
  fl.forEach(f => {
    if (f.pnr) L.push((he ? "✈️ קוד הזמנה בחברת התעופה: *" : "✈️ Airline booking code: *") + f.pnr + "*");
    f.flights.forEach((x, i) => L.push((f.flights.length === 2 ? (i ? (he ? "חזור" : "Return") : (he ? "הלוך" : "Outbound")) : (he ? "טיסה " : "Flight ") + (i + 1)) + ": " + fmtDate(toISO(x.dt), lang) + " | " + cityName(x.from, lang) + " " + hm(x.dt) + (he ? " ← " : " → ") + cityName(x.to, lang) + " " + hm(x.at) + " (" + (he ? heAir(x.airline) : x.airline) + (x.no ? " " + x.no : "") + ")"));
    const b = (f.flights[0] && f.flights[0].bags || []).map(y => "🧳 " + bagText(y, lang)); L.push(...b, "");
  });
  ho.forEach(x => {
    L.push("🏨 *" + x.name + "*");
    const c = x.conf || (x.rooms[0] && x.rooms[0].appr); if (c) L.push((he ? "מספר אישור: *" : "Confirmation: *") + c + "*");
    L.push((he ? "צ'ק אין " : "Check-in ") + fmtDate(toISO(x.ci), lang) + (x.ciT ? (he ? " מ-" : " from ") + x.ciT : "") + " | " + (he ? "צ'ק אאוט " : "Check-out ") + fmtDate(toISO(x.co), lang) + (x.coT ? (he ? " עד " : " until ") + x.coT : ""), "");
  });
  L.push(he ? "📄 המסמך המלא מצורף כקובץ PDF." : "📄 The full document is attached as a PDF.", he ? "נסיעה טובה! 😊" : "Have a great trip! 😊", BRAND.name, BRAND.site);
  return L.join("\n").replace(/\n{3,}/g, "\n\n");
}

// ===================== חיבור ל-CRM =====================
const CSS = `
.td-sheet{--ink:#1d2b45;--mut:#5d7393;--line:#d9e3ef;background:#fff;color:var(--ink);font:15px/1.5 Heebo,Arial,sans-serif;border-radius:18px;overflow:hidden;box-shadow:0 18px 40px -24px rgba(19,41,75,.6);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.td-sheet h2,.td-sheet h3,.td-sheet h4{margin:0}
.td-top{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 20px;background:var(--nv);color:#fff}
.td-brand{display:flex;align-items:center;gap:8px;font-weight:800;font-size:18px}.td-brand img{width:40px;height:auto}
.td-doc{font-size:13px;opacity:.85}
.td-hero{padding:22px 20px 26px;background:linear-gradient(170deg,var(--nv) 0%,#1f5f8f 70%,#2c78a8 100%);color:#fff;position:relative}
.td-hero:after{content:"";position:absolute;left:0;right:0;bottom:0;height:6px;background:repeating-linear-gradient(90deg,var(--or) 0 22px,transparent 22px 34px)}
.td-for{margin:0;font-size:14px;opacity:.9}
.td-dest{font-family:"Secular One",Heebo,sans-serif;font-weight:400;font-size:clamp(38px,9vw,58px);line-height:1.05;margin:6px 0 2px}
.td-dates{margin:0;font-size:15px;opacity:.9}
.td-codes{padding:16px 20px;background:var(--sky);border-bottom:2px dashed #c3d4e8}
.td-codes h3{font-size:14px;color:var(--mut);font-weight:600;margin-bottom:8px}
.td-cgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
.td-code{background:#fff;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:2px}
.td-code span{font-size:12px;color:var(--mut)}.td-code b{font-size:18px;letter-spacing:.5px;text-align:start}.td-code small{font-size:12px;color:var(--mut)}
.td-code.big{border:2px solid var(--or)}.td-code.long b{font-size:17px!important;overflow-wrap:anywhere}.td-code.big b{font-size:26px;color:var(--or);font-family:"Secular One",Heebo,sans-serif;font-weight:400}
.td-sec{padding:18px 20px;border-bottom:1px solid var(--line);break-inside:avoid}
.td-sec h3{display:flex;align-items:center;gap:8px;font-family:"Secular One",Heebo,sans-serif;font-weight:400;font-size:20px;color:var(--nv);margin-bottom:10px}
.td-sec h3 svg{width:22px;height:22px;color:var(--or)}
.td-fare{font-family:Heebo,sans-serif;font-size:13px;color:var(--mut);font-weight:500}
.td-scroll{overflow-x:auto}
.td-tbl{width:100%;border-collapse:collapse;font-size:14px}.td-tbl th{font-size:12px;color:var(--mut);font-weight:600;text-align:start;padding:4px 8px;border-bottom:1px solid var(--line)}
.td-tbl td{padding:8px;border-bottom:1px solid #eef2f8;text-align:start;white-space:nowrap}
.td-flight{border:1.5px solid var(--line);border-radius:14px;padding:12px 14px;margin-bottom:12px;break-inside:avoid}
.td-fhead{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;font-size:14px}.td-fhead span:last-child{color:var(--mut);margin-inline-start:auto}
.td-tag{background:var(--nv);color:#fff;border-radius:999px;padding:1px 10px;font-size:12px;font-weight:700}
.td-route{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;margin:12px 0 6px}
.td-route>div:not(.td-line){display:flex;flex-direction:column;gap:1px}.td-route>div:last-child{text-align:end}
.td-code3{font-size:13px;color:var(--mut);font-weight:600;letter-spacing:1px}
.td-time{font-family:"Secular One",Heebo,sans-serif;font-weight:400;font-size:30px;line-height:1;color:var(--nv)}.td-time sup{font-size:12px;color:var(--or)}
.td-route small{font-size:12px;color:var(--mut)}
.td-line{display:flex;align-items:center;gap:4px;color:var(--or);position:relative;min-width:90px}.td-line i{flex:1;border-top:2px dashed #c3d4e8}.td-line svg{width:20px;height:20px}
.td-line svg{transform:rotate(90deg)}[dir=rtl] .td-line svg{transform:rotate(-90deg)}
.td-sheet [dir]{unicode-bidi:isolate}
.td-line small{position:absolute;top:22px;left:0;right:0;text-align:center;color:var(--mut);font-size:11px}
.td-meta{margin:6px 0 0;font-size:13px;color:var(--mut)}.td-meta a{color:var(--nv)}
.td-bags{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:6px}
.td-bags li{display:flex;gap:8px;align-items:flex-start;font-size:14px}.td-bags svg{width:18px;height:18px;flex:none;color:var(--or);margin-top:2px}
.td-cond{background:#f6f9fc;border-radius:12px;padding:12px 14px}.td-cond h4{font-size:14px;margin-bottom:8px}.td-cond>small{display:block;margin-top:6px;color:var(--mut);font-size:12px}
.td-cgrid4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.td-cgrid4 div{display:flex;flex-direction:column;gap:2px}.td-cgrid4 span{font-size:12px;color:var(--mut)}.td-cgrid4 b{font-size:14px}
.td-hotel>h2{font-size:22px;color:var(--nv);text-align:start;margin-bottom:4px}
.td-addr{margin:0;font-size:14px}.td-addr a{color:var(--or);font-weight:600;margin-inline-start:6px}
.td-stay{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;background:var(--sky);border-radius:14px;padding:12px 14px;margin:12px 0}
.td-stay div{display:flex;flex-direction:column}.td-stay div:last-child{text-align:end}.td-stay span{font-size:12px;color:var(--mut)}.td-stay b{font-size:16px}.td-stay small{font-size:13px;color:var(--nv);font-weight:600}
.td-n{align-items:center;background:#fff;border-radius:50%;width:62px;height:62px;justify-content:center;text-align:center!important}.td-n b{font-family:"Secular One",Heebo,sans-serif;font-weight:400;font-size:24px;line-height:1;color:var(--or)}.td-n span{font-size:11px}
.td-room h4,.td-sub h4{font-size:14px;margin:10px 0 6px;color:var(--nv)}
.td-room dl{margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px 14px}.td-room dt{font-size:12px;color:var(--mut)}.td-room dd{margin:0;font-weight:600;text-align:start}
.td-sub ul{margin:0;padding-inline-start:18px;font-size:14px}.td-sub li{margin:3px 0}
.td-terms ul{font-size:13px;color:#4a5f80}.td-sheet[dir=rtl] li[dir=ltr]{text-align:left}
.td-sheet[dir=rtl] .td-hotel>h2,.td-sheet[dir=rtl] .td-code b,.td-sheet[dir=rtl] td[dir=ltr],.td-sheet[dir=rtl] dd[dir=ltr]{text-align:right}.td-terms h4 small{font-weight:400;color:var(--mut)}
.td-emerg{margin:12px 0 0;font-size:13px;background:#fff4ec;border-radius:10px;padding:8px 10px}.td-emerg a{color:var(--nv);font-weight:700}
.td-info ul{margin:0;padding-inline-start:18px;display:grid;gap:6px;font-size:14px}
.td-small h4{font-size:13px;color:var(--mut);margin-bottom:4px}.td-small p{margin:0;font-size:12px;color:var(--mut);line-height:1.6}
.td-foot{padding:14px 20px;background:var(--nv);color:#fff;display:flex;flex-direction:column;gap:3px;font-size:14px}.td-foot a{color:#fff}.td-foot small{opacity:.7;font-size:12px}
@media(max-width:560px){.td-cgrid4{grid-template-columns:1fr 1fr}.td-time{font-size:26px}.td-line{min-width:60px}}
body.td-printing .td-sheet{max-width:none!important;border-radius:0!important;box-shadow:none!important}
@media print{.td-multi .td-flight,.td-multi .td-stay,.td-multi .td-codes,.td-multi .td-cond,.td-multi .td-room,.td-multi .td-hero,.td-multi .td-foot,.td-multi .td-emerg{break-inside:avoid}}
@media print{body.td-printing{margin:0!important;padding:0!important;border:0!important;background:#fff!important}body.td-printing #tdm{padding:0!important;overflow:visible!important}body.td-printing #tdm .box{max-width:none!important;margin:0!important;padding:0!important;background:none!important}}
#tdm .tdl{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0}#tdm .tdl .on{background:var(--pri);color:var(--onpri);border-color:var(--pri)}
`;

let cur = { id: null, lead: null, data: null, lang: "he" }, fb = null;
async function FB() {
  if (!fb) { const ag = await import("./auth-guard.js"); const fs = await import("https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js"); fb = { db: ag.db, doc: fs.doc, getDoc: fs.getDoc, updateDoc: fs.updateDoc }; }
  return fb;
}
const $ = id => document.getElementById(id);
const brandNow = () => { const img = document.querySelector(".tk-brand img"); return img ? { logo: img.src } : {}; };

function draw() {
  const has = cur.data && cur.data.items.length;
  $("td_acts").hidden = !has;
  $("td_out").innerHTML = has ? renderDocs(Object.assign({ customer: (cur.lead && cur.lead.name) || "" }, cur.data), cur.lang, brandNow()) : "";
  document.querySelectorAll("#tdm [data-lang]").forEach(b => b.classList.toggle("on", b.dataset.lang === cur.lang));
  if (has) { const l = cur.lead || {}; let p = String(l.phone || "").replace(/\D/g, ""); if (p.startsWith("0")) p = "972" + p.slice(1); $("td_wa").href = "https://wa.me/" + p + "?text=" + encodeURIComponent(waSummary(cur.data, cur.lang, String(l.name || "").trim().split(/\s+/)[0])); }
}
async function save() {
  if (!cur.id) return;
  try { const f = await FB(); await f.updateDoc(f.doc(f.db, "leads", cur.id), { travelDocs: JSON.parse(JSON.stringify(Object.assign({}, cur.data, { lang: cur.lang, t: Date.now() }))) }); }
  catch (e) { $("td_st").textContent += " (לא נשמר בתיק הלקוח – בדקו הרשאות)"; }
}
async function openFor(id) {
  cur = { id, lead: null, data: { items: [] }, lang: "he" };
  $("td_st").textContent = ""; $("td_f").value = ""; $("tdm").classList.add("on"); draw();
  try { const f = await FB(); const s = await f.getDoc(f.doc(f.db, "leads", id)); if (s.exists()) { cur.lead = s.data(); const d = cur.lead.travelDocs; if (d && d.items) { cur.data = { items: d.items }; cur.lang = d.lang || "he"; } draw(); } } catch (e) {}
}
async function readFiles() {
  const files = [...$("td_f").files]; if (!files.length) { $("td_st").textContent = "בחרו קובץ PDF אחד או יותר"; return; }
  const { pdfToText } = await import("./pdf-quote.js");
  $("td_go").disabled = true; $("td_st").textContent = "קורא את המסמכים...";
  let ok = 0; const bad = [];
  for (const file of files) {
    try {
      const o = parseDoc(await pdfToText(file));
      if (!o) { bad.push(file.name); continue; }
      cur.data.items = cur.data.items.filter(x => !(x.kind === o.kind && x.res && x.res === o.res)).concat([o]); ok++;
    } catch (e) { bad.push(file.name); }
  }
  cur.data.items.sort((a, b) => (a.kind === "flight" ? 0 : 1) - (b.kind === "flight" ? 0 : 1));
  $("td_st").textContent = (ok ? "✅ נקראו " + ok + " מסמכים. בדקו את הפרטים לפני השליחה." : "") + (bad.length ? " לא זיהיתי: " + bad.join(", ") : "");
  $("td_go").disabled = false; draw(); if (ok) save();
}
// הדפסה על A4 ברוחב מלא – בלי שוליים לבנים רחבים.
// המסמך מתרחב ומוקטן אוטומטית כדי להיכנס בעמוד אחד; אם הוא ארוך מדי
// (צריך להקטין מתחת ל-70% – כבר לא נוח לקריאה) הוא ממשיך לעמוד הבא ברוחב מלא.
export function printLong(sheet) {
  if (!sheet) return () => {};
  document.body.classList.add("td-printing");
  const MM = 96 / 25.4, M = 5, PW = (210 - 2 * M) * MM, PH = (297 - 2 * M) * MM - 6, MIN = 0.7;
  const old = sheet.getAttribute("style");
  const set = (k, v) => sheet.style.setProperty(k, v, "important");
  set("max-width", "none"); set("min-width", "0"); set("margin", "0"); set("zoom", "1"); set("box-sizing", "border-box");
  let s = 1;
  for (let i = 0; i < 6; i++) {
    set("width", PW / s + "px");
    const ns = Math.min(1, PH / sheet.scrollHeight);
    if (Math.abs(ns - s) < 0.004) { s = ns; break; }
    s = ns;
    if (s < MIN) break;
  }
  if (s < MIN) s = 1;
  set("width", PW / s + "px"); set("zoom", String(s));
  if (s === 1 && sheet.scrollHeight > PH) sheet.classList.add("td-multi");
  const st = document.createElement("style"); st.id = "td-page";
  st.textContent = "@page{size:A4;margin:" + M + "mm}";
  document.head.appendChild(st);
  return () => {
    document.body.classList.remove("td-printing"); st.remove(); sheet.classList.remove("td-multi");
    if (old == null) sheet.removeAttribute("style"); else sheet.setAttribute("style", old);
  };
}
function boot() {
  const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
  const m = document.createElement("div"); m.className = "modal"; m.id = "tdm";
  m.innerHTML = '<div class="box" style="max-width:860px"><div class="mtop noprint"><span>✈️ מסמכי נסיעה</span><button class="btn sec" id="td_close" type="button">סגירה</button></div>' +
    '<div class="xbox noprint" style="display:grid;gap:8px"><p>מעלים את כרטיסי הטיסה ושובר המלון מ-NEXT – אפשר כמה קבצים יחד, והם מתאחדים למסמך אחד.</p><input type="file" id="td_f" accept="application/pdf" multiple><div><button class="btn" id="td_go" type="button">קריאה ועיצוב</button> <span class="stat" id="td_st"></span></div></div>' +
    '<div class="tdl noprint" id="td_acts" hidden><button class="btn sec" data-lang="he" type="button">עברית</button><button class="btn sec" data-lang="en" type="button">English</button><button class="btn" id="td_print" type="button">הדפסה / שמירה כ-PDF</button><a class="btn sec" id="td_wa" href="#" target="_blank" rel="noopener">סיכום בוואטסאפ</a><button class="btn sec" id="td_clear" type="button" style="color:var(--danger)">ניקוי</button></div>' +
    '<div id="td_out"></div></div>';
  document.body.appendChild(m);
  $("td_close").addEventListener("click", () => { m.classList.remove("on"); cur.id = null; });
  $("td_go").addEventListener("click", readFiles);
  m.addEventListener("click", e => { const b = e.target.closest("[data-lang]"); if (b) { cur.lang = b.dataset.lang; draw(); save(); } });
  $("td_print").addEventListener("click", () => {
    const q = $("qm"), qo = q && q.classList.contains("on"); if (qo) q.classList.remove("on");
    const done = printLong(document.querySelector("#td_out .td-sheet"));
    window.addEventListener("afterprint", () => { done(); if (qo) q.classList.add("on"); }, { once: true });
    try { window.print(); } catch (e) { done(); }
  });
  $("td_clear").addEventListener("click", e => { const b = e.currentTarget; if (!b.dataset.armed) { b.dataset.armed = "1"; b.textContent = "למחוק?"; return; } delete b.dataset.armed; b.textContent = "ניקוי"; cur.data = { items: [] }; draw(); save(); });
  const list = $("list"); if (!list) return;
  const add = () => list.querySelectorAll("article.lead").forEach(a => { const acts = a.querySelector(".acts"); if (acts && !acts.querySelector(".tdb")) { const b = document.createElement("button"); b.type = "button"; b.className = "link tdb"; b.textContent = "✈️ מסמכי נסיעה"; acts.appendChild(b); } });
  new MutationObserver(add).observe(list, { childList: true }); add();
  list.addEventListener("click", e => { const b = e.target.closest(".tdb"); if (b) openFor(b.closest(".lead").dataset.id); });
}
if (typeof document !== "undefined") { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot(); }
