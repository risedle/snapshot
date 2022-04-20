import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBlockNumber1645007817083 implements MigrationInterface {
    name = "AddBlockNumber1645007817083";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" ADD "blockNumber" integer`
        );
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" ADD "blockNumber" integer`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" DROP COLUMN "blockNumber"`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "blockNumber"`
        );
    }
}
