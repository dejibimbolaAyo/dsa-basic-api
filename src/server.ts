import * as http from 'http';
import { URL } from 'url';
import * as fileHandler from './fileHandler';
import { ApiResponse, Quote } from './types';

/**
 * Helper function to send JSON responses
 * @param res - HTTP response object
 * @param response - API response object
 */
const sendResponse = (res: http.ServerResponse, response: ApiResponse): void => {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(response.statusCode);
    res.end(JSON.stringify(response));
};

/**
 * Helper function to parse request body as JSON
 * @param req - HTTP request object 
 * @returns Promise with parsed body
 */
const parseRequestBody = (req: http.IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';

        // Collect data as it comes in
        req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
        });

        // Process the complete body
        req.on('end', () => {
            try {
                const parsedBody = body ? JSON.parse(body) : {};
                resolve(parsedBody);
            } catch (error) {
                reject(new Error('Invalid JSON'));
            }
        });

        // Handle request errors
        req.on('error', reject);
    });
};

/**
 * Handler for GET /quotes
 * Returns all quotes
 */
const handleGetAllQuotes = (_req: http.IncomingMessage, res: http.ServerResponse): void => {
    const quotes = fileHandler.readQuotes();
    sendResponse(res, {
        statusCode: 200,
        message: 'Quotes retrieved successfully',
        data: quotes
    });
};

/**
 * Handler for GET /quotes/random
 * Returns a random quote
 */
const handleGetRandomQuote = (_req: http.IncomingMessage, res: http.ServerResponse): void => {
    const quote = fileHandler.getRandomQuote();

    if (!quote) {
        sendResponse(res, {
            statusCode: 404,
            message: 'No quotes available'
        });
        return;
    }

    sendResponse(res, {
        statusCode: 200,
        message: 'Random quote retrieved successfully',
        data: quote
    });
};

/**
 * Handler for GET /quotes/:id
 * Returns a specific quote by ID
 */
const handleGetQuoteById = (_req: http.IncomingMessage, res: http.ServerResponse, id: string): void => {
    const quote = fileHandler.getQuoteById(id);

    if (!quote) {
        sendResponse(res, {
            statusCode: 404,
            message: `Quote with ID ${id} not found`
        });
        return;
    }

    sendResponse(res, {
        statusCode: 200,
        message: 'Quote retrieved successfully',
        data: quote
    });
};

/**
 * Handler for POST /quotes
 * Creates a new quote
 */
const handleCreateQuote = async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void> => {
    try {
        // Parse request body
        const body = await parseRequestBody(req);

        // Validate required fields
        if (!body.text || !body.author) {
            sendResponse(res, {
                statusCode: 400,
                message: 'Quote must have text and author'
            });
            return;
        }

        // Generate a new ID
        const quotes = fileHandler.readQuotes();
        const maxId = quotes.reduce((max, quote) => {
            const id = parseInt(quote.id);
            return id > max ? id : max;
        }, 0);

        // Create new quote object
        const newQuote: Quote = {
            id: (maxId + 1).toString(),
            text: body.text,
            author: body.author,
            tags: body.tags || []
        };

        // Add to storage
        const success = fileHandler.addQuote(newQuote);

        if (!success) {
            sendResponse(res, {
                statusCode: 500,
                message: 'Failed to create quote'
            });
            return;
        }

        sendResponse(res, {
            statusCode: 201,
            message: 'Quote created successfully',
            data: newQuote
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 400,
            message: 'Invalid request body'
        });
    }
};

/**
 * Handler for PUT /quotes/:id
 * Updates an existing quote
 */
const handleUpdateQuote = async (req: http.IncomingMessage, res: http.ServerResponse, id: string): Promise<void> => {
    try {
        // Check if quote exists
        const existingQuote = fileHandler.getQuoteById(id);

        if (!existingQuote) {
            sendResponse(res, {
                statusCode: 404,
                message: `Quote with ID ${id} not found`
            });
            return;
        }

        // Parse request body
        const body = await parseRequestBody(req);

        // Update quote object, keeping any fields not provided
        const updatedQuote: Quote = {
            id,
            text: body.text !== undefined ? body.text : existingQuote.text,
            author: body.author !== undefined ? body.author : existingQuote.author,
            tags: body.tags !== undefined ? body.tags : existingQuote.tags
        };

        // Save updated quote
        const success = fileHandler.updateQuote(id, updatedQuote);

        if (!success) {
            sendResponse(res, {
                statusCode: 500,
                message: 'Failed to update quote'
            });
            return;
        }

        sendResponse(res, {
            statusCode: 200,
            message: 'Quote updated successfully',
            data: updatedQuote
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 400,
            message: 'Invalid request body'
        });
    }
};

/**
 * Handler for DELETE /quotes/:id
 * Deletes a quote
 */
const handleDeleteQuote = (_req: http.IncomingMessage, res: http.ServerResponse, id: string): void => {
    // Check if quote exists
    const existingQuote = fileHandler.getQuoteById(id);

    if (!existingQuote) {
        sendResponse(res, {
            statusCode: 404,
            message: `Quote with ID ${id} not found`
        });
        return;
    }

    // Delete the quote
    const success = fileHandler.deleteQuote(id);

    if (!success) {
        sendResponse(res, {
            statusCode: 500,
            message: 'Failed to delete quote'
        });
        return;
    }

    sendResponse(res, {
        statusCode: 200,
        message: `Quote with ID ${id} deleted successfully`
    });
};

/**
 * Main request handler function
 * Routes requests to specific handlers based on method and path
 * @param req - HTTP request object
 * @param res - HTTP response object
 */
export const handleRequest = async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void> => {
    // Set CORS headers to allow all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Parse URL to get pathname and query parameters
    const baseUrl = `http://${req.headers.host}`;
    const url = new URL(req.url || '/', baseUrl);
    const pathname = url.pathname;

    try {
        // Route to appropriate handler based on method and path
        if (req.method === 'GET') {
            if (pathname === '/quotes') {
                // GET all quotes
                handleGetAllQuotes(req, res);
            } else if (pathname === '/quotes/random') {
                // GET random quote
                handleGetRandomQuote(req, res);
            } else if (pathname.match(/^\/quotes\/[\w-]+$/)) {
                // GET quote by ID
                const id = pathname.split('/').pop() || '';
                handleGetQuoteById(req, res, id);
            } else {
                sendResponse(res, { statusCode: 404, message: 'Route not found' });
            }
        } else if (req.method === 'POST' && pathname === '/quotes') {
            // POST new quote
            await handleCreateQuote(req, res);
        } else if (req.method === 'PUT' && pathname.match(/^\/quotes\/[\w-]+$/)) {
            // PUT update quote
            const id = pathname.split('/').pop() || '';
            await handleUpdateQuote(req, res, id);
        } else if (req.method === 'DELETE' && pathname.match(/^\/quotes\/[\w-]+$/)) {
            // DELETE quote
            const id = pathname.split('/').pop() || '';
            handleDeleteQuote(req, res, id);
        } else {
            sendResponse(res, { statusCode: 404, message: 'Route not found' });
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error('Server error:', error);
        sendResponse(res, {
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

/**
 * Creates and starts an HTTP server on the specified port
 * @param port - Port number to listen on
 * @returns The HTTP server instance
 */
export const createServer = (port: number = 3000): http.Server => {
    const server = http.createServer(handleRequest);

    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });

    return server;
}; 