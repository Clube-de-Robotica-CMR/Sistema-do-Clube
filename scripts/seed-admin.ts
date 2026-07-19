import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { users_table } from '../src/infra/db/schemas/users.schema';
import 'dotenv/config'
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Erro: DATABASE_URL não encontrada no arquivo .env');
  process.exit(1);
}

async function main() {
  console.log('🌱 Iniciando seeding do banco de dados...');
  
  const client = postgres(connectionString as string, { prepare: false });
  const db = drizzle(client);

  const adminName = process.env.ADMIN_NAME;
  const rawPassword = process.env.ADMIN_PASSWORD;

  if (!adminName || !rawPassword) {
    console.error('❌ Erro: ADMIN_NAME ou ADMIN_PASSWORD não encontrada no arquivo .env');
    process.exit(1);
  }

  console.log(`Verificando se o usuário "${adminName}" já existe...`);
  
  const existingUser = await db
    .select()
    .from(users_table)
    .where(eq(users_table.name, adminName))

  const userExists = existingUser[0] ? true : false

  if (userExists) {
    console.log(`⚠️ O usuário "${adminName}" já existe no banco de dados. Pulando inserção.`);
    await client.end();
    return;
  }

  console.log('Criptografando a senha do administrador...');
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  console.log('Inserindo usuário no Supabase...');
  await db.insert(users_table).values({
    name: adminName,
    password: hashedPassword,
    role: 'admin',
  });

  console.log('✅ Seeding concluído com sucesso!');
  console.log('--------------------------------------------------');
  console.log(`👤 Usuário criado: ${adminName}`);
  console.log(`🔑 Senha padrão:   ${rawPassword}`);
  console.log('--------------------------------------------------');
  console.log('Agora você já pode testar sua rota de login (/api/auth/login).');
  
  await client.end();
}

main().catch((err) => {
  console.error('❌ Erro durante a execução do seed:', err);
  process.exit(1);
});