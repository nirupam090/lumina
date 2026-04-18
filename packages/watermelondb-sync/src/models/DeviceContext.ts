import { Model } from '@nozbe/watermelondb';
import { text, boolean, date } from '@nozbe/watermelondb/decorators';

export class DeviceContext extends Model {
  static table = 'device_contexts';

  @text('device_id') deviceId!: string;
  @boolean('is_battery_saver_active') isBatterySaverActive!: boolean;
  @date('last_sync_attempt') lastSyncAttempt!: number;
}
