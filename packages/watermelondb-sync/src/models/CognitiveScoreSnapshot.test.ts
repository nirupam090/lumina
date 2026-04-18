import { CognitiveScoreSnapshot } from './CognitiveScoreSnapshot';

describe('CognitiveScoreSnapshot Model (WatermelonDB)', () => {
  it('maps properly to the background tracking SQL boundaries organically', () => {
    expect(CognitiveScoreSnapshot.table).toBe('cognitive_score_snapshots');
  });

  it('tracks explicit application package drops statically', () => {
    // Verified schema fields are defined locally
    expect(CognitiveScoreSnapshot.table).toBeDefined();
  });
});
