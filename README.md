# ⚡ Olympus AI — Mythology Quiz Agent (Mastra + Telex)

Olympus is an AI-powered mythology quiz bot built using the **Mastra AI Agent Framework** and **Telex** for interaction.  
It’s a friendly, witty, and mythologically wise host that challenges users with fun mythology trivia from across the world — Greek, Norse, Egyptian, Hindu, Roman, and more.

---

## 🧠 Overview

Olympus is designed to:

- Engage users with interactive, multiple-choice mythology quizzes.
- Run as a **Mastra Agent**, fully handling quiz logic, scoring, and responses.
- Integrate with **Telex** using a JSON-RPC A2A API endpoint.
- Maintain memory and state using a local **LibSQL (SQLite)** store.

Each session feels like a mini-game — with 10 randomized questions, live scoring, and a mythological personality guiding the user.

---

## ⚙️ Project Structure

```
olympus-agent/
├── src/
│   ├── agents/
│   │   └── olympus-agent.ts      # Defines Olympus agent behavior and memory
│   ├── routes/
│   │   └── a2a-agent-route.ts    # Handles A2A JSON-RPC requests from Telex
│   ├── workflows/
│   │   └── olympus-workflow.ts   # Workflow that triggers the Olympus agent
│   └── index.ts                  # Registers agents, workflows, and server routes
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/olympus-agent.git
cd olympus-agent
```

### 2. Install Dependencies

```bash
npm install
```

or

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the project root if required by Mastra (for API keys or DB settings).

Example:

```bash
MYSTRA_DB_URL=file:./mastra.db
PORT=3000
```

### 4. Run the Server Locally

```bash
npm run dev
```

Mastra will start a local API server — by default on:

```
http://localhost:3000
```

---

## 🧩 Testing the Project

### ✅ 1. Test the Workflow

You can manually trigger the Olympus workflow to verify it responds correctly:

```bash
curl -X POST http://localhost:3000/workflows/olympus-workflow   -H "Content-Type: application/json"   -d '{"message": "Start quiz - easy"}'
```

**Expected:** Olympus should return a JSON response containing the quiz intro or the first question.

---

### ✅ 2. Test the A2A Route

#### Empty Body Test

Ensure your A2A route gracefully handles empty bodies:

```bash
curl -X POST http://localhost:3000/a2a/agent/olympusAgent   -H "Content-Type: application/json"   -d ''
```

**Expected Response:**

- HTTP 200 OK
- JSON-RPC response with a friendly “No input received” message.

#### Valid Request Test

Send a proper JSON-RPC request:

```bash
curl -X POST http://localhost:3000/a2a/agent/olympusAgent   -H "Content-Type: application/json"   -d '{
    "jsonrpc": "2.0",
    "id": "test123",
    "method": "generate",
    "params": {
      "message": {
        "role": "user",
        "parts": [{ "kind": "text", "text": "Start quiz - easy" }]
      }
    }
  }'
```

**Expected:** Olympus responds with a question and 4 randomized multiple-choice options.

---

## 🧱 Key Files Explained

### `olympus-agent.ts`

Defines the **Olympus Agent** — a mythological quiz host.  
Handles quiz flow, memory, scoring, and personality.  
Uses `@mastra/memory` with a local `LibSQLStore` database.

### `a2a-agent-route.ts`

Registers the **A2A endpoint** (`/a2a/agent/:agentId`) for Telex → Mastra communication.

- Validates JSON-RPC requests.
- Converts messages into Mastra’s internal format.
- Handles both valid and empty JSON gracefully.

### `olympus-workflow.ts`

Defines a **Mastra Workflow** that:

- Receives Telex or external triggers.
- Passes input to the `olympusAgent`.
- Returns the AI’s response as workflow output.

---

## 🧪 Debugging Tips

- If Telex logs show:

  ```
  Will the workflow run: False
  ```

  → It means your workflow ID or trigger event doesn’t match the Telex configuration.

- To debug, log inside your workflow:

  ```ts
  console.log("Workflow triggered with input:", inputData);
  ```

- Check Mastra console logs for:
  ```
  Successfully connected to centrifugo ✅
  Agent workflow found ✅
  Will the workflow run: True
  ```

---

## 🛠️ Contribution Guidelines

We welcome contributions and improvements! Follow these steps:

### 1. Fork the Repository

Click **“Fork”** on GitHub to create your own copy.

### 2. Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Commit Your Changes

```bash
git commit -m "Add: describe your change"
```

### 4. Push and Create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a **Pull Request (PR)** describing your enhancement or fix.

### Code Style

- Use **TypeScript** consistently.
- Format with **Prettier** or **ESLint** rules.
- Keep responses and logs **clear, concise, and meaningful**.

---

## 🌐 Connect with the Creator

**👨‍💻 Created by [Ehizojie Azamegbe](https://www.linkedin.com/in/ehizojie-azamegbe-082ba52b9/)**

- 🔗 LinkedIn: [Ehizojie Azamegbe](https://www.linkedin.com/in/ehizojie-azamegbe-082ba52b9/)
- 🕊️ X (Twitter): [@ehiz_dev](https://x.com/ehiz_dev)

---

**“Even Athena would be proud.” 🏛️**
