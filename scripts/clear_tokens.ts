import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { refresh_tokens_table } from '../src/infra/db/schemas/refresh_tokens.schema';
import 'dotenv/config';
import { lte } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Erro: DATABASE_URL não encontrada no arquivo .env');
  process.exit(1);
}

async function main() {
  const client = postgres(connectionString as string, { prepare: false });
  const db = drizzle(client);

  const argument = process.argv[2];

  if (argument === '--all') {
    console.log('🧹 Limpando TODOS os refresh tokens do banco de dados...');
    
    await db.delete(refresh_tokens_table);
    
    console.log('✅ Todos os tokens foram apagados com sucesso!');
  } else {
    console.log('🧹 Limpando apenas os tokens EXPIRADOS do banco de dados...');
    
    await db
      .delete(refresh_tokens_table)
      .where(lte(refresh_tokens_table.expires_at, new Date()));
      
    console.log('✅ Tokens expirados limpos com sucesso!');
  }

  await client.end();
}

main().catch((err) => {
  console.error('❌ Erro durante a execução da limpeza:', err);
  process.exit(1);
});