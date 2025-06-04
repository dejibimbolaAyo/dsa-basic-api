import "reflect-metadata";
import { DataSource } from "typeorm";
import { Quote } from "../entities/Quote";
import { User } from "../entities/User";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "quotes_db",
    synchronize: true, // Set to false in production
    logging: true,
    entities: [Quote, User],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
}); 