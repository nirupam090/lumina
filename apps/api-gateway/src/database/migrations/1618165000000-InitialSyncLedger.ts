import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSyncLedger1618165000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "sync_ledger" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "field_timestamps" jsonb NOT NULL,
                "local_payload_snapshot" jsonb NOT NULL,
                "target_table" character varying(150) NOT NULL,
                "target_record_id" uuid NOT NULL,
                "server_timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_sync_ledger" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sync_ledger"`);
    }
}
