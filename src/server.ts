import express, { Request, Response } from 'express';
import { QuoteService } from "./quoteService";

export const createServer = (quoteService: QuoteService) => {
    const app = express();
    app.use(express.json());

    // CORS middleware
    app.use((req: Request, res: Response, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        next();
    });

    // GET all quotes
    app.get('/quotes', async (req: Request, res: Response) => {
        try {
            const quotes = await quoteService.getAllQuotes();
            res.status(200).json({
                statusCode: 200,
                message: "Quotes retrieved successfully",
                data: quotes
            });
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });

    // POST new quote
    app.post('/quotes', async (req: Request, res: Response) => {
        try {
            const newQuote = await quoteService.createQuote(req.body);
            res.status(201).json({
                statusCode: 201,
                message: "Quote created successfully",
                data: newQuote
            });
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: "Invalid request body",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });

    // GET random quote
    app.get('/quotes/random', async (req: Request, res: Response) => {
        try {
            const quote = await quoteService.getRandomQuote();
            if (quote) {
                res.status(200).json({
                    statusCode: 200,
                    message: "Random quote retrieved successfully",
                    data: quote
                });
            } else {
                res.status(404).json({
                    statusCode: 404,
                    message: "No quotes available"
                });
            }
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });

    // GET quote by ID
    app.get('/quotes/:id', async (req: Request, res: Response) => {
        try {
            const quote = await quoteService.getQuoteById(req.params.id);
            if (quote) {
                res.status(200).json({
                    statusCode: 200,
                    message: "Quote retrieved successfully",
                    data: quote
                });
            } else {
                res.status(404).json({
                    statusCode: 404,
                    message: "Quote not found"
                });
            }
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });

    // PUT update quote
    app.put('/quotes/:id', async (req: Request, res: Response) => {
        try {
            const updatedQuote = await quoteService.updateQuote(req.params.id, req.body);
            if (updatedQuote) {
                res.status(200).json({
                    statusCode: 200,
                    message: "Quote updated successfully",
                    data: updatedQuote
                });
            } else {
                res.status(404).json({
                    statusCode: 404,
                    message: "Quote not found"
                });
            }
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: "Invalid request body",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });

    // DELETE quote
    app.delete('/quotes/:id', async (req: Request, res: Response) => {
        try {
            const success = await quoteService.deleteQuote(req.params.id);
            if (success) {
                res.status(200).json({
                    statusCode: 200,
                    message: "Quote deleted successfully"
                });
            } else {
                res.status(404).json({
                    statusCode: 404,
                    message: "Quote not found"
                });
            }
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });

    // Handle 404 routes
    app.use((req: Request, res: Response) => {
        res.status(404).json({
            statusCode: 404,
            message: "Route not found"
        });
    });

    return app;
}; 