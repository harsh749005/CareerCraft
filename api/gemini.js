const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export const callGeminiAPI = async (userPrompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    // Extract the reply text
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "No response from Gemini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error fetching from Gemini.";
  }
};
