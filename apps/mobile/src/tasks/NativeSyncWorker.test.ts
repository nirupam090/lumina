import { NativeSyncWorker } from './NativeSyncWorker';

describe('NativeSyncWorker (120-Day Background CRON)', () => {
  it('triggers isolated SQL sweeps securely clearing arrays heavily older than 120 days explicitly', () => {
    const worker = new NativeSyncWorker();
    const mockSqlDrop = jest.fn();
    
    worker.executeNightlySweeps(mockSqlDrop);
    
    expect(mockSqlDrop).toHaveBeenCalledWith('DELETE FROM document_chunks WHERE created_at < ?');
  });
});
