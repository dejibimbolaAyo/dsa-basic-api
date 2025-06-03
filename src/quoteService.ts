import { AppDataSource } from "./config/database";
import { Quote } from "./entities/Quote";
import { Repository } from "typeorm";

interface QuoteInput {
    text: string;
    author: string;
    tags: string[];
}

export class QuoteService {
    private readonly quoteRepository: Repository<Quote>;

    constructor() {
        this.quoteRepository = AppDataSource.getRepository(Quote);
    }

    async getAllQuotes(): Promise<Quote[]> {
        return await this.quoteRepository.find();
    }

    async getQuoteById(id: string): Promise<Quote | null> {
        return await this.quoteRepository.findOneBy({ id });
    }

    async getRandomQuote(): Promise<Quote | null> {
        const quotes = await this.quoteRepository.find();
        if (quotes.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    async createQuote(quoteData: Omit<Quote, "id" | "createdAt" | "updatedAt">): Promise<Quote> {
        const quote = this.quoteRepository.create(quoteData);
        return await this.quoteRepository.save(quote);
    }

    async updateQuote(id: string, quoteData: Partial<QuoteInput>): Promise<Quote | null> {
        const quote = await this.quoteRepository.findOneBy({ id });
        if (!quote) return null;

        Object.assign(quote, quoteData);
        return await this.quoteRepository.save(quote);
    }

    async deleteQuote(id: string): Promise<boolean> {
        const result = await this.quoteRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
} 