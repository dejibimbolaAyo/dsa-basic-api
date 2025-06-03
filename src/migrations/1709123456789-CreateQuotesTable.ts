import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuotesTable1709123456789 implements MigrationInterface {
    name = 'CreateQuotesTable1709123456789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "quote" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "text" character varying NOT NULL,
                "author" character varying NOT NULL,
                "tags" text[] NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_quote" PRIMARY KEY ("id")
            )
        `);

        // Insert initial quotes
        await queryRunner.query(`
            INSERT INTO "quote" ("text", "author", "tags")
            VALUES 
                ('The best way to predict the future is to invent it.', 'Alan Kay', ARRAY['inspiration', 'future']),
                ('The only way to do great work is to love what you do.', 'Steve Jobs', ARRAY['work', 'passion']),
                ('Life is what happens when you''re busy making other plans.', 'John Lennon', ARRAY['life', 'planning']),
                ('The journey of a thousand miles begins with one step.', 'Lao Tzu', ARRAY['journey', 'perseverance']),
                ('It always seems impossible until it''s done.', 'Nelson Mandela', ARRAY['motivation', 'achievement'])
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "quote"`);
    }
} 