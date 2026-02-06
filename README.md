# RealityLoop

**RealityLoop** is a human-in-the-loop AI system that makes AI beliefs, uncertainty, and confidence changes visible.

Instead of treating AI answers as final, RealityLoop allows humans to challenge an AI’s reasoning and observe how the AI revises its belief and confidence over time. This project demonstrates transparent, iterative reasoning using the **Gemini 3 API**.

---

## 🚀 What Problem Does It Solve?

Most AI systems:
- Hide uncertainty
- Present answers with false confidence
- Do not explain how human feedback changes reasoning

RealityLoop addresses this by:
- Explicitly showing AI confidence
- Listing assumptions and uncertainties
- Allowing humans to challenge the AI
- Updating beliefs and confidence transparently

---

## 🧠 How It Works

1. **Initial AI Belief**
   - User asks a question
   - AI responds with:
     - Answer
     - Confidence score
     - Assumptions
     - Uncertainties

2. **Human Challenge**
   - User provides a correction or missing context

3. **Revised Belief**
   - AI re-evaluates its reasoning
   - Explains what changed
   - Updates confidence (can increase, decrease, or remain the same)

4. **Repeat**
   - The loop can continue with further challenges

---

## ✨ Key Features

- Human-in-the-loop belief revision
- Explicit uncertainty modeling
- Confidence that can increase or decrease
- Transparent “what changed” explanations
- Keyboard-friendly interactions (Enter to submit)
- Skeleton loading for revised responses
- Clean, distraction-free UI

---

## 🧩 Technology Stack

- **AI**: Gemini 3 API (Flash variant) via Genkit  
- **Frontend**: Next.js, TypeScript  
- **UI**: shadcn/ui, Tailwind CSS  
- **Backend**: Genkit AI flows  
- **Deployment**: Vercel  

---

## 🔑 Gemini 3 Usage

RealityLoop uses the **Gemini 3 API** to:
- Generate structured beliefs
- Model uncertainty and assumptions
- Revise reasoning based on human input
- Adjust confidence across iterative belief loops

The system relies on Gemini 3’s low-latency reasoning to support real-time human-AI interaction.

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+
- Gemini API key

### Installation

```bash
npm install
```

### Environment Variables

Create a .env.local file in the project root:

GEMINI_API_KEY=your_gemini_api_key_here

Run Locally
```bash
npm run dev
```

Open:
```bash
 http://localhost:3000
```

## 🌍 Deployment

This project is deployed using Vercel.

No authentication required

Publicly accessible demo

No billing dependencies

## 🧪 Testing Instructions (for Judges)

Open the deployed link

Ask any question

Provide a human correction

Observe how the AI revises its belief and confidence

## 📜 License

This project was created for the Gemini 3 Hackathon and is intended for educational and demonstration purposes.
