import { Model } from '@nozbe/watermelondb';
import { text, field, date } from '@nozbe/watermelondb/decorators';

export class ContextSwitchEvent extends Model {
  static table = 'context_switch_events';

  @text('session_id') sessionId: string;
  @field('absence_duration_ms') absenceDurationMs: number;
  @text('penalty_classification') penaltyClassification: string; // IGNORED | SOFT_DISTRACTION | FULL_DISTRACTION
  @text('target_app_package') targetAppPackage: string; // Opt-In
  @date('created_at') createdAt: number;
}
