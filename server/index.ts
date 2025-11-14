import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sendSMS, makeCall } from "./twilioService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/send-alert", async (req: Request, res: Response): Promise<void> => {
    const { phone } = req.body;
    if (!phone) {
        res.status(400).json({ error: "Phone number is required" });
        return;
    }

    try {
        console.log("Attempting to send SMS...");
        await sendSMS(phone, "Emergency alert: Driver needs help.");
        console.log("SMS sent. Making call...");
        await makeCall(phone);
        console.log("Call successful.");
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err); 
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        res.status(500).json({ error: errorMessage });
    }
});

const PORT: number = 5000;
app.listen(PORT, (): void => {
    console.log(`server running on port ${PORT}`);
});