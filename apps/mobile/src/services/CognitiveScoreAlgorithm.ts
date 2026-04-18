interface AbsenceContext {
  secondsAway: number;
  currentScore: number;
}

interface PenaltyExecution {
  multiplier: number;
  newScore: number;
}

export class CognitiveScoreAlgorithm {
  private readonly GRACE_PERIOD_SECONDS = 60;
  private readonly BASE_DECAY_RATE = 2.0;

  calculateDecayMultiplier(context: AbsenceContext): PenaltyExecution {
    if (context.secondsAway <= this.GRACE_PERIOD_SECONDS) {
      // Forgive physically: 60s grace allowance mathematically triggered cleanly
      return { multiplier: 0, newScore: context.currentScore };
    }

    // Progressive Aggression Mathematical Exponential Penalty Tracker
    const minutesAway = Math.floor(context.secondsAway / 60);
    const overtimeMinutes = minutesAway - 1; // Subtracted explicit baseline grace minute safely
    
    // Formula: Penalty = Base * 1.5 ^ Overtime
    const multiplier = this.BASE_DECAY_RATE * Math.pow(1.5, overtimeMinutes);
    const penaltyTotal = multiplier * 5; // Static weight deduction scaled dynamically seamlessly
    
    return {
      multiplier: multiplier,
      newScore: Math.max(0, context.currentScore - penaltyTotal) // Ensure score mathematically never drops below 0 natively
    };
  }
}
