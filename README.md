# Sistema de Gestão - Clube de Robótica

Sistema para gerenciamento de um Clube de Robótica. O sistema centraliza a autenticação de usuários, o cadastro de membros, o controle de encontros, competições e o inventário de equipamentos.

A aplicação foi desenvolvida seguindo os princípios da **Clean Architecture (Ports and Adapters)**, mantendo as regras de negócio desacopladas da infraestrutura e utilizando **Zod** para validação dos dados.

---

# Tecnologias

- **Runtime:** Node.js + TypeScript
- **Banco de Dados:** PostgreSQL (Supabase)
- **ORM:** Drizzle ORM + Drizzle Kit
- **Autenticação:** JWT (Access Token em Cookie HttpOnly + Refresh Token persistido)
- **Validação:** Zod

---

# Modelo da API

A API segue um modelo baseado em **RPC (Remote Procedure Call)**, agrupando as operações por domínio em vez de utilizar um modelo REST tradicional.

## Regras

- Todas as operações utilizam o método **POST**.
- O corpo da requisição deve seguir o formato:

```json
{
  "action": "nome_da_acao",
  "data": {
    "propriedade": "valor"
  }
}
```

Todas as respostas seguem um formato padronizado.

**Sucesso**

```json
{
  "ok": true,
  "data": {}
}
```

ou

```json
{
  "ok": true,
  "message": "..."
}
```

**Erro**

```json
{
  "ok": false,
  "error": "Mensagem descritiva"
}
```

---

# Endpoints

## `/api/auth`

Endpoints responsáveis pela autenticação e renovação de sessão.

| Action | Dados (`data`) | Comportamento | Permissão |
|---------|----------------|---------------|-----------|
| `login` | `{ name, password }` | Valida as credenciais, gera o Access Token e define os cookies `access_token` e `refresh_token`. | Público |
| `refresh` | Nenhum | Valida o `refresh_token` presente nos cookies, gera um novo Access Token e atualiza o cookie. | Público |

---

## `/api/users`

Gerenciamento dos usuários da plataforma. Todas as operações exigem permissão de administrador.

| Action | Dados (`data`) | Comportamento | Permissão |
|---------|----------------|---------------|-----------|
| `read` | Nenhum | Retorna a lista de usuários omitindo as senhas por segurança. | Admin |
| `create` | `{ name, password, role }` | Registra um novo usuário com a senha criptografada utilizando Bcrypt. | Admin |
| `update` | `{ id, name?, password?, role? }` | Atualiza parcial ou totalmente os dados de um usuário existente. | Admin |
| `delete` | `{ id }` | Remove permanentemente um usuário do banco de dados. | Admin |

---

## `/api/members`

Gerenciamento dos membros do clube.

| Action | Dados (`data`) | Comportamento | Permissão |
|---------|----------------|---------------|-----------|
| `read` | Filtros opcionais: `{ search?, number?, name?, ... }` | Busca e filtra a listagem de membros. | Autenticado |
| `create` | `{ war_name, full_name, number, ... }` | Registra um novo membro garantindo que o número identificador seja único. | Autenticado |
| `update` | `{ id, ...camposModificados }` | Atualiza o registro do membro mesclando os dados enviados e revalidando o schema completo. | Autenticado |
| `delete` | `{ id }` | Remove o membro do sistema. | Autenticado |

---

## `/api/meetings`

Gerenciamento de encontros, presenças e métricas de participação dos membros.

| Action | Dados (`data`) | Comportamento | Permissão |
|---------|----------------|---------------|-----------|
| `create` | `{ quarter, date }` | Cria uma nova reunião e infere automaticamente o ano a partir da data informada. | Autenticado |
| `read` | `{ quarter, year }` | Lista todas as reuniões realizadas dentro do período informado. | Autenticado |
| `update` | `{ id, quarter?, date? }` | Atualiza os dados de uma reunião. | Autenticado |
| `delete` | `{ id }` | Remove a reunião e exclui em cascata todas as presenças associadas. | Autenticado |
| `save_attendances` | `{ meeting_id, attendances: [{ member_id, status }] }` | Registra ou atualiza, em lote, a lista de presenças da reunião. | Autenticado |
| `get_metrics` | `{ member_id, year, quarter }` | Calcula a taxa de participação de um membro em um trimestre (1°, 2° ou 3°). | Autenticado |

---

## `/api/competitions`

Gerenciamento das competições, resultados e ranking dos membros.

| Action | Dados (`data`) | Comportamento | Permissão |
|---------|----------------|---------------|-----------|
| `create` | `{ name, date }` | Registra uma nova competição. | Autenticado |
| `read_all` | Nenhum | Lista todas as competições cadastradas. | Autenticado |
| `read_by_id` | `{ id }` | Retorna os detalhes de uma competição específica. | Autenticado |
| `update` | `{ id, name?, date? }` | Atualiza os dados da competição. | Autenticado |
| `delete` | `{ id }` | Remove a competição e seus respectivos resultados. | Autenticado |
| `save_results` | `{ competition_id, results: [{ member_number, member_war_name, placement }] }` | Salva ou substitui os resultados da competição. | Autenticado |
| `get_results_by_competition` | `{ id }` | Retorna o placar completo de uma competição. | Autenticado |
| `get_member_score` | `{ member_number }` | Consolida o histórico de pontuação de um membro. | Autenticado |
| `get_ranking` | Nenhum | Retorna o ranking geral do clube ordenado por pontuação. | Autenticado |

---

## `/api/inventory`

Gerenciamento do inventário de peças, kits e equipamentos do laboratório.

| Action | Dados (`data`) | Comportamento | Permissão |
|---------|----------------|---------------|-----------|
| `read` | Filtros opcionais: `{ search?, classification?, collection?, status?, location? }` | Executa busca textual (`ILIKE`) combinando os filtros informados. | Autenticado |
| `create` | `{ item, quantity, classification, collection, status, location }` | Adiciona um novo item ao inventário. | Autenticado |
| `update` | `{ id, ...camposModificados }` | Atualiza informações como quantidade, status ou localização de um item. | Autenticado |
| `delete` | `{ id }` | Remove um item do inventário. | Autenticado |

---

# Executando o projeto

## 1. Clone o repositório

```bash
git clone https://github.com/Clube-de-Robotica-CMR/Sistema-do-Clube.git
cd Sistema-do-Clube
```

## 2. Instale as dependências

```bash
npm install
```

## 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, seguindo o exemplo do arquivo `.env.example`.

## 4. Execute as migrações

Gere os artefatos do Drizzle e aplique as migrações ao banco de dados.

```bash
npm run db:generate
npm run db:migrate
```

## 5. Crie o usuário administrador

```bash
npm run db:seed-admin
```

## 6. Inicie o servidor

```bash
npm run dev
```

---

# Estrutura do projeto

```text
src/
├── core/
│   ├── entities/          # Entidades de domínio e schemas Zod
│   ├── use-cases/         # Regras de negócio
│   └── errors/            # Exceções customizadas
│
├── infra/
│   ├── adapters/
│   │   ├── input/         # Implementações relativas à entrada de dados
│   │   └── output/        # Implementações relativas à saída de dados
│   │
│   └── db/
│       ├── drizzle/       # Configuração do Drizzle
│       └── schemas/       # Schemas do banco de dados
```

## Organização

- **core**: contém as regras de negócio independentes da infraestrutura.
- **infra**: implementa os adaptadores, acesso ao banco de dados, autenticação e demais integrações externas.

A separação segue o modelo **Clean Architecture (Ports and Adapters)**, permitindo que as regras de negócio permaneçam desacopladas das tecnologias utilizadas pela aplicação.