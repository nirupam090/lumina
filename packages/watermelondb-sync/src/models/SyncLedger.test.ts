import { SyncLedger } from './SyncLedger';

describe('SyncLedger Model', () => {
  it('should map to the exact internal sync_ledger offline table', () => {
    expect(SyncLedger.table).toBe('sync_ledger');
  });
});
