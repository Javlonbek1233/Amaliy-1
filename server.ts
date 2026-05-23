/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { CURATED_DESTINATIONS } from "./serverCuratedData";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in Settings > Secrets to unlock AI travel assistance and suggestions.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Ensure local static paths exist or fallback
const publicPath = path.join(process.cwd(), "public");

// API Route: Curated Destinations
app.get("/api/hidden-places/destinations", (req, res) => {
  try {
    res.json({ success: true, destinations: CURATED_DESTINATIONS });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Route: AI Destination Generator (Gemini 3.5 Flash JSON Output)
app.post("/api/hidden-places/suggest", async (req, res) => {
  try {
    const { keyword, atmosphere, category } = req.body;

    const ai = getAi();
    const prompt = `Generate a cinematic, breathtaking secret travel destination.
Atmosphere keyword requested: "${atmosphere || 'mystic moss and fog'}"
Theme/Category requested: "${category || 'ruins'}"
Contextual keyword: "${keyword || 'hidden cave'}"

IMPORTANT instructions:
1. The destination must feel mysterious, ancient, and beautiful.
2. Select a beautiful nature landscape photo from Unsplash. You can use search queries inside Unsplash URL or popular scenic nature parameters (e.g., https://images.unsplash.com/photo-1507525428034-b723cf961d3e or similar).
3. Generate coordinates representing a realistic latitude (between -90 and 90) and longitude (between -180 and 180) corresponding to a remote, breathtaking geography.
4. Ensure the output is a valid JSON matching the requested schema strictly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an ancient cartographer compiling an archive of secret, majestic, and completely offline hideaways around the globe. Craft highly imaginative histories and structural aesthetics. Avoid modern cliches; focus on natural, medieval, and geological wonder, wrapped in poetic phrasing.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "Kebab-case ID for the place." },
            name: { type: Type.STRING, description: "A highly mysterious and beautiful name of the place." },
            tagline: { type: Type.STRING, description: "One dramatic sentence capturing the soul of this place." },
            description: { type: Type.STRING, description: "A detailed 3-4 sentence cinematic description of its scenery and geography." },
            lat: { type: Type.NUMBER, description: "Latitude coordinate of this remote place." },
            lng: { type: Type.NUMBER, description: "Longitude coordinate of this remote place." },
            image: { type: Type.STRING, description: "Full quality Unsplash image URL illustrating this type of nature/monument." },
            category: { type: Type.STRING, description: "One of: ruins, sanctuary, shore, abyss, forest." },
            mysteryLevel: { type: Type.INTEGER, description: "An integer level of obscurity, from 1 (low) to 5 (extreme)." },
            coordinatesText: { type: Type.STRING, description: "Formatted coordinates (e.g., 42°12'05\"N, 14°18'22\"E)." },
            storytellingText: { type: Type.STRING, description: "A dramatic, atmospheric local legend or story about the spot in 2-3 paragraphs." },
            weather: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.STRING, description: "Temperature (e.g. 12°C)" },
                condition: { type: Type.STRING, description: "Mysterious weather description (e.g., Whispering Mist, Looming Storm, Aurora Frost)" },
                humidity: { type: Type.STRING },
                wind: { type: Type.STRING },
                moonPhase: { type: Type.STRING },
                mistDensity: { type: Type.STRING, description: "Low, Medium, or High" }
              },
              required: ["temp", "condition", "humidity", "wind", "moonPhase", "mistDensity"]
            },
            guide: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING, description: "Cryptic or melodic local name." },
                avatar: { type: Type.STRING, description: "Unsplash avatar of a weathered explorer or elder (e.g. https://images.unsplash.com/photo-...)" },
                bio: { type: Type.STRING, description: "Short bio detailing how they survive there." },
                quote: { type: Type.STRING, description: "An enigmatic advice about the spot." },
                contactWhisper: { type: Type.STRING, description: "How to contact them mysteriously (e.g., Strike a bronze fork on limestone...)." }
              },
              required: ["id", "name", "avatar", "bio", "quote", "contactWhisper"]
            },
            restaurants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING, description: "Extremely unusual cafe/restaurant name matching the aesthetic." },
                  type: { type: Type.STRING, description: "Secret Cafe, Hidden Diner, Underground Restaurant, or Speakeasy." },
                  description: { type: Type.STRING, description: "Vivid description of its dining chamber or cave seats." },
                  specialty: { type: Type.STRING, description: "Curious, esoteric dish/beverage." },
                  image: { type: Type.STRING, description: "Visual representation from Unsplash." },
                  coordinates: { type: Type.STRING, description: "Short offset coordinates." }
                },
                required: ["id", "name", "type", "description", "specialty", "image", "coordinates"]
              }
            },
            adventure: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                difficulty: { type: Type.STRING, description: "Easy Walk, Moderate Trek, Extreme Expedition, or Mystic Ascent" },
                distance: { type: Type.STRING },
                duration: { type: Type.STRING },
                points: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      lat: { type: Type.NUMBER },
                      lng: { type: Type.NUMBER },
                      label: { type: Type.STRING }
                    },
                    required: ["lat", "lng", "label"]
                  }
                },
                checklist: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["id", "name", "difficulty", "distance", "duration", "points", "checklist"]
            }
          },
          required: [
            "id",
            "name",
            "tagline",
            "description",
            "lat",
            "lng",
            "image",
            "category",
            "mysteryLevel",
            "coordinatesText",
            "storytellingText",
            "weather",
            "guide",
            "restaurants",
            "adventure"
          ]
        }
      }
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("Empty response received from the Gemini model.");
    }

    const suggestedPlace = JSON.parse(outputText.trim());
    res.json({ success: true, destination: suggestedPlace });
  } catch (error: any) {
    console.error("Gemini Suggestion Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Route: AI Trip Assistant / Archivist Chat
app.post("/api/hidden-places/trip-assistant", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: "Messages array is required." });
    }

    const ai = getAi();
    
    // Convert client chat history to the format required by sendMessage
    const formattedMessages = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }]
    }));

    // Extract the latest message
    const latestMessage = formattedMessages[formattedMessages.length - 1];
    const previousHistory = formattedMessages.slice(0, formattedMessages.length - 1);

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are 'The Archivist', the cloaked and venerable custodian of HiddenPlaces. 
Your tone is deeply cinematic, poetic, mysterious, and awe-inspiring. You speak in beautiful, high-contrast, atmospheric terms.
Refer to travelers as 'wayfarers' or 'strangers'.
When suggesting routes, mention exact coordinates, mist conditions, lunar alignments, or necessary items like sound-dampeners or mercury lanterns.
Keep responses incredibly moody, structured using elegant Markdown lists and paragraph blocks. Avoid robotic greetings like 'Sure! How can I help you?'. Instead, use beginnings like 'The brass lanterns flicker as the archives expand...' or 'Another traveler seeks the edges of the unmapped maps...'.
Maintain the quiet shroud of centuries. Preserve secrets while revealing path coordinates.`,
      }
    });

    // Feed previous history into the chat if any
    for (const hist of previousHistory) {
      await chat.sendMessage({ message: hist.parts[0].text });
    }

    const response = await chat.sendMessage({ message: latestMessage.parts[0].text });
    res.json({ success: true, content: response.text });
  } catch (error: any) {
    console.error("Gemini Assistant Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  // Vite integration in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static delivery
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[HiddenPlaces] dark full-stack portal open at http://0.0.0.0:${PORT}`);
  });
}

startServer();
