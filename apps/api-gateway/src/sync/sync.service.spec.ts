import { SyncService } from './sync.service';

describe('SyncService (Node.js)', () => {
  let service: SyncService;

  beforeEach(() => {
    service = new SyncService();
  });

  it('test_granular_lww_merges_unique_fields', () => {
    const existingLedger = { 'title': 100, 'color': 50 };
    const incomingPayload = { 'title': 120, 'color': 30 }; // title is newer, color is older

    const result = service.executeGranularLWW(existingLedger, incomingPayload);
    
    // Asserts absolute fidelity for individual row properties across disjointed timestamps
    expect(result.merged['title']).toBe(120); // taken from incoming natively
    expect(result.merged['color']).toBe(50); // kept safely from existing
  });
});
