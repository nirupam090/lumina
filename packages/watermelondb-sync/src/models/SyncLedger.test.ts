import { SyncLedger } from './SyncLedger';

describe('SyncLedger Model', () => {
  it('should map to the exact internal sync_ledger offline table', () => {
    expect(SyncLedger.table).toBe('sync_ledger');
  });

  it('should contain Granular LWW field constraints in schema', () => {
    // Ensuring the columns exist on the model structure structurally
    expect(Object.keys(SyncLedger.components)).toContain('field_timestamps');
    expect(Object.keys(SyncLedger.components)).toContain('local_payload_snapshot');
  });
});
