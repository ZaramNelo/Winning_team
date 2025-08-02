"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function chunkText(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function generateDiagnosis(symptoms, age, duration) {
  if (!symptoms) {
    return { success: false, error: "No symptoms provided." };
  }

  const chunkSize = 2000; // Adjust chunk size as needed
  const textChunks = chunkText(symptoms, chunkSize);
  const allDiagnoses = [];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            'You are an AI medical assistant that provides diagnostic analysis based on symptoms, age, and duration. Return the diagnosis in a structured JSON format with the following schema:\n\n{\n  "primaryDiagnosis": "string",\n  "confidence": "number (0-100)",\n  "differentialDiagnoses": ["string", "string", "string"],\n  "recommendedTests": ["string", "string"],\n  "treatmentOptions": ["string", "string"],\n  "urgency": "low|medium|high",\n  "notes": "string"\n}.\n\nProvide a comprehensive diagnostic analysis based on the symptoms, patient age, and duration of symptoms.',
        },
        {
          role: "user",
          content: `Analyze the following patient information to provide a diagnostic assessment:\n\nSymptoms: ${symptoms}\nAge: ${
            age || "Not specified"
          }\nDuration: ${duration || "Not specified"}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.3, // Lower temperature for more consistent medical analysis
    });

    const diagnosis = response.choices?.[0]?.message?.content;
    console.log(diagnosis);

    // Check if we got a valid response
    if (!diagnosis) {
      return {
        success: false,
        error: "Diagnosis could not be generated",
      };
    }

    // Parse the response to ensure it is in the correct format
    let parsedDiagnosis;
    try {
      parsedDiagnosis = JSON.parse(diagnosis);
    } catch (parseError) {
      console.error("Failed to parse diagnosis JSON:", parseError);
      return {
        success: false,
        error: "Failed to parse diagnosis JSON: " + parseError.message,
      };
    }

    return {
      success: true,
      data: parsedDiagnosis,
    };
  } catch (error) {
    return {
      success: false,
      error: "Error generating diagnosis",
    };
  }
}
