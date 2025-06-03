import "reflect-metadata";
import { createServer } from "http";
import { AppDataSource } from "./config/database";
import { QuoteService } from "./quoteService";
import { handleRequest } from "./server";
import dotenv from "dotenv";

dotenv.config();

/**
 * Main entry point for the Daily Quote API
 * 
 * This API provides the following endpoints:
 * - GET /quotes - Get all quotes
 * - GET /quotes/random - Get a random quote
 * - GET /quotes/:id - Get a specific quote by ID
 * - POST /quotes - Create a new quote
 * - PUT /quotes/:id - Update an existing quote
 * - DELETE /quotes/:id - Delete a quote
 * 
 * No authentication or authorization is required for any endpoint.
 * Data is stored in a JSON file at ./quotes/quotes.json
 */

// Define server port, using environment variable or default to 3000
const PORT = process.env.PORT ?? 3000;
const quoteService = new QuoteService();

// Initialize TypeORM connection
AppDataSource.initialize()
    .then(() => {
        console.log("Database connection established");

        // Create HTTP server
        const server = createServer((req, res) => {
            handleRequest(req, res, quoteService);
        });

        // Start server
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error);
    });

console.log(`
==============================================
🔖 Daily Quote API 🔖
==============================================

API is now running. Available endpoints:

GET    /quotes         - Retrieve all quotes
GET    /quotes/random  - Get a random quote
GET    /quotes/:id     - Get quote by ID
POST   /quotes         - Create a new quote
PUT    /quotes/:id     - Update a quote
DELETE /quotes/:id     - Delete a quote

No authentication required.
Data is stored in ./quotes/quotes.json

Press Ctrl+C to stop the server.
==============================================
`); 