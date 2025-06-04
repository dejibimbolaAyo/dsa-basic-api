import "reflect-metadata";
import { AppDataSource } from "./config/database";
import { QuoteService } from "./quoteService";
import { UserService } from "./userService";
import { createServer } from "./server";

/**
 * Main entry point for the Daily Quote API
 * 
 * This API provides the following endpoints:
 * - POST /auth/register - Register a new user
 * - POST /auth/login - Login user
 * - GET /users/me - Get current user profile
 * - GET /quotes - Get all quotes
 * - GET /quotes/random - Get a random quote
 * - GET /quotes/:id - Get a specific quote by ID
 * - POST /quotes - Create a new quote
 * - PUT /quotes/:id - Update an existing quote
 * - DELETE /quotes/:id - Delete a quote
 * 
 * Authentication is required for all endpoints except registration and login.
 */

// Define server port, using environment variable or default to 3000
const PORT = process.env.PORT || 3000;
const quoteService = new QuoteService();
const userService = new UserService();

// Initialize TypeORM connection
AppDataSource.initialize()
    .then(() => {
        console.log("Database connection established");

        // Create Express app
        const app = createServer(quoteService, userService);

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

Authentication:
POST   /auth/register  - Register a new user
POST   /auth/login     - Login user
GET    /users/me       - Get current user profile

Quotes (requires authentication):
GET    /quotes         - Retrieve all quotes
GET    /quotes/random  - Get a random quote
GET    /quotes/:id     - Get quote by ID
POST   /quotes         - Create a new quote
PUT    /quotes/:id     - Update a quote
DELETE /quotes/:id     - Delete a quote

Press Ctrl+C to stop the server.
==============================================
`); 