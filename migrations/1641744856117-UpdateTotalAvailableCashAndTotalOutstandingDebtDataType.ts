import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTotalAvailableCashAndTotalOutstandingDebtDataType1641744856117
    implements MigrationInterface
{
    name =
        "UpdateTotalAvailableCashAndTotalOutstandingDebtDataType1641744856117";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" DROP COLUMN "totalAvailableCash"`
        );
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" ADD "totalAvailableCash" double precision NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" DROP COLUMN "totalOutstandingDebt"`
        );
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" ADD "totalOutstandingDebt" double precision NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" DROP COLUMN "totalOutstandingDebt"`
        );
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" ADD "totalOutstandingDebt" integer NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" DROP COLUMN "totalAvailableCash"`
        );
        await queryRunner.query(
            `ALTER TABLE "vault_snapshot" ADD "totalAvailableCash" integer NOT NULL`
        );
    }
}
