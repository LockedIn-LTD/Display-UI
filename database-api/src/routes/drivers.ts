import { Router } from "express";
import { getFirestore } from "../lib/firebase";
import { DriverAPI, FirestoreDriver } from "../types";

const router = Router();

function toDriverAPI(id: string, raw: FirebaseFirestore.DocumentData): DriverAPI {
  const d = (raw || {}) as FirestoreDriver;
  const fullName = d.name && d.name.trim() ? d.name.trim() : "Unknown Driver";
  const avatarUrl = d.profilePic && d.profilePic.trim() ? d.profilePic : undefined;
  return { id, fullName, avatarUrl };
}

router.get("/", async (_req, res) => {
  try {
    const snap = await getFirestore().collection("drivers").get();
    const drivers = snap.docs.map(doc => toDriverAPI(doc.id, doc.data()));
    drivers.sort((a, b) => a.fullName.localeCompare(b.fullName));
    res.json({ ok: true, data: drivers });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Failed to fetch drivers" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await getFirestore().collection("drivers").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ ok: false, error: "Driver not found" });
    res.json({ ok: true, data: toDriverAPI(doc.id, doc.data() || {}) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Failed to fetch driver" });
  }
});

export default router;
