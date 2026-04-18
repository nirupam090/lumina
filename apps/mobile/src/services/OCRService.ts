/**
 * OCRService — Real Image-to-Timetable Extraction
 * 
 * Uses Google Gemini Vision API to analyze uploaded timetable images.
 * Extracts structured class data: subject, time, room, day, faculty.
 * 
 * NOTE: For testing phase (Expo Go). In production (Dev Client),
 * replace with native Tesseract WASM / ML Kit for full offline support.
 */

import * as FileSystem from 'expo-file-system';

// User should set their Gemini API key here
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface OCRExtractedClass {
  name: string;
  shortCode: string;
  time: string;
  room: string;
  day: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri
  faculty: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'break';
}

export interface OCRResult {
  success: boolean;
  method: string;
  confidence: number;
  classes: OCRExtractedClass[];
  rawText: string;
  error?: string;
}

const SYSTEM_PROMPT = `You are analyzing an image of a college/university class timetable/schedule.

Extract ALL classes visible in the timetable and return them as a JSON array.

For each class, provide:
- "name": Full subject name (expand abbreviations if possible, e.g., "OS" -> "Operating Systems", "DAA" -> "Design & Analysis of Algorithms", "CCN" -> "Computer Communication Networks")
- "shortCode": The abbreviation shown in timetable (e.g., "OS", "DAA")
- "time": Time slot as shown (e.g., "9:00 – 10:00")
- "room": Room/Lab number (e.g., "508", "Lab 2B")
- "day": Day number (0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday)
- "faculty": Faculty name/initials if visible (e.g., "Prof. SK")
- "type": "lecture", "lab", "tutorial", or "break"

Rules:
1. Extract EVERY class slot, including labs (which often span 2 hours)
2. Skip break/lunch rows
3. If a slot shows batch-wise classes (e.g., "OS/A/Room, DAA/B/Room"), create ONE entry with name "OS / DAA / CCN / PCS (Batch Labs)" and type "lab"
4. Parse the day from column headers (Monday, Tuesday, etc.)
5. Be thorough — do not miss any class

Return ONLY valid JSON in this exact format with no markdown:
{"classes": [...], "confidence": 85, "institution": "detected name"}`;

export class OCRService {
  
  /**
   * Analyze a timetable image using Gemini Vision API
   */
  async analyzeImage(imageUri: string): Promise<OCRResult> {
    // Check if API key is set
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      return {
        success: false,
        method: 'GEMINI_VISION',
        confidence: 0,
        classes: [],
        rawText: '',
        error: 'GEMINI_API_KEY not configured. Please set your API key in OCRService.ts',
      };
    }

    try {
      // Read image as base64
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      // Determine MIME type
      const mimeType = imageUri.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg';

      // Call Gemini Vision API
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: SYSTEM_PROMPT },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4096,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          method: 'GEMINI_VISION',
          confidence: 0,
          classes: [],
          rawText: errorText,
          error: `API Error (${response.status}): ${errorText.substring(0, 200)}`,
        };
      }

      const data = await response.json();
      const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse JSON from response (handle potential markdown wrapping)
      let cleanJson = textContent.trim();
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
      }

      const parsed = JSON.parse(cleanJson);
      const classes: OCRExtractedClass[] = (parsed.classes || []).map((c: any) => ({
        name: c.name || c.subject || 'Unknown',
        shortCode: c.shortCode || c.code || '',
        time: c.time || c.timeSlot || '',
        room: c.room || '',
        day: typeof c.day === 'number' ? c.day : 0,
        faculty: c.faculty || c.professor || '',
        type: c.type || 'lecture',
      }));

      return {
        success: true,
        method: 'GEMINI_VISION',
        confidence: parsed.confidence || 90,
        classes,
        rawText: textContent,
      };

    } catch (error: any) {
      return {
        success: false,
        method: 'GEMINI_VISION',
        confidence: 0,
        classes: [],
        rawText: '',
        error: error.message || 'Unknown error during OCR',
      };
    }
  }
}
