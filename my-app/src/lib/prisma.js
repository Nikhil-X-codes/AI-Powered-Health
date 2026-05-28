import { PrismaClient } from '../generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})

const globalForPrisma = globalThis;

// Reuse Prisma client in development to avoid exhausting connections on hot reload
export const prisma =
  globalForPrisma.__prisma ||
  new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

/**
 * Retry wrapper for Neon idle database wake-up.
 * When Neon auto-suspends the compute, the first query after wake-up
 * can fail with a connection/timeout error. This retries with a delay
 * to give the database time to resume.
 */
export async function withRetry(operation, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (err) {
      const isLastAttempt = i === maxRetries - 1;

      // Check if it's a connection/timeout error (Neon waking up)
      const isConnectionError =
        err.message?.includes('connection') ||
        err.message?.includes('timeout') ||
        err.message?.includes('fetch failed') ||
        err.message?.includes('socket') ||
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('Connection terminated') ||
        err.code === 'P1001' || // Prisma: Can't reach database server
        err.code === 'P1002' || // Prisma: Database server timed out
        err.code === 'P1008' || // Prisma: Operations timed out
        err.code === 'P1017';   // Prisma: Server has closed the connection

      if (isLastAttempt || !isConnectionError) {
        throw err;
      }

      console.warn(
        `[DB Retry] Attempt ${i + 1}/${maxRetries} failed — database may be waking up. Retrying in 2s...`,
        { code: err.code, message: err.message }
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

/**
 * Warm up the database connection on server start.
 * Sends a lightweight query to wake Neon from idle state.
 */
async function warmupDatabase() {
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    console.log('[DB] Database connection warmed up successfully');
  } catch (err) {
    console.warn('[DB] Database warmup failed (will retry on first query):', err.message);
  }
}

// Warm up on module load
warmupDatabase();
