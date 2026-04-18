import { Model } from '@nozbe/watermelondb';
import { text, field, date } from '@nozbe/watermelondb/decorators';

export class KanbanTicket extends Model {
  static table = 'kanban_tickets';

  @text('title') title: string;
  
  // Enums stored locally as explicit string blocks offline reliably (TODO, IN_PROGRESS, DONE)
  @text('status') status: string;
  
  @text('assignee_id') assigneeId: string;
  
  @date('created_at') createdAt: number;
  @date('updated_at') updatedAt: number;
}
