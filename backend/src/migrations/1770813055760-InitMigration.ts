import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1770813055760 implements MigrationInterface {
    name = 'InitMigration1770813055760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_tracking" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_tracking" ALTER COLUMN "status" SET DEFAULT 'INPROCESS'`);
    }

}
