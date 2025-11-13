import { Router } from "express";
import { getFirestore } from "../lib/firebase";
import { EventAPI, FirestoreEvent } from "../types";
import type { CollectionReference, Query } from "firebase-admin/firestore";

const router = Router();

function mapEvent(docId: string, data: FirestoreEvent): EventAPI {
  const date = data.date || "";
  const time = data.timeStamp || "";
  let timestampMs: number | undefined;
  const ts = Date.parse(`${date} ${time}`);
  if (!Number.isNaN(ts)) timestampMs = ts;

  return {
    id: docId,
    driverId: data.driverId || "",
    status: data.status,
    heartRate: data.heartRate,
    bloodOxygenLevel: data.bloodOxygenLevel,
    vehicleSpeed: data.vehicleSpeed,
    date,
    time,
    timestampMs,
    videoUrl: data.videoLink,
  };
}

router.get("/", async (req, res) => {
  try {
    const driverId = (req.query.driverId as string | undefined)?.trim();
    const limitRaw = Number(req.query.limit ?? 50);
    const limit = Math.max(1, Math.min(200, Number.isFinite(limitRaw) ? limitRaw : 50));

    const db = getFirestore();

    const col = db.collection("events") as CollectionReference; 
    let q: Query = col;                                        

    if (driverId) q = q.where("driverId", "==", driverId);

    const snap = await q.limit(200).get();
    const events = snap.docs.map(d => mapEvent(d.id, (d.data() || {}) as FirestoreEvent));

    events.sort((a, b) => (b.timestampMs ?? 0) - (a.timestampMs ?? 0));

    return res.json({ ok: true, data: events.slice(0, limit) });
  } catch (e) {
    console.error("List events error", e);
    return res.status(500).json({ ok: false, error: "Failed to list events" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = getFirestore();
    const doc = await db.collection("events").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ ok: false, error: "Not found" });
    return res.json({ ok: true, data: mapEvent(doc.id, (doc.data() || {}) as FirestoreEvent) });
  } catch (e) {
    console.error("Get event error", e);
    return res.status(500).json({ ok: false, error: "Failed to get event" });
  }
});

router.get("/by/driver/:driverId", async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const limitRaw = Number(req.query.limit ?? 50);
    const limit = Math.max(1, Math.min(200, Number.isFinite(limitRaw) ? limitRaw : 50));

    const db = getFirestore();
    const col = db.collection("events") as CollectionReference;
    let q: Query = col.where("driverId", "==", driverId);

    const snap = await q.get();
    const events = snap.docs.map(d => mapEvent(d.id, (d.data() || {}) as FirestoreEvent));
    events.sort((a, b) => (b.timestampMs ?? 0) - (a.timestampMs ?? 0));

    return res.json({ ok: true, data: events.slice(0, limit) });
  } catch (e) {
    console.error("List events by driver error", e);
    return res.status(500).json({ ok: false, error: "Failed to list events" });
  }
});

export default router;
