# WhatsApp Bot Backend

A simple Node.js + Express backend for a WhatsApp Business chatbot using the Meta WhatsApp Cloud API.

## Features

- Webhook verification endpoint for Meta
- Incoming WhatsApp message handler
- Text message replies
- Basic menu-based chatbot flow
- Ready for Render deployment

## Project structure

```text
whatsapp-bot-backend/
  src/
    server.js
    whatsapp.js
  .env.example
  .gitignore
  package.json
  README.md
```

## 1. Install dependencies

```bash
npm install
```

## 2. Create your environment file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then fill in:

```env
PORT=3000
GRAPH_API_VERSION=v21.0
WHATSAPP_TOKEN=your_meta_whatsapp_cloud_api_token
PHONE_NUMBER_ID=your_whatsapp_phone_number_id
VERIFY_TOKEN=choose_any_secret_verify_token
```

`VERIFY_TOKEN` can be any secret value you choose. You will enter the same value in the Meta webhook setup screen.

## 3. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

You should see:

```text
WhatsApp bot backend is running.
```

## 4. Deploy to Render

1. Push this project to GitHub.
2. Go to Render.
3. Create a new **Web Service**.
4. Connect your GitHub repo.
5. Use these settings:

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
```

6. Add these environment variables in Render:

```text
GRAPH_API_VERSION
WHATSAPP_TOKEN
PHONE_NUMBER_ID
VERIFY_TOKEN
```

Render automatically provides `PORT`, so you do not need to set it there.

## 5. Connect webhook in Meta

In your Meta app dashboard, set your callback URL to:

```text
https://your-render-service.onrender.com/webhook
```

Set the verify token to the exact same value as your `VERIFY_TOKEN` environment variable.

Subscribe to WhatsApp message events.

## 6. Test

Send a WhatsApp message to your test number:

```text
hi
```

The bot should reply with:

```text
Hello! Welcome to our WhatsApp assistant.
Reply with:
1 - Pricing
2 - Support
3 - Talk to a person
```

## Next improvements

- Add OpenAI for AI answers
- Store conversations in Supabase
- Add human handoff
- Add message templates
- Add CRM integration
- Verify Meta webhook signatures
