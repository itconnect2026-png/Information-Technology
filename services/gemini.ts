import { GoogleGenAI, Type } from "@google/genai";
import { DesignType, GeneratedDesign, DecorativeElement, BackgroundPattern } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PALETTE = ['#FF8F8F', '#FFF1CB', '#C2E2FA', '#B7A3E3'];
const PATTERNS: BackgroundPattern[] = ['solid', 'dots', 'grid', 'lines', 'gradient', 'mesh'];

const getRandomColor = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];

const generateRandomGraphics = (): DecorativeElement[] => {
  // Generate 3 to 6 random elements for background
  const count = Math.floor(Math.random() * 4) + 3;
  const elements: DecorativeElement[] = [];

  for (let i = 0; i < count; i++) {
    const size = Math.floor(Math.random() * 400) + 150; 
    const isBlob = Math.random() > 0.3;
    
    elements.push({
      id: `deco-${i}-${Date.now()}`,
      type: isBlob ? 'blob' : 'circle',
      style: {
        position: 'absolute',
        top: `${Math.random() * 120 - 10}%`, 
        left: `${Math.random() * 120 - 10}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: getRandomColor(),
        opacity: Math.random() * 0.5 + 0.2,
        transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
        borderRadius: isBlob 
          ? `${Math.random() * 40 + 30}% ${Math.random() * 40 + 30}% ${Math.random() * 40 + 30}% ${Math.random() * 40 + 30}%` 
          : '50%',
        filter: 'blur(60px)', // Strong blur for soft background effect
        zIndex: 0,
      }
    });
  }
  return elements;
};

export const generateDesignContent = async (
  textInput: string,
  type: DesignType
): Promise<GeneratedDesign> => {
  
  const prompt = `
    Act as a senior graphic designer for "PR Quick Design System".
    Generate a creative design structure for a "${type}" based on the text: "${textInput}".

    STRICT DESIGN RULES:
    1. Use ONLY these colors for accents/graphics: #FF8F8F, #FFF1CB, #C2E2FA, #B7A3E3.
    2. Background should be White (#FFFFFF), very light Gray (#F8F9FA), or a very light tint of the palette.
    3. Select a 'layoutStyle' from: 'minimal', 'bold', 'creative', 'modern'.
    4. Ensure 'textColor' has high contrast with the background (usually dark gray or black).
    5. Content must be in Thai.
    
    Output valid JSON only.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          subheadline: { type: Type.STRING },
          bodyText: { type: Type.STRING },
          accentColor: { type: Type.STRING },
          backgroundColor: { type: Type.STRING },
          textColor: { type: Type.STRING },
          emojiIcon: { type: Type.STRING },
          layoutStyle: { type: Type.STRING, enum: ["minimal", "bold", "creative", "modern"] }
        },
        required: ["headline", "subheadline", "bodyText", "accentColor", "backgroundColor", "emojiIcon", "layoutStyle"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("No response from AI");
  }

  const parsed = JSON.parse(resultText);

  // Inject random graphics client-side to ensure uniqueness every time, even for same input
  // Also Randomize the accent color from the palette to ensure visual variety on every click
  const randomAccent = getRandomColor();
  const randomPattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];

  return {
    ...parsed,
    accentColor: randomAccent, // Override AI color to guarantee randomness
    backgroundPattern: randomPattern,
    decorativeElements: generateRandomGraphics(),
    textColor: parsed.textColor || '#1F2937'
  } as GeneratedDesign;
};