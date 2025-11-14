// database-api/src/routes/auth.ts
import { Router } from "express";
import { getFirestore } from "../lib/firebase";
import { FirestoreUser, UserAPI } from "../types";
import { sha256Hex } from "../lib/hash";
import { signJwt } from "../lib/auth";

const router = Router();

/**
 * POST /api/auth/login
 * Body: { identifier: string; password: string }
 * identifier can be email OR username (users.name)
 * - trims input
 * - tries lookup by name THEN email (or email only if it looks like one)
 * - compares SHA-256(password) to Firestore users.password
 */
router.post("/login", async (req, res) => {
  try {
    const raw = (req.body || {}) as { identifier?: string; password?: string };
    const identifier = (raw.identifier ?? "").trim();
    const password = (raw.password ?? "").toString();

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "identifier and password required" });
    }

    const looksEmail = /@/.test(identifier);
    const db = getFirestore();

    const tryByEmail = async () => {
      const snap = await db
        .collection("users")
        .where("email", "==", identifier)
        .limit(1)
        .get();
      return snap.empty ? null : snap.docs[0];
    };

    const tryByName = async () => {
      const snap = await db
        .collection("users")
        .where("name", "==", identifier)
        .limit(1)
        .get();
      return snap.empty ? null : snap.docs[0];
    };

    // if it's email-like, only try email; otherwise try name then email
    let doc =
      looksEmail ? await tryByEmail() : (await tryByName()) || (await tryByEmail());

    if (!doc) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const data = (doc.data() || {}) as FirestoreUser;
    const storedHash = (data.password || "").toLowerCase().trim();
    const givenHash = sha256Hex(password);

    if (!storedHash || givenHash !== storedHash) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const user: UserAPI = {
      id: doc.id,
      name: data.name || "",
      email: data.email || "",
      phoneNumber: data.phoneNumber,
    };

    const token = signJwt({ sub: user.id, email: user.email, name: user.name });

    return res.json({ ok: true, data: { token, user } });
  } catch (e) {
    console.error("Login error", e);
    return res.status(500).json({ ok: false, error: "Login failed" });
  }
});

export default router;
