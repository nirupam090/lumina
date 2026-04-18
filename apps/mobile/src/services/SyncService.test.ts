import { SyncService } from './SyncService';

describe('Mobile SyncService Circuit Breaker', () => {
  let service: SyncService;

  beforeEach(() => {
    service = new SyncService();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('test_circuit_breaker_fails_on_500', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ status: 500, ok: false });
    
    await service.pushPayload({ data: 'chunk' });
    
    // Assert exactly 3 backoff attempts per the resilience design before physical termination
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(service.isCircuitOpen).toBe(true);
  });

  it('test_paginates_5mb_chunks', () => {
    const hugePayload = new Array(10000).fill({ field: 'data' });
    const chunks = service.paginateChunks(hugePayload);
    
    // Asserts no single array slice breaks constraints
    expect(chunks.length).toBeGreaterThan(1);
    expect(JSON.stringify(chunks[0]).length).toBeLessThan(5 * 1024 * 1024);
  });
});
