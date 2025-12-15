import { GoogleGenAI } from "@google/genai";

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateZenScolding = async (disturbanceLevel: number): Promise<string> => {
  try {
    const ai = getClient();
    
    // Choose model based on simple text task
    const modelId = 'gemini-2.5-flash';

    const prompt = `
      The user is using an app called "The Void" where the goal is to do absolutely nothing.
      However, the user is moving their mouse or clicking, causing a disturbance level of ${disturbanceLevel} (scale 1-100).
      
      Act as a strict but humorous Zen Master. 
      Write a very short, single sentence (max 15 words) scolding the user for not doing nothing.
      Be cryptic, profound, or slightly passive-aggressive.
      Do not use quotes. Just the text.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        maxOutputTokens: 50,
        temperature: 1.2, // High creativity for varied insults
      }
    });

    return response.text || "Silence is golden. Movement is error.";
  } catch (error) {
    console.error("The void failed to speak:", error);
    return "The void is silent, yet you still disturb it.";
  }
};
