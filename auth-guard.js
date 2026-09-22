// מודול משותף: כל עמוד פנימי (index.html, admin.html...) מייבא את זה בתחילת
// ה-<script type="module">. הוא דואג שרק מחוברות ומאושרות יגיעו לעמוד,
// ומחזיר החוצה app/auth/db/me מוכנים לשימוש.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// מחכה למשתמש מחובר ומאושר (role != pending), ומחזירה {uid,email,name,role}.
// אם אין חיבור או שהחשבון לא אושר, מעבירה חזרה למסך הכניסה.
export function requireUser() {
  return new Promise(resolve => {
    onAuthStateChanged(auth, async user => {
      if (!user) { location.href = "login.html"; return; }
      const snap = await getDoc(doc(db, "users", user.uid));
      const data = snap.exists() ? snap.data() : { role: "pending" };
      if (data.role === "pending") { location.href = "login.html"; return; }
      resolve({ uid: user.uid, email: data.email || user.email, name: data.name || (user.email || "").split("@")[0], role: data.role });
    });
  });
}

export function logout() { return signOut(auth); }
