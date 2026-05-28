import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// For CLI tools and scripts, try to load .env.local if DATABASE_URL is not already set
if (typeof window === 'undefined' && !process.env.DATABASE_URL) {
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (e) {
    // dotenv not available or error loading, continue with existing env
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create postgres client
const client = postgres(process.env.DATABASE_URL);

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export types
export type DB = typeof db;
