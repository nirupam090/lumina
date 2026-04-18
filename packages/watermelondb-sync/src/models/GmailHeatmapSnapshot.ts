import { Model } from '@nozbe/watermelondb';
import { text, date, field } from '@nozbe/watermelondb/decorators';

export class GmailHeatmapSnapshot extends Model {
  static table = 'gmail_heatmap_snapshots';

  // Strict Stress Score Bounds securely evaluating mapping array dynamically
  @field('calculated_stress_score') calculatedStressScore!: number;

  @text('extracted_keywords') extractedKeywords!: string;

  @date('earliest_deadline_detected') earliestDeadlineDetected!: Date;
  @date('created_at') createdAt!: Date;
}
