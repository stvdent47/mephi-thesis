import 'dotenv/config';
import z from 'zod';

export enum NODE_ENV {
	Development = 'development',
	Production = 'production',
	Test = 'test',
}

const envSchema = z.object({
	NODE_ENV: z.enum(NODE_ENV).default(NODE_ENV.Development),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string().min(1),
	JWT_SECRET: z.string().min(1),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
	console.error(`Invalid environment variables: ${JSON.stringify(result.error.format(), null, 2)}`);
	process.exit(1);
}

export const env = result.data;
