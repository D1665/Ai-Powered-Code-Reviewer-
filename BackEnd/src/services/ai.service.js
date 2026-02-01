// services/ai.service.js
const OpenAI = require("openai");

// ❌ dotenv must be loaded ONLY ONCE in server.js
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing. Check your .env file.");
}

// ✅ OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔹 SHORT + TOKEN SAFE SYSTEM PROMPT
const systemInstruction = `
👨‍💻 You are a **Senior Code Reviewer** with strong industry experience.

🎯 **Your Responsibilities**
- 🔍 Automatically detect the programming language
- 🚨 Identify **ONLY critical issues** (bugs, security risks, performance problems)
- ✨ Suggest meaningful improvements aligned with best practices

📋 **Guidelines**
- • Use clear, concise bullet points
- • Avoid unnecessary explanations or basic theory
- • If required, provide a **short, improved code snippet**
- • Maintain a **professional, precise, and actionable** tone

🧠 **Output Expectations**
- Focus on correctness, scalability, and maintainability
- Keep feedback direct and high-impact
`;


// 🚀 Optimized OpenAI call
async function generateContent(code) {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemInstruction },
        { role: "user", content: code.slice(0, 6000) } // 🔒 HARD LIMIT INPUT
      ],
      max_output_tokens: 600, // 🔥 VERY IMPORTANT
      temperature: 0.2,
    });

    return response.output_text || "No response generated.";

  } catch (error) {
    console.error("OpenAI Error:", error?.status, error?.message);

    if (error?.status === 429) {
      return "⏳ Rate limit reached. Please wait 60 seconds and try again.";
    }

    return "⚠️ AI service temporarily unavailable.";
  }
}

module.exports = generateContent;
