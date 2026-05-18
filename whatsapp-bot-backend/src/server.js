import express from "express";
import dotenv from "dotenv";
import { handleIncomingMessage, verifyWebhook } from "./whatsapp.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("WhatsApp bot backend is running.");
});

// Meta uses this endpoint to verify your webhook URL.
app.get("/webhook", verifyWebhook);

// Meta sends incoming WhatsApp messages to this endpoint.
app.post("/webhook", async (req, res) => {
  // Always respond quickly to Meta so webhook delivery does not retry unnecessarily.
  res.sendStatus(200);

  try {
    await handleIncomingMessage(req.body);
  } catch (error) {
    console.error("Webhook processing error:", error?.response?.data || error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
