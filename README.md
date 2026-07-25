# 🤖 Sistema de Gestão - Clube de Robótica

Sistema web completo para gerenciamento administrativo de um Clube de Robótica.

A plataforma centraliza a administração de membros, encontros, competições, inventário e usuários, oferecendo ferramentas para controle de presença, cálculo automático de métricas, gestão de materiais e autenticação segura.

O projeto foi desenvolvido como um **monólito em Next.js**, reunindo frontend e backend na mesma aplicação. A camada de domínio segue os princípios da **Clean Architecture (Ports and Adapters)**, mantendo as regras de negócio desacopladas da infraestrutura.

---

# 🌐 Sistema

> Acesse a aplicação [aqui]()

---

# ✨ Funcionalidades

## 🔐 Autenticação

- Login seguro com JWT
- Access Token e Refresh Token
- Cookies HttpOnly
- Renovação automática da sessão
- Controle de permissões por cargo

---

## 👥 Membros

- Cadastro de membros
- Pesquisa textual
- Filtros avançados
- Atualização de informações
- Exclusão individual ou em massa
- Relatórios

---

## 📅 Encontros

- Cadastro de encontros
- Controle de presença
- Registro de faltas
- Histórico de encontros
- Gestão de listas de presença

---

## ⭐ Bônus (GIP)

Cálculo automático de:

- porcentagem de presença;
- bônus de nota;
- quantidade de faltas injustificadas;
- risco de desligamento.

---

## 🏆 Competições

- Cadastro de competições
- Pesquisa e filtros
- Registro completo do pódio
- Histórico de resultados

---

## 📈 Ranking (Ascensão)

Calcula automaticamente:

- medalhas de ouro;
- medalhas de prata;
- medalhas de bronze;
- pontuação total;
- elegibilidade para ascensão de nível.

---

## 📦 Inventário

Gerenciamento completo do laboratório.

- pesquisa;
- filtros;
- cadastro em lote;
- atualização;
- exclusão.

---

## 👤 Usuários

Painel exclusivo para administradores.

- criação de usuários;
- edição;
- exclusão;
- proteção contra alterações do usuário administrador.

---

# 🚀 Tecnologias

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

## Backend

- Next.js API Routes
- TypeScript
- PostgreSQL (Supabase)
- Drizzle ORM + Drizzle Kit
- JWT
- Bcrypt
- Zod

## Arquitetura

- Clean Architecture (Ports and Adapters)
- RPC API

---

# 🔒 Autenticação

O sistema utiliza autenticação baseada em **JWT**, composta por dois tokens:

- **Access Token**
  - armazenado em cookie HttpOnly;
  - utilizado para autenticação das requisições;
  - curta duração.

- **Refresh Token**
  - armazenado em cookie HttpOnly;
  - utilizado para gerar automaticamente um novo Access Token;
  - mantém a sessão do usuário sem necessidade de novo login.

Todo o processo de renovação ocorre automaticamente, proporcionando uma experiência transparente ao usuário.

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

### Sucesso

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

### Erro

```json
{
  "ok": false,
  "error": "Mensagem descritiva"
}
```

ou

```json
{
  "ok": false, 
    "error": "Mensagem descritiva",
    "details": {
      "formErrors": [
        "erro1"
      ],
      "fieldErrors": {
        "campo x": "erro y",
      }
    }
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
| `me` | Nenhum | Valida o `access_token` presente nos cookies e retorna as informações do usuário. | Autenticado |
| `logout` | Nenhum | Remove os cookies dos tokens do usuário. | Público |

---

## `/api/users`

Gerenciamento dos usuários da plataforma. Todas as operações exigem permissão de administrador.

| Action | Dados (`data`) | Comportamento | Permissão |
|---------|----------------|---------------|-----------|
| `read` | Nenhum | Retorna a lista de usuários omitindo as senhas por segurança. | Admin |
| `create` | `{ name, password }` | Registra um novo usuário com a senha criptografada utilizando Bcrypt. | Admin |
| `update` | `{ id, name?, password? }` | Atualiza parcial ou totalmente os dados de um usuário existente. | Admin |
| `delete` | `{ id }` | Remove permanentemente um usuário do banco de dados. | Admin |

---

## `/api/members`

Gerenciamento dos membros do clube.

| Action | Dados (`data`) | Comportamento | Permissão |
|---------|----------------|---------------|-----------|
| `read` | Filtros opcionais: `{ search?, number?, name?, ... }` | Busca e filtra a listagem de membros. | Autenticado |
| `get_report` | Filtros opcionais: `{ search?, number?, name?, ... }` | Retorna o relatório de membros baseado nos filtros. | Autenticado |
| `create` | `{ war_name, full_name, number, ... }` | Registra um novo membro garantindo que o número identificador seja único. | Autenticado |
| `update` | `{ id, ...camposModificados }` | Atualiza o registro do membro mesclando os dados enviados e revalidando o schema completo. | Autenticado |
| `delete` | `{ id }` | Remove o membro do sistema. | Autenticado |
| `delete_all` | Nenhum | Remove todos os membros do sistema. | Admin |

---

## `/api/meetings`

Gerenciamento de encontros, presenças e métricas de participação dos membros.

| Action | Dados (`data`) | Comportamento | Permissão |
|---------|----------------|---------------|-----------|
| `create` | `{ quarter, date }` | Cria uma nova reunião e infere automaticamente o ano a partir da data informada. | Autenticado |
| `read` | `{ quarter? }` | Lista todas as reuniões realizadas dentro do período informado. | Autenticado |
| `update` | `{ id, quarter?, date? }` | Atualiza os dados de uma reunião. | Autenticado |
| `delete` | `{ id }` | Remove a reunião e exclui em cascata todas as presenças associadas. | Autenticado |
| `delete_all` | Nenhum | Remove todas as reuniões e presenças do sistema. | Admin |
| `find_attendances` | `{ meeting_id }` | Busca todas as presenças e faltas de uma reunião específica. | Autenticado |
| `save_attendances` | `{ meeting_id, attendances: [{ member_id, status }] }` | Registra ou atualiza, em lote, a lista de presenças da reunião. | Autenticado |
| `get_metrics_by_member` | `{ member_id, quarter }` | Calcula a taxa de participação de um membro em um trimestre. | Autenticado |
| `get_all_metrics` | `{ quarter }` | Retorna as métricas de todos os membros. | Autenticado |

---

## `/api/competitions`

Gerenciamento das competições, resultados e ranking dos membros.

| Action | Dados (`data`) | Comportamento | Permissão |
|---------|----------------|---------------|-----------|
| `create` | `{ name, date }` | Registra uma nova competição. | Autenticado |
| `read` | `{ search?, year? }` | Lista todas as competições cadastradas de acordo com os filtros. | Autenticado |
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
| `read` | Filtros opcionais: `{ search?, classification?, collection?, status? }` | Executa busca textual combinando os filtros informados. | Autenticado |
| `create` | `{ item, quantity, classification, collection, status, location }` | Adiciona novos itens ao inventário. | Autenticado |
| `update` | `{ id, ...camposModificados }` | Atualiza informações como quantidade, status ou localização de um item. | Autenticado |
| `delete` | `{ id }` | Remove um item do inventário. | Autenticado |

---

# ▶️ Executando o projeto

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

Crie um arquivo `.env` na raiz do projeto seguindo o modelo disponível em `.env.example`.

## 4. Execute as migrações

```bash
npm run db:generate

npm run db:migrate
```

## 5. Crie o usuário administrador

```bash
npm run db:seed-admin
```

## 6. Inicie a aplicação

```bash
npm run dev
```

O sistema ficará disponível em:

```
http://localhost:3000
```

---

# 📄 Licença

Este projeto está licenciado sob a licença **MIT**.

Consulte o arquivo [LICENSE](LICENSE) para mais informações.