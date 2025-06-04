import "reflect-metadata";
import { AppDataSource } from "./config/database";
import { QuoteService } from "./quoteService";
import { createServer } from "./server";

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
 */

// Define server port, using environment variable or default to 3000
const PORT = process.env.PORT || 3000;
const quoteService = new QuoteService();

// Initialize TypeORM connection
AppDataSource.initialize()
    .then(() => {
        console.log("Database connection established");

        // Create Express app
        const app = createServer(quoteService);

        // Start server
        app.listen(PORT, () => {
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

Press Ctrl+C to stop the server.
==============================================
`); 