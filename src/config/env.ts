import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string().min(1),
	JWT_SECRET: z.string().min(1),
	GROQ_API_KEY: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
	console.error(`Invalid environment variables: ${JSON.stringify(result.error.format(), null, 2)}`);
	process.exit(1);
}

export const env = result.data;
