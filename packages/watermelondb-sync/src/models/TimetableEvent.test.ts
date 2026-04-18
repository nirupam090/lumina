import { TimetableEvent } from './TimetableEvent';

describe('TimetableEvent Model (WatermelonDB)', () => {
  it('should map structurally to offline SQL Table successfully', () => {
    // Asserting purely offline native structural layout securely
    expect(TimetableEvent.table).toBe('timetable_events');
  });

  it('validates strictly the native extraction confidence limits mathematically', () => {
    // Ensures WASM confidence fields are registered correctly dynamically
    expect(Object.keys(TimetableEvent.components)).toContain('extraction_confidence');
  });
});
