import axios from "axios";
import { AnalyzeTranscriptResponse } from "../../types/gemini.types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 500; // 500ms

export async function analyzeTranscriptWithGemini(
  prompt: string
): Promise<AnalyzeTranscriptResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  let retries = 0;

  while (retries <= MAX_RETRIES) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          safetySettings: [
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE",
            },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            {
              category: "HARM_CATEGORY_CIVIC_INTEGRITY",
              threshold: "BLOCK_NONE",
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 20000, // 10 seconds timeout
        }
      );

      const candidates = response.data.candidates;
      const text = candidates?.[0]?.content?.parts?.[0]?.text || "";

      const cleanedResponse = cleanGeminiResponse(text);
      const data = JSON.parse(cleanedResponse);
      return data;
    } catch (err: any) {
      retries++;
      console.error(
        `🔥 Gemini API Error (retry ${retries}/${MAX_RETRIES}):`,
        err.response?.data || err.message
      );

      if (retries <= MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        throw new Error("Failed to get response from Gemini API after retries");
      }
    }
  }
  return Promise.reject(new Error("Failed to get response from Gemini API"));
}

function cleanGeminiResponse(raw: string): string {
  return raw
    .replace(/```json|```/g, "") // Remove ```json and ```
    .trim(); // Trim whitespace and newlines
}

// import axios from "axios";

// export async function analyzeTranscriptWithGemini(
//   prompt: string
// ): Promise<string> {
//   const apiKey = process.env.GEMINI_API_KEY;

//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
//       {
//         contents: [{ parts: [{ text: prompt }] }],
//         safetySettings: [
//           { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
//           {
//             category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
//             threshold: "BLOCK_NONE",
//           },
//           {
//             category: "HARM_CATEGORY_DANGEROUS_CONTENT",
//             threshold: "BLOCK_NONE",
//           },
//           { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
//           {
//             category: "HARM_CATEGORY_CIVIC_INTEGRITY",
//             threshold: "BLOCK_NONE",
//           },
//         ],
//       },
//       {
//         headers: { "Content-Type": "application/json" },
//         timeout: 20000, // 10 seconds timeout
//       }
//     );

//     const candidates = response.data.candidates;
//     const text = candidates?.[0]?.content?.parts?.[0]?.text || "";

//     return text;
//   } catch (err: any) {
//     console.error("🔥 Gemini API Error:", err.response?.data || err.message);
//     throw new Error("Failed to get response from Gemini API");
//   }
// }
