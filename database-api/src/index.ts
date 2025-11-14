import "dotenv/config";
import express from "express";
import cors from "cors";
import driversRouter from "./routes/drivers";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users"; 
import eventsRouter from "./routes/events";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/drivers", driversRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter); 

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`DriveSense DB API on http://localhost:${PORT}`));

app.use("/api/events", eventsRouter);