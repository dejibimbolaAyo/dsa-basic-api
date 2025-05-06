# Daily Quote API

A simple RESTful API for managing daily quotes, built with TypeScript and native Node.js HTTP module (no external libraries), implementing a functional programming approach.

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- Support for all HTTP verbs (GET, POST, PUT, DELETE)
- JSON file-based storage (no database required)
- No authentication/authorization required
- Heavily commented codebase for educational purposes
- Functional programming paradigm
- Pure functions with minimal side effects
- No classes or stateful objects

## API Endpoints

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| GET    | /quotes        | Get all quotes           |
| GET    | /quotes/random | Get a random quote       |
| GET    | /quotes/:id    | Get quote by ID          |
| POST   | /quotes        | Create a new quote       |
| PUT    | /quotes/:id    | Update an existing quote |
| DELETE | /quotes/:id    | Delete a quote           |

## Project Structure

```
basic-api/
├── dist/               # Compiled JavaScript files
├── quotes/             # Data storage
│   └── quotes.json     # JSON file with quote data
├── src/                # TypeScript source code
│   ├── index.ts        # Main entry point
│   ├── server.ts       # HTTP server and request handlers
│   ├── fileHandler.ts  # File I/O operations
│   └── types.ts        # TypeScript interfaces
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Functional Programming Principles Applied

- Pure functions with predictable outputs based on inputs
- Avoidance of shared mutable state
- Function composition for complex operations
- Separation of data and behavior
- Immutable data structures where possible
- First-class and higher-order functions

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Running the API

1. Build the project:

   ```
   npm run build
   ```

2. Start the server:
   ```
   npm start
   ```

The API will be available at `http://localhost:3000`.

## Examples

### Get all quotes

```
GET /quotes
```

Response:

```json
{
  "statusCode": 200,
  "message": "Quotes retrieved successfully",
  "data": [
    {
      "id": "1",
      "text": "The best way to predict the future is to invent it.",
      "author": "Alan Kay",
      "tags": ["inspiration", "future"]
    }
    // ...more quotes
  ]
}
```

### Create a new quote

```
POST /quotes
Content-Type: application/json

{
  "text": "Be the change you wish to see in the world.",
  "author": "Mahatma Gandhi",
  "tags": ["inspiration", "change"]
}
```

Response:

```json
{
  "statusCode": 201,
  "message": "Quote created successfully",
  "data": {
    "id": "6",
    "text": "Be the change you wish to see in the world.",
    "author": "Mahatma Gandhi",
    "tags": ["inspiration", "change"]
  }
}
```

## License

This project is open-source and available for educational purposes.
