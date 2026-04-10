import { analyzeTicketWithAI, generateAgentReply } from "../services/aiService.js";

export const analyzeTicket = async (req, res) => {
  try {
    const { title, description, categories } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const result = await analyzeTicketWithAI({
      title,
      description,
      categories: categories || [],
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("AI analyze error:", error);
    return res.status(500).json({
      message: "AI analysis failed",
      error: error.message,
    });
  }
};

export const generateReply = async (req, res) => {
  try {
    const { title, description, messages } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const result = await generateAgentReply({
      title,
      description,
      messages: messages || [],
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("AI generate reply error:", error);
    return res.status(500).json({
      message: "AI reply generation failed",
      error: error.message,
    });
  }
};