import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSemesterSubjectRelation1752706829603 implements MigrationInterface {
    name = 'AddSemesterSubjectRelation1752706829603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "major" DROP CONSTRAINT "FK_8b43b9d3e5c3d898cb6408a3c56"`);
        await queryRunner.query(`ALTER TABLE "concentration" DROP CONSTRAINT "FK_07202898452578c41961f76aace"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP CONSTRAINT "FK_9eb60e7b5714558b5e456d1f06e"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "FK_042db48bce3793aad4725bdaf7f"`);
        await queryRunner.query(`ALTER TABLE "major" RENAME COLUMN "curriculumId" TO "curriculum_id"`);
        await queryRunner.query(`ALTER TABLE "concentration" RENAME COLUMN "majorId" TO "major_id"`);
        await queryRunner.query(`ALTER TABLE "semester" RENAME COLUMN "concentrationId" TO "concentration_id"`);
        await queryRunner.query(`ALTER TABLE "subject" RENAME COLUMN "semesterId" TO "semester_id"`);
        await queryRunner.query(`ALTER TABLE "major" ADD CONSTRAINT "FK_4f0b7e66cd69b1cb9c1bbda6c74" FOREIGN KEY ("curriculum_id") REFERENCES "curriculum"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "concentration" ADD CONSTRAINT "FK_8fcd0f5f2656d3128d165741348" FOREIGN KEY ("major_id") REFERENCES "major"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "semester" ADD CONSTRAINT "FK_e5c0c6534a09a71ba07d3b6e2bf" FOREIGN KEY ("concentration_id") REFERENCES "concentration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subject" ADD CONSTRAINT "FK_64ff7bd146147aa28cc080df965" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "FK_64ff7bd146147aa28cc080df965"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP CONSTRAINT "FK_e5c0c6534a09a71ba07d3b6e2bf"`);
        await queryRunner.query(`ALTER TABLE "concentration" DROP CONSTRAINT "FK_8fcd0f5f2656d3128d165741348"`);
        await queryRunner.query(`ALTER TABLE "major" DROP CONSTRAINT "FK_4f0b7e66cd69b1cb9c1bbda6c74"`);
        await queryRunner.query(`ALTER TABLE "subject" RENAME COLUMN "semester_id" TO "semesterId"`);
        await queryRunner.query(`ALTER TABLE "semester" RENAME COLUMN "concentration_id" TO "concentrationId"`);
        await queryRunner.query(`ALTER TABLE "concentration" RENAME COLUMN "major_id" TO "majorId"`);
        await queryRunner.query(`ALTER TABLE "major" RENAME COLUMN "curriculum_id" TO "curriculumId"`);
        await queryRunner.query(`ALTER TABLE "subject" ADD CONSTRAINT "FK_042db48bce3793aad4725bdaf7f" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "semester" ADD CONSTRAINT "FK_9eb60e7b5714558b5e456d1f06e" FOREIGN KEY ("concentrationId") REFERENCES "concentration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "concentration" ADD CONSTRAINT "FK_07202898452578c41961f76aace" FOREIGN KEY ("majorId") REFERENCES "major"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "major" ADD CONSTRAINT "FK_8b43b9d3e5c3d898cb6408a3c56" FOREIGN KEY ("curriculumId") REFERENCES "curriculum"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
