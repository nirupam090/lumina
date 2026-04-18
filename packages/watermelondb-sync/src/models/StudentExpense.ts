import { Model } from '@nozbe/watermelondb';
import { text, date, field } from '@nozbe/watermelondb/decorators';

export class StudentExpense extends Model {
  static table = 'student_expenses';

  // Strict Local Sandbox cleanly bypassing Plaid functionally 
  @field('transaction_amount') transactionAmount!: number;
  @text('category') category!: string;

  @date('incurred_timestamp') incurredTimestamp!: Date;
  @date('logged_at') loggedAt!: Date;
}
