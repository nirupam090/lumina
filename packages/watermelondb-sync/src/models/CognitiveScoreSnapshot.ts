import { Model } from '@nozbe/watermelondb';
import { text, date, field } from '@nozbe/watermelondb/decorators';

export class CognitiveScoreSnapshot extends Model {
  static table = 'cognitive_score_snapshots';

  @date('timestamp') timestamp: number;
  @field('current_debt_score') currentDebtScore: number;
  @text('violation_app_package') violationAppPackage: string;
}
