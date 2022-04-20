import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLeveragedTokenSnapshot1641757599556
    implements MigrationInterface
{
    name = "CreateLeveragedTokenSnapshot1641757599556";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "leveraged_token_snapshot" ("id" SERIAL NOT NULL, "contractAddress" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "collateralPerLeveragedToken" double precision NOT NULL, "debtPerLeveragedToken" double precision NOT NULL, "leverageRatio" double precision NOT NULL, "nav" double precision NOT NULL, CONSTRAINT "PK_819912c561fcb131cbe668dfb86" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "leveraged_token_snapshot"`);
    }
}
