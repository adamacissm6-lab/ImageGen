
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const editImage = async (
  imageBase64: string,
  prompt: string,
  mimeType: string = 'image/png'
): Promise<string> => {
  const ai = getAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64.split(',')[1], // Remove prefix like data:image/png;base64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No response from the model");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("The model did not return an image part.");
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};
