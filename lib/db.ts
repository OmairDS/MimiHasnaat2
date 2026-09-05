import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set — add it in .env.local or in Vercel project settings.');
}
export const sql = neon(process.env.DATABASE_URL || '');
