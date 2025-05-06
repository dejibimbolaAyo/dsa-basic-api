import * as fs from 'fs';
import * as path from 'path';
import { Quote } from './types';

/**
 * File handler class for managing quote data
 * Encapsulates all file I/O operations related to quotes
 */
export class FileHandler {
    private filePath: string;

    /**
     * Constructor initializes with the path to quotes JSON file
     * @param fileName - The name of the file containing quotes
     */
    constructor(fileName: string = 'quotes.json') {
        this.filePath = path.join(process.cwd(), 'quotes', fileName);
    }

    /**
     * Reads all quotes from the JSON file
     * @returns Array of Quote objects
     * @throws Error if file reading fails
     */
    public readQuotes(): Quote[] {
        try {
            // Read the file synchronously
            const data = fs.readFileSync(this.filePath, 'utf8');
            // Parse the JSON data
            return JSON.parse(data) as Quote[];
        } catch (error) {
            console.error('Error reading quotes file:', error);
            // Return empty array instead of throwing to make API more resilient
            return [];
        }
    }

    /**
     * Writes quotes to the JSON file
     * @param quotes - Array of quotes to write
     * @returns boolean indicating success or failure
     */
    public writeQuotes(quotes: Quote[]): boolean {
        try {
            // Convert quotes to JSON string with pretty formatting
            const data = JSON.stringify(quotes, null, 2);
            // Write to file synchronously
            fs.writeFileSync(this.filePath, data, 'utf8');
            return true;
        } catch (error) {
            console.error('Error writing quotes file:', error);
            return false;
        }
    }

    /**
     * Gets a single quote by ID
     * @param id - The quote ID to find
     * @returns The found quote or undefined
     */
    public getQuoteById(id: string): Quote | undefined {
        const quotes = this.readQuotes();
        return quotes.find(quote => quote.id === id);
    }

    /**
     * Adds a new quote to the file
     * @param quote - The quote to add
     * @returns boolean indicating success or failure
     */
    public addQuote(quote: Quote): boolean {
        const quotes = this.readQuotes();
        // Ensure the ID is unique
        if (quotes.some(q => q.id === quote.id)) {
            return false;
        }
        quotes.push(quote);
        return this.writeQuotes(quotes);
    }

    /**
     * Updates an existing quote
     * @param id - ID of the quote to update
     * @param updatedQuote - New quote data
     * @returns boolean indicating success or failure
     */
    public updateQuote(id: string, updatedQuote: Quote): boolean {
        const quotes = this.readQuotes();
        const index = quotes.findIndex(quote => quote.id === id);

        if (index === -1) {
            return false;
        }

        quotes[index] = { ...updatedQuote, id }; // Ensure ID remains the same
        return this.writeQuotes(quotes);
    }

    /**
     * Deletes a quote by ID
     * @param id - ID of the quote to delete
     * @returns boolean indicating success or failure
     */
    public deleteQuote(id: string): boolean {
        const quotes = this.readQuotes();
        const initialLength = quotes.length;
        const filteredQuotes = quotes.filter(quote => quote.id !== id);

        if (filteredQuotes.length === initialLength) {
            return false; // No quote was removed
        }

        return this.writeQuotes(filteredQuotes);
    }

    /**
     * Gets a random quote
     * @returns A random quote or undefined if no quotes
     */
    public getRandomQuote(): Quote | undefined {
        const quotes = this.readQuotes();
        if (quotes.length === 0) {
            return undefined;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }
} 