import * as fs from 'fs';
import * as path from 'path';
import { Quote } from './types';

/**
 * File path for quotes storage
 * @param fileName - The name of the file containing quotes
 * @returns The full file path
 */
const getFilePath = (fileName: string = 'quotes.json'): string => {
    return path.join(process.cwd(), 'quotes', fileName);
};

/**
 * Reads all quotes from the JSON file
 * @param filePath - Path to the quotes file
 * @returns Array of Quote objects
 */
export const readQuotes = (filePath: string = getFilePath()): Quote[] => {
    try {
        // Read the file synchronously
        const data = fs.readFileSync(filePath, 'utf8');
        // Parse the JSON data
        return JSON.parse(data) as Quote[];
    } catch (error) {
        console.error('Error reading quotes file:', error);
        // Return empty array instead of throwing to make API more resilient
        return [];
    }
};

/**
 * Writes quotes to the JSON file
 * @param quotes - Array of quotes to write
 * @param filePath - Path to the quotes file
 * @returns boolean indicating success or failure
 */
export const writeQuotes = (quotes: Quote[], filePath: string = getFilePath()): boolean => {
    try {
        // Convert quotes to JSON string with pretty formatting
        const data = JSON.stringify(quotes, null, 2);
        // Write to file synchronously
        fs.writeFileSync(filePath, data, 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing quotes file:', error);
        return false;
    }
};

/**
 * Gets a single quote by ID
 * @param id - The quote ID to find
 * @param filePath - Path to the quotes file
 * @returns The found quote or undefined
 */
export const getQuoteById = (id: string, filePath: string = getFilePath()): Quote | undefined => {
    const quotes = readQuotes(filePath);
    return quotes.find(quote => quote.id === id);
};

/**
 * Adds a new quote to the file
 * @param quote - The quote to add
 * @param filePath - Path to the quotes file
 * @returns boolean indicating success or failure
 */
export const addQuote = (quote: Quote, filePath: string = getFilePath()): boolean => {
    const quotes = readQuotes(filePath);
    // Ensure the ID is unique
    if (quotes.some(q => q.id === quote.id)) {
        return false;
    }
    quotes.push(quote);
    return writeQuotes(quotes, filePath);
};

/**
 * Updates an existing quote
 * @param id - ID of the quote to update
 * @param updatedQuote - New quote data
 * @param filePath - Path to the quotes file
 * @returns boolean indicating success or failure
 */
export const updateQuote = (id: string, updatedQuote: Quote, filePath: string = getFilePath()): boolean => {
    const quotes = readQuotes(filePath);
    const index = quotes.findIndex(quote => quote.id === id);

    if (index === -1) {
        return false;
    }

    quotes[index] = { ...updatedQuote, id }; // Ensure ID remains the same
    return writeQuotes(quotes, filePath);
};

/**
 * Deletes a quote by ID
 * @param id - ID of the quote to delete
 * @param filePath - Path to the quotes file
 * @returns boolean indicating success or failure
 */
export const deleteQuote = (id: string, filePath: string = getFilePath()): boolean => {
    const quotes = readQuotes(filePath);
    const initialLength = quotes.length;
    const filteredQuotes = quotes.filter(quote => quote.id !== id);

    if (filteredQuotes.length === initialLength) {
        return false; // No quote was removed
    }

    return writeQuotes(filteredQuotes, filePath);
};

/**
 * Gets a random quote
 * @param filePath - Path to the quotes file
 * @returns A random quote or undefined if no quotes
 */
export const getRandomQuote = (filePath: string = getFilePath()): Quote | undefined => {
    const quotes = readQuotes(filePath);
    if (quotes.length === 0) {
        return undefined;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}; 