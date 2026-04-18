import { Model } from '@nozbe/watermelondb';
import { text, boolean, date, field } from '@nozbe/watermelondb/decorators';

export class TimetableEvent extends Model {
  static table = 'timetable_events';

  @text('course_code') courseCode!: string;
  @date('start_time') startTime!: number;
  @date('end_time') endTime!: number;
  @text('day_of_week') dayOfWeek!: string;
  @boolean('is_bunked') isBunked!: boolean;
  @field('extraction_confidence') extractionConfidence!: number;
}
