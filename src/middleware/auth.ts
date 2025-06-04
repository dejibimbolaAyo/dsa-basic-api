import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../userService";
import { UserRole } from "../entities/User";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        username: string;
        role: UserRole;
    };
}

export const authMiddleware = (userService: UserService) => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({
                    statusCode: 401,
                    message: "No authorization header"
                });
                return;
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                res.status(401).json({
                    statusCode: 401,
                    message: "No token provided"
                });
                return;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
            const user = await userService.getUserById(decoded.id);

            if (!user) {
                res.status(401).json({
                    statusCode: 401,
                    message: "User not found"
                });
                return;
            }

            req.user = {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            };
            next();
        } catch (error) {
            res.status(401).json({
                statusCode: 401,
                message: "Invalid token"
            });
        }
    };
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
            statusCode: 403,
            message: "Access denied. Admin role required."
        });
        return;
    }
    next();
}; 