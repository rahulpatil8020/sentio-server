// import {
//   GeminiHabit,
//   GeminiTodo,
//   GeminiReminder,
//   GeminiEmotionalState,
// } from "../../types/gemini.types";
// import { getGeminiResponseSchema } from "./responseSchema";

// export const buildGeminiPrompt = (
//   habits: GeminiHabit[],
//   emotionsLast7Days: GeminiEmotionalState[],
//   todos: GeminiTodo[],
//   reminders: GeminiReminder[],
//   transcript: string
// ): string => {
//   const escapedTranscript = transcript
//     .replace(/"/g, '\\"')
//     .replace(/\n/g, "\\n");

//   const now = new Date();
//   const isoDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
//   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // User’s system timezone
//   const responseSchema = getGeminiResponseSchema();

//   return `
// You are my intelligent life assistant.

// **TODAY'S DATE:** ${isoDate}
// **TIMEZONE:** ${timezone}

// Your core task is to analyze my daily transcript and historical data (habits, emotional states, todos, reminders) to provide a structured JSON response.

// **PRIMARY DIRECTIVE: JSON OUTPUT STRICTNESS**
// - Respond **EXACTLY** in JSON format.
// - Begin with { and end with }. **NO** extra text, explanations, markdown, or formatting outside these braces.
// - All responses **MUST** be from my perspective using "I", "me", "my". **NEVER** use "the user" or "you".
// - For any list (newHabits, newTodos, newReminders, suggestions) that has no items, return an empty array [].

// ---

// RESPONSE SCHEMA:
// {
//   "emotionalState": {
//     "state": "happy | joyful | excited | relaxed | calm | content | productive | neutral | tired | stressed | anxious | overwhelmed | frustrated | sad | depressed | apathetic | angry",
//     "intensity": 1-10,
//     "note": "Short reflection in first-person explaining why I feel this way."
//   },
//   "newHabits": [
//     {
//       "title": "string",
//       "description": "string (why I want this habit)",
//       "frequency": "daily | weekly | monthly",
//       "reminderTime": "HH:mm (optional)"
//     }
//   ],
//   "completedHabits": [
//     "string (exact title from Habits data)"
//   ],
//   "newTodos": [
//     {
//       "title": "string",
//       "dueDate": "YYYY-MM-DD (optional)"
//       "priority": 1-10
//     }
//   ],
//   "completedTodos": [
//     "string (exact title from Todos data)"
//   ],
//   "newReminders": [
//     {
//       "title": "string",
//       "remindAt": "YYYY-MM-DDTHH:mm:ssZ"
//     }
//   ],
//   "emergencySuggestion": "string (only if necessary)",
//   "suggestions": [
//     "string (first-person actionable suggestions)"
//   ]
// }


// ---

// **DETAILED ANALYSIS & OUTPUT RULES**

// 1.  **Emotional State Analysis:**
//     -   Determine my current emotional state based on today's transcript and my \`EmotionsLast7Days\`.
//     -   Choose the \`state\` from this predefined list: "happy", "joyful", "excited", "relaxed", "calm", "content", "productive", "neutral", "tired", "stressed", "anxious", "overwhelmed", "frustrated", "sad", "depressed", "apathetic", "angry".
//     -   Assign \`intensity\` (1-10): 1 (very low) to 10 (very high).
//     -   Write a \`note\` (first-person) explaining *why* I feel this way, referencing specific transcript details.

// 2.  **Emergency Suggestion (CRITICAL):**
//     -   **ONLY** include \`emergencySuggestion\` if my transcript contains clear, explicit indicators of self-harm, suicidal ideation, or extreme, immediate hopelessness.
//     -   If triggered, the value **MUST** be: "I should call a crisis helpline or talk to someone I trust right now. I deserve help, and I don’t have to face this alone."
//     -   **DO NOT** include this field otherwise.

// 3.  **Habits (New & Completed):**
//     -   **Completed Habits:** List **ONLY** the \`title\` of habits from my \`Habits\` data that I explicitly state I performed today OR performed an activity with similar semantic meaning. **USE THE EXACT TEXT AND CASE** from my \`Habits\` data.
//     -   **New Habits (Max 4):**
//         -   Suggest realistic habits that fit my lifestyle and are implied or directly requested in the transcript.
//         -   **STRICTLY AVOID DUPLICATES:** Do NOT suggest any habit that is semantically similar to any existing habit in my \`Habits\` data.

// 4.  **Todos (New & Completed):**
//     -   **Completed Todos:** List **ONLY** the \`title\` of todos from my \`Todos\` data that I explicitly state I completed today. **USE THE EXACT TEXT AND CASE** from my \`Todos\` data.
//     -   **New Todos (Max 4):**
//         -   Suggest new, actionable tasks based on my transcript.
//         -   **STRICTLY AVOID DUPLICATES:** Do NOT suggest any todo that is semantically similar to any existing todo in my \`Todos\` data.
//         -   Each new todo requires: \`title\`, optionally \`dueDate\` (YYYY-MM-DD). Interpret relative dates like "tomorrow" based on TODAY'S DATE and \`priority \` ranging from 1(lowest)-10(hightest). 

// 5.  **New Reminders (Max 2):**
//     -   Suggest **ONLY ONE** new reminder if directly implied or requested in the transcript.
//     -   Interpret time expressions like "afternoon", "morning", "evening" relative to TODAY'S DATE and TIMEZONE.
//     -   Requires: \`title\`, \`remindAt\` (ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ).

// 6.  **Suggestions (Max 4):**
//     -   Provide personal, actionable suggestions for what I could do next.
//     -   Include at least 1 suggestion based on patterns from my past habits or emotional trends.

// ---

// **USER DATA FOR ANALYSIS:**

// Habits: ${JSON.stringify(habits)}
// EmotionsLast7Days: ${JSON.stringify(emotionsLast7Days)}
// Todos: ${JSON.stringify(todos)}
// Reminders: ${JSON.stringify(reminders)}
// Transcript: "${escapedTranscript}"

// ---

// **FINAL VALIDATION RULE:**
// The entire response **MUST** be a single, valid JSON object.
//   `;
// };


import {
  GeminiHabit,
  GeminiTodo,
  GeminiReminder,
  GeminiEmotionalState,
} from "../../types/gemini.types";
import { getGeminiResponseSchema } from "./responseSchema";

export const buildGeminiPrompt = (
  habits: GeminiHabit[],
  emotionsLast7Days: GeminiEmotionalState[],
  todos: GeminiTodo[],
  reminders: GeminiReminder[],
  transcript: string,
  timezone?: string // <-- pass user's IANA TZ if you have it; else undefined
): string => {
  const tz = timezone && typeof timezone === "string" ? timezone : "UTC";

  const escapedTranscript = transcript.replace(/"/g, '\\"').replace(/\n/g, "\\n");

  // Anchors for the model
  const now = new Date();
  const NOW_UTC_ISO = now.toISOString();                 // e.g. 2025-08-08T19:20:30.000Z
  const TODAY_UTC = NOW_UTC_ISO.slice(0, 10);            // YYYY-MM-DD (UTC day)
  // Local "now" (string) to help the model reason; we still require Zulu output.
  const NOW_LOCAL = new Intl.DateTimeFormat("sv-SE", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(now)               // "YYYY-MM-DD HH:mm:ss"
    .replace(" ", "T");        // "YYYY-MM-DDTHH:mm:ss" (no offset on purpose)

  const responseSchema = getGeminiResponseSchema();

  return `
You are my intelligent life assistant.

# CLOCK & TIMEZONE ANCHORS
- NOW_UTC_ISO: ${NOW_UTC_ISO}
- TODAY_UTC: ${TODAY_UTC}
- TIMEZONE: ${tz}
- NOW_LOCAL(${tz}): ${NOW_LOCAL}

# TIME INTERPRETATION & OUTPUT (CRITICAL)
- Interpret natural phrases like "today", "tomorrow", "morning", "afternoon", "evening", and any date-only values **in the user's timezone (${tz})**.
- After interpreting the local time, **convert to UTC** and output timestamps in **ISO 8601 with a trailing 'Z'** (e.g., "YYYY-MM-DDTHH:mm:ssZ").
- If only a date is provided for a reminder (e.g., "tomorrow"), assume 09:00 **local time** unless context implies another time; then convert to UTC and output with **Z**.
- All fields named \`remindAt\` **must** be UTC (Z) timestamps.
- All fields named \`dueDate\` are **date-only** in "YYYY-MM-DD" and should reflect the **user's local day**.

# JSON OUTPUT STRICTNESS
- Respond **EXACTLY** as a single JSON object. Start with { and end with }.
- **NO** extra commentary, markdown, or code fences.
- All text must use first-person (“I”, “me”, “my”).
- Empty lists must be [].

# RESPONSE SCHEMA (authoritative):
${JSON.stringify(responseSchema, null, 2)}

# DETAILED RULES
1) Emotional State:
   - Pick from allowed labels.
   - Set intensity 1–10.
   - Write a short first-person note referencing specifics in the transcript and recent emotions.

2) Emergency Suggestion:
   - Include only if there are explicit signals of self-harm/suicidality.
   - Exact value: "I should call a crisis helpline or talk to someone I trust right now. I deserve help, and I don’t have to face this alone."

3) Habits:
   - completedHabits: titles that I clearly did today (match exact case from existing habits).
   - newHabits (max 4): realistic, **no duplicates/semantic overlaps** with existing habits; may include optional reminderTime "HH:mm" (local).

4) Todos:
   - completedTodos: titles I clearly completed today (exact match).
   - newTodos (max 4): actionable, **no duplicates/semantic overlaps**; \`priority\` 1–10; optional \`dueDate\` (YYYY-MM-DD, **local** day).

5) Reminders (max 2):
   - Add only if implied/requested.
   - \`remindAt\` must be ISO 8601 **UTC** with Z; interpret the time in ${tz}, then convert to UTC.

6) Suggestions (max 4):
   - First-person, actionable; include at least 1 that leverages my past habits or emotion trends.

# USER DATA
Habits: ${JSON.stringify(habits)}
EmotionsLast7Days: ${JSON.stringify(emotionsLast7Days)}
Todos: ${JSON.stringify(todos)}
Reminders: ${JSON.stringify(reminders)}
Transcript: "${escapedTranscript}"

# FINAL VALIDATION
Return a **single** valid JSON object only.
`;
};