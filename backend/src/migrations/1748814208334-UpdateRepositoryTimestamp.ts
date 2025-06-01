import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRepositoryTimestamp1748814208334 implements MigrationInterface {
    name = 'UpdateRepositoryTimestamp1748814208334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "repositories" DROP COLUMN "githubCreatedAt"`);
        await queryRunner.query(`ALTER TABLE "repositories" ADD "githubCreatedAt" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "repositories" DROP COLUMN "githubCreatedAt"`);
        await queryRunner.query(`ALTER TABLE "repositories" ADD "githubCreatedAt" integer NOT NULL`);
    }
}
