import { Router } from "express";
import { getFirestore } from "../lib/firebase";
import { FirestoreUser, UserAPI } from "../types";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const db = getFirestore();
    const snap = await db.collection("users").get();

    const users: UserAPI[] = snap.docs.map((doc) => {
      const data = (doc.data() || {}) as FirestoreUser;
      return {
        id: doc.id,
        name: data.name ?? "",
        email: data.email ?? "",
        phoneNumber: data.phoneNumber,
      };
    });

    return res.json({ ok: true, data: users });
  } catch (e) {
    console.error("Error fetching users:", e);
    return res.status(500).json({ ok: false, error: "Failed to fetch users" });
  }
});

export default router;
