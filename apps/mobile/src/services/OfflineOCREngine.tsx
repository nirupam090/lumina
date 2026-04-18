/**
 * OfflineOCREngine — Tesseract.js running inside a hidden WebView
 * 
 * Fully offline after first model download (~4MB, cached by WebView).
 * Works in Expo Go — no native build required.
 * 
 * Flow:
 * 1. Hidden WebView loads Tesseract.js
 * 2. Image passed as base64 via postMessage
 * 3. Tesseract runs OCR in WebView's JS engine
 * 4. Raw text returned via onMessage
 * 5. TimetableParser extracts structured class data from raw text
 */

import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

export interface OfflineOCRClass {
  name: string;
  shortCode: string;
  time: string;
  room: string;
  day: number;
  faculty: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface OfflineOCRResult {
  success: boolean;
  rawText: string;
  classes: OfflineOCRClass[];
  confidence: number;
  processingTimeMs: number;
  error?: string;
}

// The HTML page that runs Tesseract.js inside the WebView
const TESSERACT_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
</head>
<body>
<script>
  let worker = null;
  let isReady = false;

  async function initWorker() {
    try {
      worker = await Tesseract.createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'progress',
              progress: Math.round(m.progress * 100)
            }));
          }
        }
      });
      isReady = true;
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
    } catch (e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'error',
        error: 'Failed to init Tesseract: ' + e.message
      }));
    }
  }

  async function processImage(base64Data) {
    if (!isReady || !worker) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'error',
        error: 'OCR engine not ready yet. Please wait...'
      }));
      return;
    }

    const startTime = Date.now();
    try {
      const imageUrl = 'data:image/jpeg;base64,' + base64Data;
      const result = await worker.recognize(imageUrl);
      const elapsed = Date.now() - startTime;

      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'result',
        text: result.data.text,
        confidence: result.data.confidence,
        processingTimeMs: elapsed,
        words: result.data.words ? result.data.words.length : 0
      }));
    } catch (e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'error',
        error: 'OCR failed: ' + e.message
      }));
    }
  }

  // Listen for messages from React Native
  window.addEventListener('message', function(event) {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === 'process') {
        processImage(msg.base64);
      }
    } catch(e) {}
  });

  // Also handle document.addEventListener for Android
  document.addEventListener('message', function(event) {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === 'process') {
        processImage(msg.base64);
      }
    } catch(e) {}
  });

  // Auto-init on load
  initWorker();
</script>
</body>
</html>
`;

/**
 * Parse raw OCR text into structured timetable classes.
 * Handles common Indian engineering college timetable formats.
 */
function parseTimetableText(rawText: string): OfflineOCRClass[] {
  const classes: OfflineOCRClass[] = [];
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
  
  // Known subject patterns (common Indian engineering subjects)
  const SUBJECT_MAP: Record<string, string> = {
    'OS': 'Operating Systems',
    'DAA': 'Design & Analysis of Algorithms',
    'CCN': 'Computer Communication Networks',
    'PCS': 'Professional Communication Skills',
    'MDM': 'Mathematical Data Mining',
    'FOM': 'Fundamentals of Management',
    'HSS': 'Humanities & Social Sciences',
    'DS': 'Data Structures',
    'DBMS': 'Database Management Systems',
    'CN': 'Computer Networks',
    'SE': 'Software Engineering',
    'TOC': 'Theory of Computation',
    'COA': 'Computer Organization & Architecture',
    'AI': 'Artificial Intelligence',
    'ML': 'Machine Learning',
    'DL': 'Deep Learning',
    'NLP': 'Natural Language Processing',
    'SMCS': 'Statistical Methods & Computer Science',
    'LLC': 'Logical & Lateral Communications',
  };

  // Day detection
  const DAY_MAP: Record<string, number> = {
    'monday': 0, 'mon': 0,
    'tuesday': 1, 'tue': 1, 'tues': 1,
    'wednesday': 2, 'wed': 2,
    'thursday': 3, 'thu': 3, 'thur': 3, 'thurs': 3,
    'friday': 4, 'fri': 4,
    'saturday': 5, 'sat': 5,
  };

  // Time pattern: matches "9:00", "10.00-11.00", "9:00 - 10:00", etc.
  const TIME_RE = /(\d{1,2}[.:]\d{2})\s*[-–to]+\s*(\d{1,2}[.:]\d{2})/g;
  
  // Room pattern: matches "508", "Room 204", "Lab 3B", etc.
  const ROOM_RE = /(?:room|lab|hall)?\s*(\d{3}[A-Z]?|[A-Z]\d+[A-Z]?)/gi;

  let currentDay = 0;

  for (const line of lines) {
    const lineLower = line.toLowerCase();

    // Detect day headers
    for (const [dayWord, dayNum] of Object.entries(DAY_MAP)) {
      if (lineLower.includes(dayWord)) {
        currentDay = dayNum;
        break;
      }
    }

    // Try to find time slots in the line
    const timeMatches = [...line.matchAll(TIME_RE)];
    
    // Try to find subject codes
    for (const [code, fullName] of Object.entries(SUBJECT_MAP)) {
      const codeRe = new RegExp(`\\b${code}\\b`, 'i');
      if (codeRe.test(line)) {
        // Found a subject reference
        const timeStr = timeMatches.length > 0 
          ? `${timeMatches[0][1]} – ${timeMatches[0][2]}`.replace(/\./g, ':')
          : '';
        
        const roomMatches = line.match(ROOM_RE);
        const room = roomMatches ? roomMatches[roomMatches.length - 1].trim() : '';
        
        const isLab = /lab/i.test(line);

        // Avoid duplicate entries for the same subject+day+time
        const isDupe = classes.some(c => 
          c.shortCode === code && c.day === currentDay && c.time === timeStr
        );

        if (!isDupe && timeStr) {
          classes.push({
            name: fullName,
            shortCode: code,
            time: timeStr,
            room: room,
            day: currentDay,
            faculty: '',
            type: isLab ? 'lab' : 'lecture',
          });
        }
      }
    }

    // If no subject code matched, try to detect any class-like entry
    if (timeMatches.length > 0) {
      // Extract potential subject name (words before time)
      const beforeTime = line.split(timeMatches[0][0])[0]?.trim();
      if (beforeTime && beforeTime.length > 2 && beforeTime.length < 50) {
        const alreadyFound = classes.some(c => 
          c.day === currentDay && c.time === `${timeMatches[0][1]} – ${timeMatches[0][2]}`.replace(/\./g, ':')
        );
        if (!alreadyFound) {
          const roomMatches = line.match(ROOM_RE);
          classes.push({
            name: beforeTime,
            shortCode: beforeTime.substring(0, 3).toUpperCase(),
            time: `${timeMatches[0][1]} – ${timeMatches[0][2]}`.replace(/\./g, ':'),
            room: roomMatches ? roomMatches[roomMatches.length - 1].trim() : '',
            day: currentDay,
            faculty: '',
            type: /lab/i.test(line) ? 'lab' : 'lecture',
          });
        }
      }
    }
  }

  return classes;
}

// ---- React Component: Hidden WebView + imperative API ----

type OCRCallback = (result: OfflineOCRResult) => void;
type ProgressCallback = (percent: number) => void;

interface EngineState {
  isReady: boolean;
  pendingCallback: OCRCallback | null;
  progressCallback: ProgressCallback | null;
  startTime: number;
}

export const useOfflineOCR = () => {
  const webViewRef = useRef<WebView>(null);
  const stateRef = useRef<EngineState>({
    isReady: false,
    pendingCallback: null,
    progressCallback: null,
    startTime: 0,
  });
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleMessage = useCallback((event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      
      if (msg.type === 'ready') {
        stateRef.current.isReady = true;
        setIsEngineReady(true);
      }

      if (msg.type === 'progress') {
        setProgress(msg.progress);
        stateRef.current.progressCallback?.(msg.progress);
      }

      if (msg.type === 'result') {
        const classes = parseTimetableText(msg.text);
        const result: OfflineOCRResult = {
          success: true,
          rawText: msg.text,
          classes,
          confidence: msg.confidence,
          processingTimeMs: msg.processingTimeMs,
        };
        stateRef.current.pendingCallback?.(result);
        stateRef.current.pendingCallback = null;
        setProgress(0);
      }

      if (msg.type === 'error') {
        const result: OfflineOCRResult = {
          success: false,
          rawText: '',
          classes: [],
          confidence: 0,
          processingTimeMs: 0,
          error: msg.error,
        };
        stateRef.current.pendingCallback?.(result);
        stateRef.current.pendingCallback = null;
        setProgress(0);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const processImage = useCallback(async (
    imageUri: string,
    onResult: OCRCallback,
    onProgress?: ProgressCallback,
  ) => {
    if (!stateRef.current.isReady) {
      onResult({
        success: false, rawText: '', classes: [], confidence: 0,
        processingTimeMs: 0, error: 'OCR engine still loading. Please wait a moment...',
      });
      return;
    }

    stateRef.current.pendingCallback = onResult;
    stateRef.current.progressCallback = onProgress || null;
    stateRef.current.startTime = Date.now();

    // Read image as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // Send to WebView
    webViewRef.current?.postMessage(JSON.stringify({
      type: 'process',
      base64,
    }));
  }, []);

  // The hidden WebView component
  const OCRWebView = useCallback(() => (
    <View style={styles.hidden}>
      <WebView
        ref={webViewRef}
        source={{ html: TESSERACT_HTML }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
      />
    </View>
  ), [handleMessage]);

  return { OCRWebView, processImage, isEngineReady, progress };
};

const styles = StyleSheet.create({
  hidden: {
    width: 0,
    height: 0,
    position: 'absolute',
    opacity: 0,
  },
});
