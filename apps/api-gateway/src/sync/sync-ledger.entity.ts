import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('sync_ledger')
export class SyncLedgerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  field_timestamps: Record<string, number>;

  @Column('jsonb')
  local_payload_snapshot: Record<string, any>;

  @Column({ length: 150 })
  target_table: string;

  @Column('uuid')
  target_record_id: string;

  @UpdateDateColumn()
  server_timestamp: Date;
}
