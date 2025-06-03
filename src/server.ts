import { IncomingMessage, ServerResponse } from "http";
import { QuoteService } from "./quoteService";

export const handleRequest = async (
    req: IncomingMessage,
    res: ServerResponse,
    quoteService: QuoteService
) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // Set default headers
    res.setHeader("Content-Type", "application/json");

    try {
        const url = new URL(req.url || "", `http://${req.headers.host}`);
        const path = url.pathname;
        const id = path.split("/")[2];

        // Handle different routes
        if (path === "/quotes") {
            if (req.method === "GET") {
                const quotes = await quoteService.getAllQuotes();
                res.writeHead(200);
                res.end(JSON.stringify({
                    statusCode: 200,
                    message: "Quotes retrieved successfully",
                    data: quotes
                }));
            } else if (req.method === "POST") {
                let body = "";
                req.on("data", chunk => {
                    body += chunk.toString();
                });

                req.on("end", async () => {
                    try {
                        const quoteData = JSON.parse(body);
                        const newQuote = await quoteService.createQuote(quoteData);
                        res.writeHead(201);
                        res.end(JSON.stringify({
                            statusCode: 201,
                            message: "Quote created successfully",
                            data: newQuote
                        }));
                    } catch (error) {
                        res.writeHead(400);
                        res.end(JSON.stringify({
                            statusCode: 400,
                            message: "Invalid request body",
                            error: error instanceof Error ? error.message : "Unknown error"
                        }));
                    }
                });
            }
        } else if (path === "/quotes/random") {
            if (req.method === "GET") {
                const quote = await quoteService.getRandomQuote();
                if (quote) {
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        statusCode: 200,
                        message: "Random quote retrieved successfully",
                        data: quote
                    }));
                } else {
                    res.writeHead(404);
                    res.end(JSON.stringify({
                        statusCode: 404,
                        message: "No quotes available"
                    }));
                }
            }
        } else if (path.match(/^\/quotes\/[^/]+$/)) {
            if (!id) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    statusCode: 400,
                    message: "Invalid quote ID"
                }));
                return;
            }

            if (req.method === "GET") {
                const quote = await quoteService.getQuoteById(id);
                if (quote) {
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        statusCode: 200,
                        message: "Quote retrieved successfully",
                        data: quote
                    }));
                } else {
                    res.writeHead(404);
                    res.end(JSON.stringify({
                        statusCode: 404,
                        message: "Quote not found"
                    }));
                }
            } else if (req.method === "PUT") {
                let body = "";
                req.on("data", chunk => {
                    body += chunk.toString();
                });

                req.on("end", async () => {
                    try {
                        const quoteData = JSON.parse(body);
                        const updatedQuote = await quoteService.updateQuote(id, quoteData);
                        if (updatedQuote) {
                            res.writeHead(200);
                            res.end(JSON.stringify({
                                statusCode: 200,
                                message: "Quote updated successfully",
                                data: updatedQuote
                            }));
                        } else {
                            res.writeHead(404);
                            res.end(JSON.stringify({
                                statusCode: 404,
                                message: "Quote not found"
                            }));
                        }
                    } catch (error) {
                        res.writeHead(400);
                        res.end(JSON.stringify({
                            statusCode: 400,
                            message: "Invalid request body",
                            error: error instanceof Error ? error.message : "Unknown error"
                        }));
                    }
                });
            } else if (req.method === "DELETE") {
                const success = await quoteService.deleteQuote(id);
                if (success) {
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        statusCode: 200,
                        message: "Quote deleted successfully"
                    }));
                } else {
                    res.writeHead(404);
                    res.end(JSON.stringify({
                        statusCode: 404,
                        message: "Quote not found"
                    }));
                }
            }
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({
                statusCode: 404,
                message: "Route not found"
            }));
        }
    } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({
            statusCode: 500,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        }));
    }
}; 