// עוקב שימוש: פותח רשומת "סשן" בכניסה, מעדכן אותה כל דקה כל עוד יש פעילות
// בעמוד, ומתנתק אוטומטית אחרי חוסר פעילות ממושך. משמש למעקב שעות עבודה
// מהבית: המנהל רואה ב-admin.html מתי כל עובדת נכנסה וכמה זמן הייתה פעילה.
import { db } from "./auth-guard.js";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const IDLE_MS = 20 * 60 * 1000;      // חוסר פעילות שגורם להתנתקות אוטומטית
const HEARTBEAT_MS = 60 * 1000;      // תדירות עדכון "עדיין פעיל/ה"

export function startTracking(me, onIdleTimeout) {
  let sessionRef = null;
  let idleTimer = null;
  let hbTimer = null;
  let ended = false;

  async function open() {
    try {
      sessionRef = await addDoc(collection(db, "sessions"), {
        uid: me.uid, name: me.name || "", email: me.email || "",
        start: Date.now(), lastActive: Date.now(), end: null,
      });
    } catch (e) { sessionRef = null; }
  }

  async function heartbeat() {
    if (!sessionRef || ended) return;
    try { await updateDoc(sessionRef, { lastActive: Date.now() }); } catch (e) {}
  }

  async function close() {
    if (!sessionRef || ended) return;
    ended = true;
    try { await updateDoc(sessionRef, { end: Date.now(), lastActive: Date.now() }); } catch (e) {}
  }

  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(async () => { await close(); if (onIdleTimeout) onIdleTimeout(); }, IDLE_MS);
  }

  ["mousemove","keydown","click","touchstart","scroll"].forEach(ev =>
    window.addEventListener(ev, resetIdle, { passive: true })
  );
  window.addEventListener("beforeunload", () => { close(); });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") heartbeat(); });

  open();
  resetIdle();
  hbTimer = setInterval(heartbeat, HEARTBEAT_MS);

  return { close }; // אפשר לקרוא ל-close() ידנית, למשל בלחיצה על "התנתקות"
}
