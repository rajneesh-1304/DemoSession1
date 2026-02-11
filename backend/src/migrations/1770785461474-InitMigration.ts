import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1770785461474 implements MigrationInterface {
    name = 'InitMigration1770785461474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "sellerId" integer NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "isAvaliable" boolean NOT NULL DEFAULT true, "images" character varying, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "sellerId" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "images" character varying, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
