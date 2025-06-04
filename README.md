# Daily Quote API

A simple RESTful API for managing daily quotes, built with TypeScript, Node.js, Express.js, and PostgreSQL using TypeORM.

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- Support for all HTTP verbs (GET, POST, PUT, DELETE)
- PostgreSQL database with TypeORM
- Express.js for routing and middleware
- Built-in JSON body parsing
- CORS support
- No authentication/authorization required
- Heavily commented codebase for educational purposes
- Functional programming paradigm
- Pure functions with minimal side effects
- No classes or stateful objects (except for TypeORM entities)

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
├── src/                # TypeScript source code
│   ├── config/         # Configuration files
│   │   └── database.ts # TypeORM configuration
│   ├── entities/       # TypeORM entities
│   │   └── Quote.ts    # Quote entity definition
│   ├── index.ts        # Main entry point
│   ├── server.ts       # Express server and route handlers
│   └── quoteService.ts # Database operations handler
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)
- PostgreSQL (v12 or higher recommended)

## Installation Steps

### For Mac Users

1. Install Node.js and npm:

   ```bash
   # Using Homebrew (recommended)
   brew install node

   # Verify installation
   node --version
   npm --version
   ```

2. Install PostgreSQL:

   ```bash
   # Using Homebrew
   brew install postgresql@14

   # Start PostgreSQL service
   brew services start postgresql@14
   ```

3. Create the database:

   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database
   CREATE DATABASE quotes_db;

   # Create user (if needed)
   CREATE USER postgres WITH PASSWORD 'postgres';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE quotes_db TO postgres;
   ```

4. Clone the repository:

   ```bash
   git clone <repository-url>
   cd basic-api
   ```

5. Install dependencies:

   ```bash
   npm install
   ```

6. Build the project:

   ```bash
   npm run build
   ```

7. Start the server:
   ```bash
   npm start
   ```

### For Windows Users

1. Install Node.js and npm:

   - Download the Node.js installer from [nodejs.org](https://nodejs.org)
   - Run the installer and follow the installation wizard
   - Verify installation by opening Command Prompt:
     ```cmd
     node --version
     npm --version
     ```

2. Install PostgreSQL:

   - Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Run the installer and follow the installation wizard
   - Remember the password you set for the postgres user
   - Make sure to check the option to install the command line tools

3. Create the database:

   - Open Command Prompt
   - Connect to PostgreSQL:
     ```cmd
     psql -U postgres
     ```
   - Create database:
     ```sql
     CREATE DATABASE quotes_db;
     ```

4. Clone the repository:

   ```cmd
   git clone <repository-url>
   cd basic-api
   ```

5. Install dependencies:

   ```cmd
   npm install
   ```

6. Build the project:

   ```cmd
   npm run build
   ```

7. Start the server:
   ```cmd
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=quotes_db
PORT=3000
```

## Code Explanation

### Project Architecture

The project follows a modular architecture with clear separation of concerns:

1. **Database Configuration (`config/database.ts`)**

   - TypeORM configuration
   - Database connection settings
   - Entity registration

2. **Quote Entity (`entities/Quote.ts`)**

   - Defines the database schema
   - Includes validation and relationships
   - Handles data persistence

3. **Main Entry Point (`index.ts`)**

   - Initializes database connection
   - Sets up Express server
   - Handles application startup

4. **Server Module (`server.ts`)**

   - Express.js server configuration
   - Route handlers and middleware
   - Error handling and response formatting
   - CORS configuration

5. **Quote Service (`quoteService.ts`)**
   - Implements database operations
   - Handles CRUD operations
   - Manages data persistence

### Key Components

#### Express Server Setup

```typescript
export const createServer = (quoteService: QuoteService) => {
  const app = express();
  app.use(express.json());

  // CORS middleware
  app.use((req: Request, res: Response, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

  // Route handlers
  app.get("/quotes", async (req: Request, res: Response) => {
    // Handler implementation
  });

  // ... other routes ...

  return app;
};
```

#### Quote Entity

```typescript
@Entity()
export class Quote {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  text: string;

  @Column()
  author: string;

  @Column("simple-array")
  tags: string[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
```

### Request Flow

1. **Request Reception**

   - Server receives HTTP request
   - Request is parsed and validated
   - Route is determined

2. **Database Operation**

   - Appropriate database operation is executed
   - Data is validated and processed
   - Results are retrieved

3. **Response Generation**
   - Response is formatted
   - Status code is set
   - Data is sent back to client

## Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Error: `Connection refused`
   - Solution: Ensure PostgreSQL is running and credentials are correct

2. **Port Already in Use**

   - Error: `EADDRINUSE: address already in use :::3000`
   - Solution: Change the port in the configuration or kill the process using the port

3. **TypeScript Compilation Errors**

   - Error: `TS2307: Cannot find module`
   - Solution: Run `npm install` to ensure all dependencies are installed

4. **Database Migration Issues**
   - Error: `relation does not exist`
   - Solution: Ensure database is created and migrations are run

## License

This project is open-source and available for educational purposes.
