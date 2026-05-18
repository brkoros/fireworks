import axios from "axios";

const GRAPH_API_VERSION = process.env.GRAPH_API_VERSION || "v21.0";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

export function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully.");
    return res.status(200).send(challenge);
  }

  console.warn("Webhook verification failed.");
  return res.sendStatus(403);
}

export async function handleIncomingMessage(body) {
  const entry = body?.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;
  const message = value?.messages?.[0];

  if (!message) {
    return;
  }

  const from = message.from;
  const messageType = message.type;

  if (messageType !== "text") {
    await sendTextMessage(from, "Thanks! Right now I can only understand text messages.");
    return;
  }

  const userText = message.text?.body?.trim() || "";
  const reply = buildBotReply(userText);

  await sendTextMessage(from, reply);
}

function buildBotReply(userText) {
  const text = userText.toLowerCase();

  if (["hi", "hello", "hey", "start"].includes(text)) {
    return [
      "Hello! Welcome to our WhatsApp assistant.",
      "Reply with:",
      "1 - Pricing",
      "2 - Support",
      "3 - Talk to a person"
    ].join("\n");
  }

  if (text === "1" || text.includes("price") || text.includes("pricing")) {
    return "Our pricing team can help you choose the right plan. Please share what product or service you are interested in.";
  }

  if (text === "2" || text.includes("support") || text.includes("help")) {
    return "Sure, I can help. Please describe the issue you are facing.";
  }

  if (text === "3" || text.includes("person") || text.includes("human") || text.includes("agent")) {
    return "Got it. A team member will follow up with you soon.";
  }

  return "Thanks for your message. Please reply with 1 for Pricing, 2 for Support, or 3 to Talk to a person.";
}

export async function sendTextMessage(to, body) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    throw new Error("Missing WHATSAPP_TOKEN or PHONE_NUMBER_ID environment variable.");
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body }
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  console.log(`Sent message to ${to}`);
}
