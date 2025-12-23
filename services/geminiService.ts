
import { GoogleGenAI } from "@google/genai";

export const getTechnicalSupport = async (fault: string, state: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user is interacting with a Hot-Well Gas Boiler Emulator. 
    The current boiler state is: ${JSON.stringify(state)}.
    The current active fault is: ${fault}.
    
    Based on the technical documentation (Hot-Well Standart/Smart/Intellect), provide a brief, professional technical advice in Russian for the service technician. Focus on what to check physically (valves, sensors, filters) based on the documentation logic.`,
    config: {
      systemInstruction: "You are a senior HVAC service engineer for Hot-Well boilers. Provide concise technical guidance in Russian."
    }
  });

  const response = await model;
  return response.text;
};
