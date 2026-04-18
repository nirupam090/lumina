import { Model } from '@nozbe/watermelondb';
import { field, text, date } from '@nozbe/watermelondb/decorators';

export class User extends Model {
  static table = 'users';

  static associations = {
    squads: { type: 'belongs_to', key: 'squad_id' },
  } as const;

  @text('name') name!: string;
  @text('email') email!: string;
  @field('squad_id') squadId?: string;
  @date('last_online_at') lastOnlineAt!: number;
}
