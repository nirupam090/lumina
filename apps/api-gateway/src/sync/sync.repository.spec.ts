import { Test, TestingModule } from '@nestjs/testing';
import { SyncRepository } from './sync.repository';

describe('SyncRepository (PostgreSQL)', () => {
  let repository: SyncRepository;

  beforeEach(async () => {
    // Scaffold isolated test module following strict TDD NestJS principles
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncRepository],
    }).compile();

    repository = module.get<SyncRepository>(SyncRepository);
  });

  it('should be defined gracefully', () => {
    expect(repository).toBeDefined();
  });

  it('should enforce strict 5MB chunk payloads defensively matching unit NFRs', async () => {
    // Asserting the paginated chunking mechanism throws on massive injection
    const payloadBuffer = Buffer.alloc(1024 * 1024 * 6); // 6MB
    await expect(repository.processBatch(payloadBuffer)).rejects.toThrow('Payload exceeds explicit 5MB chunk limit');
  });
});
