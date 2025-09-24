
import { GoogleGenAI } from "@google/genai";
import { JournalEntry } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

type PromptData = Omit<JournalEntry, 'id'>;

export const getReflectionPrompts = async (data: PromptData): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("La funcionalidad de IA no está disponible. Configure la API_KEY.");
  }

  try {
    const prompt = `Basado en la siguiente entrada de diario de campo de un futuro docente de educación física, genera 3 o 4 preguntas abiertas y profundas para guiar su reflexión.
    
- Título: "${data.title}"
- Fecha: ${new Date(data.date).toLocaleDateString('es-ES')}
- Reflexión Principal: "${data.reflection}"
- Habilidades Desarrolladas/Observadas: "${data.skills || 'No especificado'}"
- Elementos de Deontología/Ethos: "${data.deontology || 'No especificado'}"
- Dimensiones Pedagógicas Involucradas: "${data.dimensions || 'No especificado'}"
- Etiquetas: ${data.tags.length > 0 ? data.tags.join(', ') : 'Ninguna'}
- Competencias Vinculadas: ${data.competencies.length > 0 ? data.competencies.join(', ') : 'Ninguna'}

Las preguntas deben ser alentadoras, pedagógicas y ayudar a conectar la práctica con la teoría de la formación docente, considerando los elementos proporcionados. Responde en español y formatea las preguntas como una lista con viñetas.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching reflection prompts from Gemini API:", error);
    return "Hubo un error al generar las sugerencias. Por favor, inténtalo de nuevo más tarde.";
  }
};
