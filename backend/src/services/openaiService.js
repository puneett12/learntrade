const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing in environment variables");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getTutorReply = async (messages) => {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.4,
  });

  return response.choices[0].message.content;
};

module.exports = { getTutorReply };