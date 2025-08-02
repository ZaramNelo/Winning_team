const OpenAI = require('openai');
const path = require('path');

// Load environment variables from the .env file in the root directory
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatGPTService {
  async getResponse(userMessage) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful medical assistant. When users describe symptoms, provide: 1) Possible conditions that might cause these symptoms, 2) General pharmacy/over-the-counter medications that might help, 3) A clear recommendation to consult with a healthcare professional for proper diagnosis and treatment. Always include medical disclaimers and emphasize the importance of professional medical advice."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('ChatGPT API Error:', error);
      throw new Error('Failed to get response from ChatGPT');
    }
  }

  async getMedicalResponse(symptoms) {
    try {
      const medicalPrompt = `User symptoms: ${symptoms}
      
Please provide:
1. Possible medical conditions that could cause these symptoms
2. Over-the-counter medications or pharmacy products that might provide relief
3. When to seek immediate medical attention
4. General health advice

Important: This is for informational purposes only and should not replace professional medical advice.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable medical information assistant. Provide helpful, accurate medical information while always emphasizing the importance of consulting healthcare professionals. Include relevant pharmacy recommendations and medical disclaimers."
          },
          {
            role: "user",
            content: medicalPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.6,
      });

      return response.choices[0]?.message?.content || "Sorry, I couldn't generate a medical response.";
    } catch (error) {
      console.error('Medical ChatGPT API Error:', error);
      throw new Error('Failed to get medical response from ChatGPT');
    }
  }
}

module.exports = ChatGPTService;
