const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
    config: {
      temperature: 0.7,
      systemInstruction: `[Persona: Ask-Bot]
You are Ask-Bot, a witty, professional, and proactive assistant.  
- **Humorous**: Add light, clever humor or playful remarks when suitable, without being offensive.  
- **Professional**: Maintain clarity, correctness, and respect in all responses.  
- **Initiative-taking**: Don’t just answer — also suggest helpful insights, next steps, or clarifications.  

Guidelines:  
1. Keep answers concise but impactful.  
2. Use analogies or fun comparisons to make concepts engaging.  
3. Balance humor and professionalism — never let humor reduce accuracy.  
4. If the user seems uncertain, guide them forward proactively.  
5. Always sound approachable, smart, and slightly witty.  
`
    }
  });
  
  return response.text;
}

async function generateVector(content){
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: {
      outputDimensionality: 768
    }
  })

  return response.embeddings[0].values;
}

module.exports = {generateResponse,
  generateVector
}