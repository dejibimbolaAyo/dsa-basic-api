import { DataSource } from "typeorm";
import { Quote } from "../entities/Quote";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, // Disable synchronize in favor of migrations
    logging: true,
    entities: [Quote],
    subscribers: [],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations",
}); 