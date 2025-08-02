import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message, isSymptomQuery } = await request.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    let messages;
    let maxTokens = 300;

    if (isSymptomQuery) {
      // Medical/symptom specific response
      messages = [
        {
          role: "system",
          content: "You are a helpful medical information assistant. When users describe symptoms, provide: 1) Possible conditions that might cause these symptoms, 2) Over-the-counter medications or pharmacy products that might help, 3) When to seek immediate medical attention, 4) Important medical disclaimers. Always emphasize consulting healthcare professionals for proper diagnosis."
        },
        {
          role: "user",
          content: `Symptoms described: ${message}

Please provide:
- Possible medical conditions
- Pharmacy/OTC medication suggestions
- When to see a doctor
- Important disclaimers

Format the response clearly with sections.`
        }
      ];
      maxTokens = 500;
    } else {
      // General chat response
      messages = [
        {
          role: "system",
          content: "You are a helpful assistant. Provide clear and helpful responses to user questions."
        },
        {
          role: "user",
          content: message
        }
      ];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return Response.json({
      success: true,
      response: response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.",
      timestamp: new Date().toISOString(),
      type: isSymptomQuery ? 'medical' : 'general'
    });
  } catch (error) {
    console.error('ChatGPT API Error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
