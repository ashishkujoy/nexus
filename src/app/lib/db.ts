import { neon, Pool } from '@neondatabase/serverless';

// Create a connection pool for better performance and connection management
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Create a shared SQL instance using the pool
const sql = neon(process.env.DATABASE_URL!);

// Export both pool and sql for different use cases
export { pool, sql };

// Helper function to get a connection from the pool
export const getConnection = () => pool.connect();

// Helper function to close the pool (useful for cleanup)
export const closePool = () => pool.end();