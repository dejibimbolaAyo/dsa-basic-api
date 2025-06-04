import express, { Request, Response, RequestHandler } from 'express';
import { QuoteService } from "./quoteService";
import { UserService } from "./userService";
import { authMiddleware, adminMiddleware, AuthRequest } from "./middleware/auth";
import { UserRole } from "./entities/User";

export const createServer = (quoteService: QuoteService, userService: UserService) => {
    const app = express();
    app.use(express.json());

    // CORS middleware
    app.use((req: Request, res: Response, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS"
        );
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        next();
    });

    // Auth routes
    app.post("/auth/register", (async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, username, password, role } = req.body;
            const result = await userService.register(email, username, password, role);
            res.status(201).json({
                statusCode: 201,
                message: "User registered successfully",
                data: {
                    user: {
                        id: result.user.id,
                        email: result.user.email,
                        username: result.user.username,
                        role: result.user.role
                    },
                    token: result.token
                }
            });
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: error instanceof Error ? error.message : "Registration failed"
            });
        }
    }) as RequestHandler);

    app.post("/auth/login", async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const result = await userService.login(email, password);
            res.status(200).json({
                statusCode: 200,
                message: "Login successful",
                data: {
                    user: {
                        id: result.user.id,
                        email: result.user.email,
                        username: result.user.username
                    },
                    token: result.token
                }
            });
        } catch (error) {
            res.status(401).json({
                statusCode: 401,
                message: error instanceof Error ? error.message : "Login failed"
            });
        }
    });

    // Protected user routes
    const getCurrentUser: RequestHandler = async (req: AuthRequest, res: Response) => {
        try {
            const user = await userService.getUserById(req.user?.id || "");
            if (!user) {
                res.status(404).json({
                    statusCode: 404,
                    message: "User not found"
                });
                return;
            }
            res.status(200).json({
                statusCode: 200,
                message: "User retrieved successfully",
                data: {
                    id: user.id,
                    email: user.email,
                    username: user.username
                }
            });
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    };

    app.get("/users/me", authMiddleware(userService), getCurrentUser);

    // Quote routes (now protected)
    app.get('/quotes', authMiddleware(userService), async (req: Request, res: Response) => {
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

    app.post('/quotes', authMiddleware(userService), async (req: Request, res: Response) => {
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

    app.get('/quotes/:id', authMiddleware(userService), async (req: Request, res: Response) => {
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

    app.put('/quotes/:id', authMiddleware(userService), adminMiddleware, async (req: Request, res: Response) => {
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

    app.delete('/quotes/:id', authMiddleware(userService), adminMiddleware, async (req: Request, res: Response) => {
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