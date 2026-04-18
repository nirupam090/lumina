import { CognitiveScoreAlgorithm } from './CognitiveScoreAlgorithm';

describe('CognitiveScoreAlgorithm (Unit 2 Tracker)', () => {
  let algo: CognitiveScoreAlgorithm;

  beforeEach(() => {
    algo = new CognitiveScoreAlgorithm();
  });

  it('forgives background app switches natively that return inside the 60s Grace Window', () => {
    const penalty = algo.calculateDecayMultiplier({ secondsAway: 45, currentScore: 100 });
    expect(penalty.multiplier).toBe(0);
    expect(penalty.newScore).toBe(100);
  });

  it('aggressively triggers Exponential Multiplier if absence breaches 60s array bounds', () => {
    const penalty = algo.calculateDecayMultiplier({ secondsAway: 120, currentScore: 100 });
    // Penalty calculation bounds: BaseRate * 1.5 ^ OvertimeMinutes
    expect(penalty.multiplier).toBeGreaterThan(0);
    expect(penalty.newScore).toBeLessThan(100);
  });
});
