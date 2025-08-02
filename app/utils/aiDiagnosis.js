// Mock function simulating OpenAI API call for symptom diagnosis
export async function analyzeSymptomsWithAI(symptoms, age, duration) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock API response based on symptoms
  const mockResponses = {
    // Headache related symptoms
    headache: {
      possibleConditions: [
        { name: "Tension Headache", confidence: 85, severity: "Mild" },
        { name: "Migraine", confidence: 60, severity: "Moderate" },
        { name: "Sinus Headache", confidence: 45, severity: "Mild" },
      ],
      recommendations: [
        "Rest in a quiet, dark room",
        "Stay hydrated",
        "Consider over-the-counter pain relievers",
        "Practice stress management techniques",
      ],
      nextSteps:
        "Consult a doctor if headache persists for more than 3 days or becomes severe",
    },

    // Fever related symptoms
    fever: {
      possibleConditions: [
        { name: "Viral Infection", confidence: 80, severity: "Mild" },
        { name: "Common Cold", confidence: 75, severity: "Mild" },
        { name: "Flu", confidence: 65, severity: "Moderate" },
      ],
      recommendations: [
        "Rest and stay hydrated",
        "Take acetaminophen or ibuprofen for fever",
        "Monitor temperature regularly",
        "Stay home to avoid spreading illness",
      ],
      nextSteps:
        "Seek medical attention if fever exceeds 103°F or persists beyond 3 days",
    },

    // Cough related symptoms
    cough: {
      possibleConditions: [
        {
          name: "Upper Respiratory Infection",
          confidence: 85,
          severity: "Mild",
        },
        { name: "Bronchitis", confidence: 70, severity: "Moderate" },
        { name: "Allergies", confidence: 55, severity: "Mild" },
      ],
      recommendations: [
        "Stay hydrated with warm liquids",
        "Use honey for natural cough relief",
        "Consider over-the-counter cough suppressants",
        "Use a humidifier",
      ],
      nextSteps:
        "See a doctor if cough persists for more than 2 weeks or produces colored mucus",
    },

    // Fatigue related symptoms
    fatigue: {
      possibleConditions: [
        { name: "Sleep Deprivation", confidence: 80, severity: "Mild" },
        { name: "Stress/Anxiety", confidence: 70, severity: "Mild" },
        { name: "Iron Deficiency", confidence: 45, severity: "Moderate" },
      ],
      recommendations: [
        "Ensure 7-9 hours of quality sleep",
        "Practice stress management",
        "Maintain a balanced diet",
        "Exercise regularly",
      ],
      nextSteps: "Consult a doctor if fatigue persists for more than 2 weeks",
    },

    // Stomach related symptoms
    stomach: {
      possibleConditions: [
        { name: "Food Poisoning", confidence: 75, severity: "Moderate" },
        { name: "Gastritis", confidence: 65, severity: "Mild" },
        { name: "Viral Gastroenteritis", confidence: 60, severity: "Moderate" },
      ],
      recommendations: [
        "Stay hydrated with clear fluids",
        "Follow BRAT diet (bananas, rice, applesauce, toast)",
        "Avoid dairy and fatty foods",
        "Rest and avoid strenuous activity",
      ],
      nextSteps:
        "Seek medical attention if symptoms persist beyond 24 hours or include severe pain",
    },
  };

  // Analyze symptoms and find matching conditions
  const symptomText = symptoms.toLowerCase();
  let diagnosis = {
    possibleConditions: [
      { name: "Common Cold", confidence: 85, severity: "Mild" },
      { name: "Seasonal Allergies", confidence: 70, severity: "Mild" },
      { name: "Sinus Infection", confidence: 45, severity: "Moderate" },
    ],
    recommendations: [
      "Rest and stay hydrated",
      "Consider over-the-counter decongestants",
      "Monitor symptoms for 3-5 days",
      "Seek medical attention if symptoms worsen",
    ],
    nextSteps:
      "Schedule a follow-up with your doctor if symptoms persist beyond 10 days",
  };

  // Check for specific symptoms and adjust diagnosis
  for (const [symptom, response] of Object.entries(mockResponses)) {
    if (symptomText.includes(symptom)) {
      diagnosis = response;
      break;
    }
  }

  // Adjust based on age
  if (age < 18) {
    diagnosis.recommendations.push(
      "Consult with a pediatrician for age-appropriate treatment"
    );
  } else if (age > 65) {
    diagnosis.recommendations.push(
      "Monitor closely as symptoms may progress differently in older adults"
    );
  }

  // Adjust based on duration
  if (duration === "More than 1 week") {
    diagnosis.severity = "Moderate";
    diagnosis.recommendations.push(
      "Consider scheduling a doctor appointment for persistent symptoms"
    );
  }

  // Add AI-generated insights
  diagnosis.aiInsights = {
    confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
    analysisTime: "2.3 seconds",
    symptomsAnalyzed: symptoms.split(" ").length,
    ageConsideration: age ? `Patient age: ${age} years` : "Age not specified",
    durationImpact: duration
      ? `Duration: ${duration}`
      : "Duration not specified",
  };

  return {
    success: true,
    data: diagnosis,
    timestamp: new Date().toISOString(),
    model: "gpt-4-turbo-preview",
    usage: {
      prompt_tokens: Math.floor(Math.random() * 500) + 1000,
      completion_tokens: Math.floor(Math.random() * 300) + 500,
      total_tokens: Math.floor(Math.random() * 800) + 1500,
    },
  };
}

// Mock function for getting treatment recommendations
export async function getTreatmentRecommendations(condition, age, severity) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const treatments = {
    "Tension Headache": {
      immediate: [
        "Rest in quiet environment",
        "Apply cold compress",
        "Take acetaminophen",
      ],
      preventive: [
        "Practice stress management",
        "Maintain good posture",
        "Regular exercise",
      ],
      avoid: ["Caffeine", "Bright lights", "Loud noises"],
    },
    Migraine: {
      immediate: [
        "Rest in dark room",
        "Take prescribed medication",
        "Apply cold compress",
      ],
      preventive: [
        "Identify triggers",
        "Regular sleep schedule",
        "Stress management",
      ],
      avoid: ["Bright lights", "Loud sounds", "Strong odors"],
    },
    "Common Cold": {
      immediate: ["Rest", "Stay hydrated", "Over-the-counter decongestants"],
      preventive: ["Good hand hygiene", "Balanced diet", "Adequate sleep"],
      avoid: ["Smoking", "Alcohol", "Excessive physical activity"],
    },
  };

  return {
    condition,
    treatments: treatments[condition] || treatments["Common Cold"],
    ageConsiderations:
      age < 18 ? "Pediatric dosing may be required" : "Standard adult dosing",
    severity: severity,
  };
}
