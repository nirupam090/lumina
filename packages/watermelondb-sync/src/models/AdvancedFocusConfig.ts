import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class AdvancedFocusConfig extends Model {
  static table = 'advanced_focus_config';

  @field('advanced_metrics_enabled') advancedMetricsEnabled: boolean;
}
