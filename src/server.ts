import { IncomingMessage, ServerResponse } from "http";
import { QuoteService } from "./quoteService";

const sendResponse = (res: ServerResponse, statusCode: number, message: string, data?: any, error?: string) => {
    res.writeHead(statusCode);
    res.end(JSON.stringify({ statusCode, message, data, error }));
};

const parseRequestBody = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
    });
};

const handleGetQuotes = async (res: ServerResponse, quoteService: QuoteService) => {
    const quotes = await quoteService.getAllQuotes();
    sendResponse(res, 200, "Quotes retrieved successfully", quotes);
};

const handleCreateQuote = async (req: IncomingMessage, res: ServerResponse, quoteService: QuoteService) => {
    try {
        const quoteData = await parseRequestBody(req);
        const newQuote = await quoteService.createQuote(quoteData);
        sendResponse(res, 201, "Quote created successfully", newQuote);
    } catch (error) {
        sendResponse(res, 400, "Invalid request body", null, error instanceof Error ? error.message : "Unknown error");
    }
};

const handleGetRandomQuote = async (res: ServerResponse, quoteService: QuoteService) => {
    const quote = await quoteService.getRandomQuote();
    if (quote) {
        sendResponse(res, 200, "Random quote retrieved successfully", quote);
    } else {
        sendResponse(res, 404, "No quotes available");
    }
};

const handleGetQuoteById = async (res: ServerResponse, quoteService: QuoteService, id: string) => {
    const quote = await quoteService.getQuoteById(id);
    if (quote) {
        sendResponse(res, 200, "Quote retrieved successfully", quote);
    } else {
        sendResponse(res, 404, "Quote not found");
    }
};

const handleUpdateQuote = async (req: IncomingMessage, res: ServerResponse, quoteService: QuoteService, id: string) => {
    try {
        const quoteData = await parseRequestBody(req);
        const updatedQuote = await quoteService.updateQuote(id, quoteData);
        if (updatedQuote) {
            sendResponse(res, 200, "Quote updated successfully", updatedQuote);
        } else {
            sendResponse(res, 404, "Quote not found");
        }
    } catch (error) {
        sendResponse(res, 400, "Invalid request body", null, error instanceof Error ? error.message : "Unknown error");
    }
};

const handleDeleteQuote = async (res: ServerResponse, quoteService: QuoteService, id: string) => {
    const success = await quoteService.deleteQuote(id);
    if (success) {
        sendResponse(res, 200, "Quote deleted successfully");
    } else {
        sendResponse(res, 404, "Quote not found");
    }
};

export const handleRequest = async (
    req: IncomingMessage,
    res: ServerResponse,
    quoteService: QuoteService
) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    try {
        const url = new URL(req.url || "", `http://${req.headers.host}`);
        const path = url.pathname;
        const id = path.split("/")[2];

        if (path === "/quotes") {
            if (req.method === "GET") await handleGetQuotes(res, quoteService);
            else if (req.method === "POST") await handleCreateQuote(req, res, quoteService);
        } else if (path === "/quotes/random" && req.method === "GET") {
            await handleGetRandomQuote(res, quoteService);
        } else if (path.match(/^\/quotes\/[^/]+$/)) {
            if (!id) {
                sendResponse(res, 400, "Invalid quote ID");
                return;
            }
            if (req.method === "GET") await handleGetQuoteById(res, quoteService, id);
            else if (req.method === "PUT") await handleUpdateQuote(req, res, quoteService, id);
            else if (req.method === "DELETE") await handleDeleteQuote(res, quoteService, id);
        } else {
            sendResponse(res, 404, "Route not found");
        }
    } catch (error) {
        sendResponse(res, 500, "Internal server error", null, error instanceof Error ? error.message : "Unknown error");
    }
}; 