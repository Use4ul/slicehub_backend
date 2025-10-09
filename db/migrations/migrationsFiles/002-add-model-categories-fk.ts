import { QueryInterface } from "sequelize";
import { Migration } from "../types";

const migration: Migration = {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE "model_categories"
            ADD CONSTRAINT "model_categories_parent_id_fkey"
            FOREIGN KEY ("parent_id")
            REFERENCES "model_categories" ("id")
            ON DELETE SET NULL
            ON UPDATE CASCADE;
        `);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.sequelize.query(`
            ALTER TABLE "model_categories"
            DROP CONSTRAINT IF EXISTS "model_categories_parent_id_fkey";
        `);
    },
};

export default migration;
