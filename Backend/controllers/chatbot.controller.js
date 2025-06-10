const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
module.exports.generateChatBotResponse = async (req, res) => {
  console.log("Chatbot request received:", req.body);
  const { message } = req.body;
  const userId = req.user._id;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message format" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
    });
    return res.status(200).json({
      success: true,
      message: response.text,
      data: {
        userId,
        message,
      },
    });
  } catch (error) {
    console.error("Error generating chatbot response:", error);
    return res.status(500).json({ error: "Failed to generate response" });
  }
};
