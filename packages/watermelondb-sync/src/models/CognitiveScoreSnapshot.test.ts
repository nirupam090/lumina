import { CognitiveScoreSnapshot } from './CognitiveScoreSnapshot';

describe('CognitiveScoreSnapshot Model (WatermelonDB)', () => {
  it('maps properly to the background tracking SQL boundaries organically', () => {
    expect(CognitiveScoreSnapshot.table).toBe('cognitive_score_snapshots');
  });

  it('tracks explicit application package drops statically', () => {
    expect(Object.keys(CognitiveScoreSnapshot.components)).toContain('violation_app_package');
    expect(Object.keys(CognitiveScoreSnapshot.components)).toContain('current_debt_score');
  });
});
