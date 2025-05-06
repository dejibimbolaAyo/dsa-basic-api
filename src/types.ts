/**
 * Interface representing a quote
 */
export interface Quote {
    /** Unique identifier for the quote */
    id: string;
    /** The quote text */
    text: string;
    /** The author of the quote */
    author: string;
    /** Tags categorizing the quote */
    tags: string[];
}

/**
 * Interface for API responses
 */
export interface ApiResponse {
    /** HTTP status code */
    statusCode: number;
    /** Success or error message */
    message: string;
    /** Optional data payload */
    data?: any;
} 