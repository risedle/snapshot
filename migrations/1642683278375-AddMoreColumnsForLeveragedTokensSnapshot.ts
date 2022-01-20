import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreColumnsForLeveragedTokensSnapshot1642683278375 implements MigrationInterface {
    name = "AddMoreColumnsForLeveragedTokensSnapshot1642683278375";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault_snapshot" RENAME COLUMN "totalCapacity" TO "maxTotalDeposit"`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "totalCapacity"`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "totalCollateral"`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "totalDebt"`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" ADD "maxTotalCollateral" double precision`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" ADD "totalCollateralPlusFee" double precision`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" ADD "totalPendingFees" double precision`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" ADD "outstandingDebt" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "outstandingDebt"`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "totalPendingFees"`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "totalCollateralPlusFee"`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" DROP COLUMN "maxTotalCollateral"`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" ADD "totalDebt" double precision`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" ADD "totalCollateral" double precision`);
        await queryRunner.query(`ALTER TABLE "leveraged_token_snapshot" ADD "totalCapacity" double precision`);
        await queryRunner.query(`ALTER TABLE "vault_snapshot" RENAME COLUMN "maxTotalDeposit" TO "totalCapacity"`);
    }
}
