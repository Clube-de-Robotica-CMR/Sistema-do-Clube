import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não encontrada no arquivo .env');
}

export default defineConfig({
  schema: './src/infra/db/schemas/*.schema.ts', // Caminho onde estão seus schemas
  out: './drizzle',                             // Onde as migrações em SQL serão salvas
  dialect: 'postgresql',                        // O dialeto do banco
  dbCredentials: {
    url: process.env.DATABASE_URL,              // URL de conexão do Supabase
  },
});