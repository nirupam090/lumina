import { Model } from '@nozbe/watermelondb';
import { text, field, date } from '@nozbe/watermelondb/decorators';

export class WhiteboardStroke extends Model {
  static table = 'whiteboard_strokes';

  @text('board_identifier') boardIdentifier: string;
  @text('color') color: string;
  @field('thickness') thickness: number;
  
  // JSON array physically mapped as a serialized string offline (e.g. [[x,y], [x,y]])
  @text('points_payload') pointsPayload: string;
  
  @date('created_at') createdAt: number;
}
