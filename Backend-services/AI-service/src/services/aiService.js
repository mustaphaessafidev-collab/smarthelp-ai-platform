import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeTicketWithAI = async ({ title, description, categories = [] }) => {
  const categoriesList = categories.length
    ? categories.map((c) => `- ${c.name}`).join("\n")
    : "- Technique\n- Compte\n- Facturation\n- Général";

  const prompt = `
Tu es un assistant IA pour un helpdesk.

Ta tâche:
1. Résumer le ticket en une phrase courte
2. Choisir UNE catégorie uniquement parmi la liste fournie
3. Estimer la priorité parmi: LOW, MEDIUM, HIGH, URGENT
4. Suggérer une première réponse professionnelle pour l’agent

Important:
- predictedCategory doit être EXACTEMENT un nom présent dans la liste
- suggestedPriority doit être EXACTEMENT: LOW, MEDIUM, HIGH ou URGENT
- Réponds uniquement en JSON valide

Liste des catégories disponibles:
${categoriesList}

Format JSON exact:
{
  "summary": "string",
  "predictedCategory": "string",
  "suggestedPriority": "LOW | MEDIUM | HIGH | URGENT",
  "suggestedReply": "string"
}

Titre:
${title}

Description:
${description}
`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: "Tu es un assistant IA spécialisé dans le support helpdesk.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No AI response received");
  }

  return JSON.parse(content);
};

export const generateAgentReply = async ({ title, description, messages = [] }) => {
  const conversationHistory = messages
    .map((msg) => `${msg.type === "USER" ? "Client" : "Agent"}: ${msg.content}`)
    .join("\n");

  const prompt = `
Tu es un agent support professionnel et empathique pour un helpdesk.

Contexte du ticket:
Titre: ${title}
Description: ${description}

Historique de conversation:
${conversationHistory || "Aucun message pour le moment"}

Ta tâche:
Génère une réponse professionnelle et utile pour continuer la conversation avec le client.
- Sois courtois et empathique
- Propose une solution ou des étapes de dépannage
- Sois concis et clair
- Si le problème semble résolu, propose de conclure le ticket

Réponds directement sans explications supplémentaires, uniquement le message.
`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content:
          "Tu es un agent support professionnel. Réponds uniquement par le message à envoyer au client.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const reply = completion.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("No AI reply generated");
  }

  return { reply };
};