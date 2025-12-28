
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateGrantSummary = async (reportData: any, quotes: string[]) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Cohort report data:
    - Participants: ${reportData.participants}
    - Sessions: ${reportData.sessions}
    - Completion rate: ${reportData.completionRatePercent}%
    - Pre averages: connection ${reportData.preAverages.connection}, stress ${reportData.preAverages.stress}, efficacy ${reportData.preAverages.efficacy}
    - Post averages: connection ${reportData.postAverages.connection}, stress ${reportData.postAverages.stress}, efficacy ${reportData.postAverages.efficacy}
    - Changes: connection ${reportData.deltas.connectionChange}, stress ${reportData.deltas.stressChange}, efficacy ${reportData.deltas.efficacyChange}
    Selected consented quotes:
    ${quotes.join('\n')}

    Task:
    1) Write a 150–200 word narrative summary for a grant report.
    2) Provide 5 bullets: Outcomes, Completion, Cultural Resonance, Facilitator Insight, Next Steps.
    Keep language grounded, non-extractive, and aligned with Indigenous Genius pillars (Healing, Heritage, Connection).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "You are a culturally respectful program reporter. Write concise, funder-friendly summaries with clear metrics and human-centered highlights."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate summary. Please check your API key or data.";
  }
};

export const getWorksheetGuidance = async (week: number, question: string) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `I am a participant in the Indigenous Genius healing circle. We are in ${week === 1 ? 'Week 1: Sacred Space' : week === 2 ? 'Week 2: River of Release' : week === 3 ? 'Week 3: Mirror' : 'Week 4: Medicine Bundle'}. I am looking for inspiration for the question: "${question}". Can you offer some gentle, culturally resonant prompts or perspectives to help me reflect? Keep it brief and supportive.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "The spirit of the circle is with you. Take a deep breath and let your heart guide your writing.";
  }
};
