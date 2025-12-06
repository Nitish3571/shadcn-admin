import { z } from 'zod';

/**
 * Environment variable schema
 * Validates all required environment variables at startup
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z
    .string()
    .url('VITE_API_BASE_URL must be a valid URL')
    .min(1, 'VITE_API_BASE_URL is required'),
});

/**
 * Parse and validate environment variables
 * Throws error if validation fails
 */
function validateEnv() {
  try {
    return envSchema.parse({
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      
      console.error('❌ Invalid environment variables:');
      missingVars.forEach((msg) => console.error(`  - ${msg}`));
      console.error('\n💡 Please check your .env file');
      
      throw new Error(
        `Environment validation failed:\n${missingVars.join('\n')}`
      );
    }
    throw error;
  }
}

/**
 * Validated environment variables
 * Safe to use throughout the application
 */
export const env = validateEnv();

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>;
