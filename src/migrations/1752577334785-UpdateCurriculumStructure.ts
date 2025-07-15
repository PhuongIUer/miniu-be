import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCurriculumStructure1752577334785 implements MigrationInterface {
    name = 'UpdateCurriculumStructure1752577334785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "lecturer" CASCADE`);
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "FK_d18bbdd9328e846f7fe5c1c9a71"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP CONSTRAINT "FK_b81471d330aca6951e4eb05f825"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP CONSTRAINT "FK_c8163806ea1e3f1a6cff3928434"`);
        await queryRunner.query(`CREATE TABLE "concentration" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "majorId" integer, CONSTRAINT "PK_8e5d1783d48bab689b191b0d2af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "whitelist_jwt" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "jti" character varying(255) NOT NULL, CONSTRAINT "PK_930423d00903a2234cbe9d27d2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "PK_70fbdd4144f3fc91373a93fe04a"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "subject_id"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "subject_name"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "subject_credit"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "semesterSemesterId"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP CONSTRAINT "PK_06f44a368424d5968fb2da79e18"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP COLUMN "semester_id"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP COLUMN "semester_name"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP COLUMN "curriculumCurriculumId"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP CONSTRAINT "PK_e40eb6a60d58c4cd621335dcd19"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "curriculum_id"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "curriculum_name"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "majorMajorId"`);
        await queryRunner.query(`ALTER TABLE "major" DROP CONSTRAINT "PK_9c8b79e3dc1a0eafce89c032cf4"`);
        await queryRunner.query(`ALTER TABLE "major" DROP COLUMN "major_id"`);
        await queryRunner.query(`ALTER TABLE "major" DROP COLUMN "major_name"`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject" ADD CONSTRAINT "PK_12eee115462e38d62e5455fc054" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "credits" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "semesterId" integer`);
        await queryRunner.query(`ALTER TABLE "semester" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "semester" ADD CONSTRAINT "PK_9129c1fd35aa4aded7a9825b38d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "semester" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "semester" ADD "concentrationId" integer`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD CONSTRAINT "PK_ea7cdfd52edbddc8d7352e2a747" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "major" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "major" ADD CONSTRAINT "PK_00341ff87e17ae50751c5da05ad" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "major" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "major" ADD "curriculumId" integer`);
        await queryRunner.query(`ALTER TABLE "subject" ADD CONSTRAINT "FK_042db48bce3793aad4725bdaf7f" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "semester" ADD CONSTRAINT "FK_9eb60e7b5714558b5e456d1f06e" FOREIGN KEY ("concentrationId") REFERENCES "concentration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "concentration" ADD CONSTRAINT "FK_07202898452578c41961f76aace" FOREIGN KEY ("majorId") REFERENCES "major"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "major" ADD CONSTRAINT "FK_8b43b9d3e5c3d898cb6408a3c56" FOREIGN KEY ("curriculumId") REFERENCES "curriculum"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "major" DROP CONSTRAINT "FK_8b43b9d3e5c3d898cb6408a3c56"`);
        await queryRunner.query(`ALTER TABLE "concentration" DROP CONSTRAINT "FK_07202898452578c41961f76aace"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP CONSTRAINT "FK_9eb60e7b5714558b5e456d1f06e"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "FK_042db48bce3793aad4725bdaf7f"`);
        await queryRunner.query(`ALTER TABLE "major" DROP COLUMN "curriculumId"`);
        await queryRunner.query(`ALTER TABLE "major" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "major" DROP CONSTRAINT "PK_00341ff87e17ae50751c5da05ad"`);
        await queryRunner.query(`ALTER TABLE "major" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP CONSTRAINT "PK_ea7cdfd52edbddc8d7352e2a747"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP COLUMN "concentrationId"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP CONSTRAINT "PK_9129c1fd35aa4aded7a9825b38d"`);
        await queryRunner.query(`ALTER TABLE "semester" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "semesterId"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "credits"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "PK_12eee115462e38d62e5455fc054"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "major" ADD "major_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "major" ADD "major_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "major" ADD CONSTRAINT "PK_9c8b79e3dc1a0eafce89c032cf4" PRIMARY KEY ("major_id")`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "majorMajorId" integer`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "curriculum_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "curriculum_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD CONSTRAINT "PK_e40eb6a60d58c4cd621335dcd19" PRIMARY KEY ("curriculum_id")`);
        await queryRunner.query(`ALTER TABLE "semester" ADD "curriculumCurriculumId" integer`);
        await queryRunner.query(`ALTER TABLE "semester" ADD "semester_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "semester" ADD "semester_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "semester" ADD CONSTRAINT "PK_06f44a368424d5968fb2da79e18" PRIMARY KEY ("semester_id")`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "semesterSemesterId" integer`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "subject_credit" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "subject_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "subject_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject" ADD CONSTRAINT "PK_70fbdd4144f3fc91373a93fe04a" PRIMARY KEY ("subject_id")`);
        await queryRunner.query(`DROP TABLE "whitelist_jwt"`);
        await queryRunner.query(`DROP TABLE "concentration"`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD CONSTRAINT "FK_c8163806ea1e3f1a6cff3928434" FOREIGN KEY ("majorMajorId") REFERENCES "major"("major_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "semester" ADD CONSTRAINT "FK_b81471d330aca6951e4eb05f825" FOREIGN KEY ("curriculumCurriculumId") REFERENCES "curriculum"("curriculum_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subject" ADD CONSTRAINT "FK_d18bbdd9328e846f7fe5c1c9a71" FOREIGN KEY ("semesterSemesterId") REFERENCES "semester"("semester_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
