import { AppDataSource } from "./config/database";
import { User, UserRole } from "./entities/User";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // In production, always use environment variable

export class UserService {
    private readonly userRepository = AppDataSource.getRepository(User);

    async register(email: string, username: string, password: string, role: UserRole): Promise<{ user: User; token: string }> {
        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: [
                { email },
                { username }
            ]
        });

        if (existingUser) {
            throw new Error("User with this email or username already exists");
        }

        // Create new user
        const user = this.userRepository.create({
            email,
            username,
            password,
            role: role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER
        });

        // Save user to database
        await this.userRepository.save(user);

        // Generate JWT token
        const token = this.generateToken(user);

        return { user, token };
    }

    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        // Find user by email
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        // Validate password
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            throw new Error("Invalid email or password");
        }

        // Generate JWT token
        const token = this.generateToken(user);

        return { user, token };
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async updateUser(id: string, data: Partial<User>): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return null;
        }

        // Update user fields
        Object.assign(user, data);
        return this.userRepository.save(user);
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return result.affected !== undefined && result.affected !== null && result.affected > 0;
    }

    private generateToken(user: User): string {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
} 