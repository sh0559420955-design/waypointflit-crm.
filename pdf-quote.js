// pdf-quote.js – קריאת הצעת מחיר מ-PDF (פלטפורמת NEXT) בלי AI ובלי שרת.
// מחלץ טקסט עם pdf.js בדפדפן, מזהה את הפרטים ובונה הודעת וואטסאפ בסגנון WaypointFlit.
const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
const loadJS = src => new Promise((ok, no) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });

export async function pdfToText(file) {
  if (!window.pdfjsLib) await loadJS(PDFJS + "pdf.min.js");
  if (!window.pdfjsWorker) await loadJS(PDFJS + "pdf.worker.min.js");
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js";
  const doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  let t = "";
  for (let i = 1; i <= Math.min(doc.numPages, 10); i++) {
    const c = await (await doc.getPage(i)).getTextContent();
    t += c.items.map(x => x.str + (x.hasEOL ? "\n" : " ")).join("") + "\n\n";
  }
  return t;
}

const AIR = { "Arkia":"ארקיע","El Al":"אל על","EL AL":"אל על","Israir":"ישראייר","Aegean":"אג'יאן","Wizz":"וויז אייר","Ryanair":"ריינאייר","Blue Bird":"בלו בירד","Bluebird":"בלו בירד","Sky Express":"סקיי אקספרס","Bulgaria Air":"בולגריה אייר","Air Haifa":"אייר חיפה","easyJet":"איזיג'ט","Smartwings":"סמארטווינגס","Pegasus":"פגסוס","Turkish":"טורקיש","Lufthansa":"לופטהנזה","Austrian":"אוסטריאן","Swiss":"סוויס","ITA":"ITA","Air France":"אייר פראנס","KLM":"KLM","LOT":"לוט","TAROM":"טארום","Cyprus":"סייפרוס","Emirates":"אמירייטס","Etihad":"אתיחאד","flydubai":"פליידובאי","Air Europa":"אייר אירופה","Vueling":"וואלינג","Iberia":"איבריה","British":"בריטיש","Wizz Air":"וויז אייר" };
const CITY = { TLV:"תל אביב",ATH:"אתונה",SKG:"סלוניקי",HER:"כרתים",RHO:"רודוס",JMK:"מיקונוס",JTR:"סנטוריני",CFU:"קורפו",PRG:"פראג",BUD:"בודפשט",VIE:"וינה",SOF:"סופיה",VAR:"וארנה",BOJ:"בורגס",PDV:"פלובדיב",LCA:"לרנקה",PFO:"פאפוס",OTP:"בוקרשט",BER:"ברלין",MUC:"מינכן",FRA:"פרנקפורט",ROM:"רומא",FCO:"רומא",MXP:"מילאנו",LIN:"מילאנו",BGY:"מילאנו",VCE:"ונציה",NAP:"נאפולי",PAR:"פריז",CDG:"פריז",ORY:"פריז",NCE:"ניס",AMS:"אמסטרדם",BCN:"ברצלונה",MAD:"מדריד",LIS:"ליסבון",LON:"לונדון",LHR:"לונדון",LTN:"לונדון",STN:"לונדון",LGW:"לונדון",DXB:"דובאי",AUH:"אבו דאבי",IST:"איסטנבול",SAW:"איסטנבול",AYT:"אנטליה",BUS:"בטומי",TBS:"טביליסי",KRK:"קרקוב",WAW:"ורשה",BTS:"ברטיסלבה",LJU:"לובליאנה",TIV:"טיבט",TGD:"פודגוריצה",TIA:"טירנה",SPU:"ספליט",DBV:"דוברובניק",ZAG:"זאגרב",BEG:"בלגרד",MLA:"מלטה",RAK:"מרקש",BKK:"בנגקוק",HKT:"פוקט",NYC:"ניו יורק",JFK:"ניו יורק",EWR:"ניו יורק",ZRH:"ציריך",GVA:"ז'נבה",SZG:"זלצבורג",INN:"אינסברוק",TSF:"ונציה",CTA:"קטניה",PMO:"פלרמו",BRI:"בארי",SVQ:"סביליה",AGP:"מלגה",PMI:"מיורקה",OPO:"פורטו",BUH:"בוקרשט",KUT:"קוטאיסי",GYD:"באקו",EVN:"ירוואן" };
const COUNTRY = { Greece:"יוון","Czech Republic":"צ'כיה",Czechia:"צ'כיה",Hungary:"הונגריה",Austria:"אוסטריה",Bulgaria:"בולגריה",Cyprus:"קפריסין",Romania:"רומניה",Germany:"גרמניה",Italy:"איטליה",France:"צרפת",Netherlands:"הולנד",Spain:"ספרד",Portugal:"פורטוגל","United Kingdom":"אנגליה","United Arab Emirates":"איחוד האמירויות",Turkey:"טורקיה",Türkiye:"טורקיה",Georgia:"גאורגיה",Poland:"פולין",Slovakia:"סלובקיה",Slovenia:"סלובניה",Montenegro:"מונטנגרו",Albania:"אלבניה",Croatia:"קרואטיה",Serbia:"סרביה",Malta:"מלטה",Morocco:"מרוקו",Thailand:"תאילנד",Switzerland:"שווייץ","United States":"ארה\"ב",USA:"ארה\"ב",Azerbaijan:"אזרבייג'ן",Armenia:"ארמניה" };
// שמות ערים באנגלית (מכתובת המלון) → עברית. אפשר להוסיף ערים לפי הצורך.
const CITY_EN = { Athens:"אתונה",Thessaloniki:"סלוניקי",Heraklion:"הרקליון",Chania:"חאניה",Rethymno:"רתימנו",Rhodes:"רודוס",Mykonos:"מיקונוס",Santorini:"סנטוריני",Fira:"סנטוריני",Corfu:"קורפו",Halkidiki:"חלקידיקי",Kassandra:"חלקידיקי",Loutraki:"לוטרקי",Prague:"פראג",Praha:"פראג","Karlovy Vary":"קרלובי וארי","Cesky Krumlov":"צ'סקי קרומלוב",Budapest:"בודפשט",Vienna:"וינה",Wien:"וינה",Salzburg:"זלצבורג",Innsbruck:"אינסברוק",Sofia:"סופיה",Velingrad:"ולינגרד",Bansko:"בנסקו",Borovets:"בורובץ",Pamporovo:"פמפורובו",Varna:"וארנה","Golden Sands":"גולדן סנדס",Burgas:"בורגס","Sunny Beach":"סאני ביץ'",Nessebar:"נסבר",Plovdiv:"פלובדיב",Larnaca:"לרנקה",Paphos:"פאפוס",Limassol:"לימסול","Ayia Napa":"איה נאפה",Protaras:"פרוטרס",Bucharest:"בוקרשט",Brasov:"בראשוב",Berlin:"ברלין",Munich:"מינכן",Frankfurt:"פרנקפורט",Rome:"רומא",Roma:"רומא",Milan:"מילאנו",Milano:"מילאנו","Lake Como":"אגם קומו",Como:"קומו","Lake Garda":"אגם גארדה",Verona:"ורונה",Venice:"ונציה",Venezia:"ונציה",Florence:"פירנצה",Firenze:"פירנצה",Pisa:"פיזה",Naples:"נאפולי",Napoli:"נאפולי",Sorrento:"סורנטו",Amalfi:"אמלפי",Positano:"פוזיטנו",Rimini:"רימיני",Bologna:"בולוניה",Turin:"טורינו",Catania:"קטניה",Taormina:"טאורמינה",Palermo:"פלרמו",Bari:"בארי",Dolomites:"הדולומיטים",Paris:"פריז",Nice:"ניס",Cannes:"קאן",Monaco:"מונקו",Amsterdam:"אמסטרדם",Barcelona:"ברצלונה",Madrid:"מדריד",Seville:"סביליה",Malaga:"מלגה",Marbella:"מרבלה",Lisbon:"ליסבון",Porto:"פורטו",London:"לונדון",Dubai:"דובאי","Abu Dhabi":"אבו דאבי",Istanbul:"איסטנבול",Antalya:"אנטליה",Kemer:"קמר",Belek:"בלק",Side:"סידה",Alanya:"אלניה",Batumi:"בטומי",Tbilisi:"טביליסי",Kutaisi:"קוטאיסי",Krakow:"קרקוב",Warsaw:"ורשה",Zakopane:"זקופנה",Bratislava:"ברטיסלבה",Ljubljana:"לובליאנה",Bled:"בלד",Budva:"בודווה",Kotor:"קוטור",Podgorica:"פודגוריצה",Tivat:"טיבט",Tirana:"טירנה",Durres:"דורס",Split:"ספליט",Dubrovnik:"דוברובניק",Zagreb:"זאגרב",Belgrade:"בלגרד",Valletta:"ולטה",Sliema:"סלימה","St. Julian's":"סנט ג'וליאנס",Marrakech:"מרקש",Bangkok:"בנגקוק",Phuket:"פוקט","New York":"ניו יורק",Zurich:"ציריך",Geneva:"ז'נבה",Baku:"באקו",Yerevan:"ירוואן" };
// "ב" לפני שם עיר: ולינגרד → בוולינגרד, וינה → בווינה
const inC = s => "ב" + (/^ו(?!ו)/.test(s) ? "ו" : "") + s;
const cityHe = s => { if (!s) return ""; const k = Object.keys(CITY_EN).find(k => k.toLowerCase() === String(s).toLowerCase()); return k ? CITY_EN[k] : s; };
const DAY = ["א'","ב'","ג'","ד'","ה'","ו'","ש'"];

const heAir = a => { const k = Object.keys(AIR).sort((x,y)=>y.length-x.length).find(k => a.toLowerCase().includes(k.toLowerCase())); return k ? AIR[k] : a; };
const toISO = d => { const m = d.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/); if (!m) return null; let y = +m[3]; if (y < 100) y += 2000; return y+"-"+m[2].padStart(2,"0")+"-"+m[1].padStart(2,"0"); };
const dayOf = iso => iso ? DAY[new Date(iso+"T12:00:00").getDay()] : "";
const ddmmyy = iso => iso ? iso.slice(8,10)+"/"+iso.slice(5,7)+"/"+iso.slice(2,4) : "";
const num = s => +String(s).replace(/,/g,"");

// משקל בק"ג – עובד עם כל סוג גרשיים, והמספר יכול להופיע לפני או אחרי ק"ג (בגלל כיווניות ב-PDF)
const KG = /(\d+)\s*ק["'״”׳]?ג|ק["'״”׳]?ג\s*(\d+)/;
// מחפש שורה של פריט כבודה שנרכש (לא המשפט הקבוע "מזוודות אינן כלולות") ומחזיר משקל וכמות
function bagInfo(L, word) {
  for (let i = 0; i < L.length; i++) {
    const x = L[i];
    if (!x.includes(word) || /אינן|לא כלול|לא טרולי/.test(x)) continue;
    const w = x.match(KG);
    if (!w) continue;
    const rest = x.replace(KG, " ").match(/(\d+)/);
    let q = rest ? +rest[1] : 0;
    if (!q && L[i+1] && /^:?\s*\d+\s*:?$/.test(L[i+1])) q = +L[i+1].replace(/\D/g, "");
    return { kg: +(w[1] || w[2]), qty: q };
  }
  return null;
}

function roomHe(s) {
  if (!s) return "";
  const t = s.toLowerCase(), p = [];
  const type = [["junior suite","ג'וניור סוויטה"],["suite","סוויטה"],["family","משפחתי"],["executive","אקזקיוטיב"],["deluxe","דלוקס"],["superior","סופריור"],["standard","סטנדרט"],["classic","קלאסי"],["comfort","קומפורט"],["economy","אקונומי"],["studio","סטודיו"],["apartment","דירה"]].find(x => t.includes(x[0]));
  p.push("חדר " + (type ? type[1] : ""));
  if (/triple/.test(t)) p.push("לשלושה"); else if (/quad/.test(t)) p.push("לארבעה"); else if (/double/.test(t)) p.push("זוגי"); else if (/twin/.test(t)) p.push("עם 2 מיטות");
  const view = [["sea","נוף לים"],["city","נוף לעיר"],["pool","נוף לבריכה"],["garden","נוף לגינה"],["mountain","נוף להרים"],["acropolis","נוף לאקרופוליס"],["river","נוף לנהר"]].find(x => t.includes(x[0]+" view") || t.includes("with "+x[0]) || t.includes(x[0]));
  if (view) p.push("עם " + view[1]);
  return p.join(" ").replace(/\s+/g," ").trim();
}

export function parseQuote(raw) {
  const t = raw.replace(/[ \t\u00a0]+/g, " ");
  const L = t.split("\n").map(x => x.trim()).filter(Boolean);
  const o = { flights: [], notes: [], inc: [] };
  let m;

  // טיסות: בלוקים של Flight N
  L.forEach((x, i) => {
    if (!/^Flight \d+:/.test(x)) return;
    const seg = L.slice(i + 1, i + 16), f = {};
    const di = seg.indexOf("Details"), dep = seg.indexOf("Departure"), arr = seg.indexOf("Arrival");
    if (di >= 0) { f.airline = seg[di+1]; f.no = seg[di+2]; }
    if (dep >= 0) { f.from = seg[dep+1]; f.dt = seg[dep+2]; }
    if (arr >= 0) { f.to = seg[arr+1]; f.at = seg[arr+2]; }
    if (f.from && f.to) o.flights.push(f);
  });
  // גיבוי: שורות סיכום "X(AAA) → Y(BBB) Day, dd/mm/yy, HH:MM"
  if (!o.flights.length) for (const mm of t.matchAll(/([A-Za-z .'-]+)\(([A-Z]{3})\)\s*→\s*([A-Za-z .'-]+)\(([A-Z]{3})\)\s*\w*,?\s*(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s*(\d{1,2}:\d{2})/g))
    o.flights.push({ from: mm[1]+"("+mm[2]+")", to: mm[3]+"("+mm[4]+")", dt: mm[5]+", "+mm[6] });
  o.flights.forEach(f => {
    const c = s => (String(s||"").match(/\(([A-Z]{3})\)/) || [])[1];
    f.fc = c(f.from); f.tc = c(f.to);
    f.fn = CITY[f.fc] || String(f.from||"").replace(/\s*\(.*$/,"");
    f.tn = CITY[f.tc] || String(f.to||"").replace(/\s*\(.*$/,"");
    f.d = toISO(f.dt||""); f.tm = (String(f.dt||"").match(/(\d{1,2}:\d{2})/)||[])[1]; f.atm = (String(f.at||"").match(/(\d{1,2}:\d{2})/)||[])[1];
  });

  if ((m = t.match(/כרטיס ילד\s*:?\s*(\d+)/)) || (m = t.match(/(\d+)\s*(?:ילדים|ילד)(?![א-ת])/))) o.children = +m[1];
  if ((m = t.match(/כרטיס תינוק\s*:?\s*(\d+)/)) || (m = t.match(/(\d+)\s*(?:תינוקות|תינוק)(?![א-ת])/))) o.infants = +m[1];

  // כבודה כלולה
  const tr = bagInfo(L, "טרולי"), sc = bagInfo(L, "מזוודה");
  if (tr) { o.trolley = tr.kg; o.trolleys = tr.qty; }
  if (sc) { o.suitcase = sc.kg; o.bags = sc.qty; }

  // מלון
  if ((m = t.match(/סיכום הזמנה\s*\n\s*([^\n]+)/))) o.hotel = m[1].trim();
  if (!o.hotel && (m = t.match(/\n\s*([^\n]+?)\s*\n[^\n]*לחצו למידע מלא על המלון/))) o.hotel = m[1].trim();
  if (!o.hotel && (m = t.match(/\nמלון\s*\n\s*([^\n]+)/))) o.hotel = m[1].trim();
  if ((m = t.match(/\n\s*(\d{1,2}(?:\.\d)?)\s*\n\s*(מעולה|מצוין|נהדר|טוב מאוד|טוב|מצויין)/))) o.rating = m[1] + " – " + m[2];
  else if ((m = t.match(/(מעולה|מצוין|נהדר|טוב מאוד|מצויין)\s*\n?\s*(\d{1,2}\.\d)/))) o.rating = m[2] + " – " + m[1];
  if ((m = t.match(/([A-Za-z][^\n]*?)\s+כתובת:/))) { const parts = m[1].split(",").map(x => x.replace(/\d+/g,"").trim()).filter(Boolean); o.countryEn = parts[parts.length-1]; o.cityEn = parts[parts.length-2]; }
  if ((m = t.match(/(\d+)\s*:\s*לילות/)) || (m = t.match(/(\d+)\s*לילות/)) || (m = t.match(/לילות\s*:?\s*(\d+)/))) o.nights = +m[1];
  if ((m = t.match(/(\d+)\s*x\s+([A-Za-z][A-Za-z ,/&-]+)/))) { o.rooms = +m[1]; o.roomEn = m[2].trim(); }
  if ((m = t.match(/(\d+)\s*חדרים/))) o.rooms = Math.max(o.rooms || 0, +m[1]);
  o.room = roomHe(o.roomEn);
  if (!o.rooms && (m = t.match(/[A-Za-z][A-Za-z ]*?\s+x\s*(\d+)/))) o.rooms = +m[1];

  // מבוגרים – לוקחים את הגבוה מבין: כמות כרטיסי מבוגר בהצעה, או חדרים × תפוסה לחדר
  // (בגלל כיווניות ב-PDF המספר יכול להופיע לפני או אחרי, ולא לוקחים "2 מבוגרים" של חדר בודד)
  const ad = [...t.matchAll(/כרטיס מבוגר[ \t:]*(\d+)|(\d+)[ \t:]*כרטיס מבוגר/g)].map(x => +(x[1] || x[2]));
  const occ = (t.match(/תפוסה\s*:?\s*(\d+)\s*מבוגרים|(\d+)\s*מבוגרים\s*:?\s*תפוסה/) || []).slice(1).find(Boolean);
  if (occ && o.rooms) ad.push(+occ * o.rooms);
  const rs = [...t.matchAll(/חדר \d+\s*\n?\s*(\d+)\s*מבוגרים/g)];
  if (rs.length > 1) ad.push(rs.reduce((a, x) => a + +x[1], 0));
  if (ad.length) o.adults = Math.max(...ad);
  else if ((m = t.match(/(\d+)\s*מבוגרים/))) o.adults = +m[1];
  const board = [[/הכל כלול|all inclusive/i,"הכל כלול"],[/פנסיון מלא|full board/i,"פנסיון מלא"],[/חצי פנסיון|half board/i,"חצי פנסיון"],[/ארוחת בוקר|breakfast|bed and breakfast/i,"ארוחת בוקר"],[/לינה בלבד|room only/i,"לינה בלבד"]].find(x => x[0].test((t.match(/[^\n]*בסיס אירוח[^\n]*/)||[""])[0]));
  if (board) o.board = board[1];

  // יעד
  const out = o.flights[0];
  const cc = COUNTRY[o.countryEn] || "";
  // עיר הנחיתה (לפי שדה התעופה) ועיר המלון (לפי כתובת המלון).
  // היעד נקבע לפי המלון; שדה התעופה נשמר בנפרד כ"נחיתה ב...".
  o.arrCity = (out && out.tc && CITY[out.tc]) || (out && out.tn) || "";
  o.hotelCity = cityHe(o.cityEn);
  o.city = o.hotelCity || o.arrCity || "";
  o.dest = o.city + (cc ? ", " + cc : "");
  o.diffCity = !!(o.hotelCity && o.arrCity && o.hotelCity !== o.arrCity);

  // תאריכים
  o.d1 = out ? out.d : null;
  const back = o.flights.length > 1 ? o.flights[o.flights.length - 1] : null;
  o.d2 = back ? back.d : null;
  if (!o.d1 && (m = t.match(/צ'ק אין\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{1,2}\/\d{1,2}\/\d{2,4})\s*:?\s*צ'ק אין/))) o.d1 = toISO(m[1]||m[2]);
  if (!o.d2 && (m = t.match(/צ'ק אאוט\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{1,2}\/\d{1,2}\/\d{2,4})\s*:?\s*צ'ק אאוט/))) o.d2 = toISO(m[1]||m[2]);

  // מחיר
  if ((m = t.match(/₪\s*([\d,]+(?:\.\d+)?)/)) || (m = t.match(/([\d,]+(?:\.\d+)?)\s*₪/))) o.total = num(m[1]);
  if ((m = t.match(/מחיר כולל\s*\n?\s*\$\s*([\d,]+(?:\.\d+)?)/)) || (m = t.match(/\$\s*([\d,]+(?:\.\d+)?)/))) o.usd = num(m[1]);

  // מה כלול
  if (o.flights.length) o.inc.push("טיסות הלוך וחזור");
  if (o.trolley) o.inc.push(bagText(o, "טרולי", o.trolley, o.trolleys));
  if (o.suitcase) o.inc.push(bagText(o, "מזוודה", o.suitcase, o.bags));
  if (o.hotel) o.inc.push((o.nights ? o.nights + " לילות במלון " : "מלון ") + o.hotel + (o.board ? " – " + o.board : ""));

  // הערות
  if (/מזוודות אינן כלולות/.test(t) && !o.suitcase) o.notes.push("מזוודה גדולה לא כלולה (ניתן להוסיף בתשלום)");
  if (/לא ניתן לביטול/.test(t) && o.flights.length) o.notes.push("כרטיסי הטיסה אינם ניתנים לשינוי או ביטול");
  if (/מיסים לתשלום במלון|Property Fee|Climate Resilience Fee/i.test(t)) o.notes.push("מס עיר משולם ישירות במלון");
  if (/תוקף ההצעה|שער החליפין/.test(t)) o.notes.push("ההצעה בכפוף לזמינות מקומות ולשער הדולר ביום התשלום");
  return o;
}

// "טרולי 8 ק"ג לכל נוסע" או "3 מזוודות של 20 ק"ג" כשהכמות קטנה ממספר הנוסעים
function bagText(o, word, kg, qty) {
  const pax = (o.adults || 0) + (o.children || 0);
  if (qty && (!pax || qty < pax)) return (qty === 1 ? word : qty + " " + (word === "מזוודה" ? "מזוודות" : "טרולים")) + " של " + kg + " ק\"ג";
  return word + " " + kg + " ק\"ג לכל נוסע";
}

export function buildMsg(o, name, extras = {}) {
  const L = [];
  L.push("היי" + (name ? " " + name : "") + " 👋");
  L.push("שמחים לשלוח לך את ההצעה" + (o.city ? " לחופשה " + inC(o.city) : "") + " ✈️", "");
  if (o.flights.length) {
    L.push("✈️ *טיסות*");
    o.flights.forEach((f, i) => {
      const lab = o.flights.length === 2 ? (i ? "חזור" : "הלוך") : "טיסה " + (i + 1);
      L.push(lab + ": יום " + dayOf(f.d) + " " + ddmmyy(f.d) + " | " + f.fn + (f.tm ? " " + f.tm : "") + " ← " + f.tn + (f.atm ? " " + f.atm : "") + (f.airline ? " (" + heAir(f.airline) + ")" : ""));
    });
    if (o.trolley) L.push("🧳 כולל " + bagText(o, "טרולי", o.trolley, o.trolleys));
    if (o.suitcase) L.push("🧳 כולל " + bagText(o, "מזוודה", o.suitcase, o.bags));
    L.push("");
  }
  if (o.diffCity) L.push("📍 נחיתה " + inC(o.arrCity) + ", והמלון נמצא " + inC(o.hotelCity), "");
  if (o.hotel) {
    L.push("🏨 *מלון " + o.hotel + "*" + (o.diffCity ? " (" + o.hotelCity + ")" : ""));
    if (o.rating) L.push("דירוג אורחים " + o.rating);
    const r = [o.nights ? o.nights + " לילות" : "", (o.rooms > 1 ? o.rooms + " × " : "") + (o.room || "")].filter(x => x.trim()).join(" | ");
    if (r) L.push(r);
    if (o.board) L.push((o.board === "הכל כלול" ? "🍽️ " : "🍳 ") + "כולל " + o.board);
    L.push("");
  }
  if (extras.transfers) L.push(typeof extras.transfers === "string" ? extras.transfers : "🚐 *כולל העברות* משדה התעופה" + (o.diffCity ? " " + inC(o.arrCity) + " למלון " + inC(o.hotelCity) : " למלון") + " ובחזרה", "");
  else if (o.diffCity) L.push("🚐 ניתן להוסיף העברה משדה התעופה " + inC(o.arrCity) + " למלון " + inC(o.hotelCity), "");
  const pax = [o.adults ? o.adults + " מבוגרים" : "", o.children ? o.children + " ילדים" : "", o.infants ? o.infants + " תינוקות" : ""].filter(Boolean).join(" ו-");
  if (pax) L.push("👥 ל-" + pax, "");
  if (o.total) L.push("💰 *מחיר כולל: " + o.total.toLocaleString("he-IL") + " ₪*");
  else if (o.usd) L.push("💰 *מחיר כולל: $" + o.usd.toLocaleString("en-US") + "*");
  if (extras.split3) L.push("💳 ניתן לחלק ל-3 תשלומים");
  if (extras.extra) L.push(extras.extra);
  L.push("");
  if (o.notes.length) { L.push("📌 לתשומת לבך:"); o.notes.forEach(n => L.push("• " + n)); L.push(""); }
  L.push("נשמח לעמוד לרשותך לכל שאלה 😊", "WaypointFlit", "waypointflit.com");
  return L.join("\n").replace(/\n{3,}/g, "\n\n");
}
