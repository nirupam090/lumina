import { TimetableEngine } from './TimetableEngine';

describe('TimetableEngine (Unit 2 OCR)', () => {
  let engine: TimetableEngine;

  beforeEach(() => {
    engine = new TimetableEngine();
  });

  it('runs Primary WASM (Tesseract) safely if grid structure returns >80% confidence', async () => {
    const result = await engine.parseImage('path/to/mock_image.png', { mockConfidenceLevel: 85 });
    
    expect(result.method).toBe('WASM_TESSERACT');
    expect(result.confidence).toBeGreaterThan(80);
    expect(result.triggeredFallback).toBe(false);
  });

  it('triggers the 20MB MobileNet Fallback Tensor locally if WASM confidence dips < 80%', async () => {
    const result = await engine.parseImage('path/to/mock_ambiguous_image.png', { mockConfidenceLevel: 45 });
    
    expect(result.method).toBe('NATIVE_TENSOR_MOBILENET');
    expect(result.triggeredFallback).toBe(true);
  });
});
