import { Model } from '@nozbe/watermelondb';
import { text, json } from '@nozbe/watermelondb/decorators';

export class SyncLedger extends Model {
  static table = 'sync_ledger';

  // Defines Granular Last-Write-Wins timestamps mapping per field to reconcile arrays securely
  @json('field_timestamps', (raw: any) => raw) fieldTimestamps!: Record<string, number>;
  
  // Snapshots exactly what data was dropped at connection death
  @json('local_payload_snapshot', (raw: any) => raw) localPayloadSnapshot!: Record<string, any>;

  @text('target_table') targetTable!: string;
  @text('target_record_id') targetRecordId!: string;
}
