import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreDataPoints1642673085454 implements MigrationInterface {
    name = "AddMoreDataPoints1642673085454";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" ADD "vaultContractAddress" character varying`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" ADD "totalSupply" double precision`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" ADD "totalCapacity" double precision`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" ADD "totalCollateral" double precision`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" ADD "totalDebt" double precision`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" ADD "collateralPrice" double precision`
        );
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" ADD "totalCapacity" double precision`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" DROP COLUMN "totalCapacity"`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "collateralPrice"`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "totalDebt"`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "totalCollateral"`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "totalCapacity"`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "totalSupply"`
        );
        await queryRunner.query(
            `ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "vaultContractAddress"`
        );
    }
}
