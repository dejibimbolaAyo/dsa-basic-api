import { QuoteServer } from './server';

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
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Initialize and start the server
const server = new QuoteServer(PORT);
server.start();

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