# Frontend - Sistema de Gestão do Clube de Robótica

Este documento define a arquitetura, os padrões e as convenções utilizadas no frontend do Sistema de Gestão do Clube de Robótica.

O objetivo desta documentação é permitir que qualquer desenvolvedor implemente um novo módulo sem precisar estudar o restante do projeto.

---

# Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React (ícones)

---

# Filosofia do projeto

O frontend foi desenvolvido priorizando:

- simplicidade;
- reutilização de componentes;
- separação entre interface e lógica;
- padronização visual;
- fácil manutenção.

Todo módulo deve seguir exatamente os mesmos padrões descritos neste documento.

---

# Estrutura do projeto

```text
src/
│
├── components/
│   │
│   ├── layout/
│   │
│   ├── modules/
│   │   ├── students/
│   │   ├── meetings/
│   │   ├── bonus/
│   │   ├── competitions/
│   │   ├── ranking/
│   │   ├── inventory/
│   │   └── users/
│   │
│   └── ui/
│
├── lib/
├── pages/
├── services/
└── styles/
```

Cada pasta possui uma responsabilidade específica.

---

# components/layout

Contém apenas componentes responsáveis pela estrutura da aplicação.

Exemplos:

- HomeLayout
- Sidebar

Esses componentes **não possuem regra de negócio**.

Eles apenas organizam a tela.

---

# components/ui

Contém componentes totalmente genéricos.

Eles nunca conhecem:

- módulos;
- API;
- banco;
- regras do sistema.

São apenas componentes reutilizáveis.

Exemplos:

- Button
- Card
- Dialog
- Input
- PasswordInput
- FormField

---

## Regra importante

Caso um desenvolvedor perceba que um componente pode ser reutilizado em mais de um módulo, ele **não deve criá-lo imediatamente**.

Primeiro deve solicitar autorização para adicioná-lo à pasta `ui`.

Isso evita:

- componentes duplicados;
- dois componentes fazendo praticamente a mesma coisa;
- perda de padronização.

---

# components/modules

Cada módulo do sistema possui sua própria pasta.

Exemplo:

```text
modules/
└── students/
```

Os módulos **não conhecem uns aos outros**.

Toda a lógica de cada módulo permanece isolada.

---

# Organização de um módulo

Todo módulo deve seguir esta estrutura.

```text
students/
│
├── index.tsx
├── services.ts
├── types.ts
├── constants.ts
├── hooks.ts
├── utils.ts
│
└── components/
    ├── table.tsx
    ├── filters.tsx
    ├── form.tsx
    ├── delete_dialog.tsx
    └── ...
```

Nem todos os arquivos precisam existir.

Crie apenas os necessários.

Entretanto, sempre siga esta organização.

---

# Responsabilidade de cada arquivo

## index.tsx

Componente principal do módulo.

Responsável por:

- estado;
- carregamento dos dados;
- comunicação entre os componentes internos.

---

## services.ts

Todas as chamadas RPC ficam aqui.

Exemplo:

```ts
export async function readStudents() {}

export async function createStudent() {}

export async function updateStudent() {}

export async function deleteStudent() {}
```

Nenhum outro arquivo faz chamadas HTTP diretamente.

---

## types.ts

Tipos exclusivos do módulo.

Nunca coloque tipos compartilhados aqui.

---

## constants.ts

Constantes do módulo.

Exemplos:

- filtros
- colunas
- opções de select
- labels

---

## hooks.ts

Hooks específicos do módulo.

Caso não existam hooks próprios, o arquivo não deve ser criado.

---

## utils.ts

Funções auxiliares.

Exemplos:

- formatadores;
- validações simples;
- conversões.

---

## components/

Componentes exclusivos daquele módulo.

Esses componentes não devem ser reutilizados por outros módulos.

Caso isso aconteça, eles provavelmente pertencem à pasta `ui`.

---

# Fluxo da aplicação

Todo módulo segue exatamente este fluxo.

```
Página

↓

HomeLayout

↓

Módulo

↓

services.ts

↓

rpcClient()

↓

API
```

Esse fluxo nunca deve ser quebrado.

---

# Chamadas da API

Todos os módulos utilizam:

```ts
rpcClient(...)
```

Porém apenas através do arquivo:

```
services.ts
```

Nunca faça:

```ts
useEffect(() => {
    rpcClient(...)
})
```

Diretamente dentro de um componente.

Sempre crie uma função em `services.ts`.

---

# Estado

Cada módulo controla seu próprio estado.

Exemplo:

```tsx
const [students, setStudents] = useState([]);
```

Não existe estado global.

Não utilizamos:

- Redux
- Zustand
- MobX

Cada módulo é independente.

---

# Componentes UI

Os componentes de `ui` nunca devem:

- chamar API;
- conhecer módulos;
- possuir regras do sistema.

Eles apenas recebem props.

---

# Sidebar

A Sidebar possui apenas uma responsabilidade:

Trocar o módulo ativo.

Ela nunca:

- busca dados;
- chama API;
- executa regras de negócio.

---

# HomeLayout

O HomeLayout é responsável por:

- controlar o módulo ativo;
- renderizar a Sidebar;
- renderizar o módulo atual.

Nenhuma regra específica dos módulos pertence ao HomeLayout.

---

# Estilo visual

O sistema segue o padrão visual inspirado no Convenia.

Características:

- tons de roxo;
- bastante espaço entre elementos;
- cantos arredondados;
- cards;
- sombras suaves;
- animações discretas.

---

# Responsividade

Neste momento o sistema é desenvolvido pensando apenas em desktop.

A adaptação para dispositivos móveis será realizada futuramente.

Não é necessário implementar comportamento mobile durante o desenvolvimento dos módulos.

---

# Ícones

Todos os ícones utilizam exclusivamente:

```
lucide-react
```

Nunca utilizar:

- Hero Icons
- SVG manual
- imagens

---

# Tabelas

Todos os módulos que exibem listas utilizam tabela HTML tradicional.

Nunca utilizar cards para representar tabelas.

---

# Formulários

Todos os formulários devem abrir dentro de um Dialog.

Nunca criar páginas separadas apenas para cadastro.

---

# Exclusões

Toda operação destrutiva deve solicitar confirmação.

Sempre utilizar o componente:

```
Dialog
```

com variante:

```
danger
```

---

# Textos

Todo texto exibido ao usuário deve estar em português.

---

# Princípios do projeto

Um módulo nunca conhece outro módulo.

Componentes UI nunca fazem chamadas HTTP.

Toda comunicação com o backend passa por `services.ts`.

Toda exclusão solicita confirmação.

Toda ação importante possui feedback visual.

Toda interface segue o padrão visual definido.

Nenhum componente duplicado deve ser criado.

---

# Componentes reutilizáveis existentes

Atualmente existem:

- Button
- Card
- Dialog
- Input
- PasswordInput
- FormField

Sempre reutilize esses componentes.

---

# Componentes reutilizáveis previstos

Os seguintes componentes deverão ser criados futuramente conforme a necessidade surgir.

## DataTable

Responsável por:

- tabela;
- seleção múltipla;
- checkbox do cabeçalho;
- loading;
- estado vazio;
- paginação (caso implementada).

Será utilizada por:

- alunos;
- bônus;
- inventário;
- usuários;
- ranking.

---

## SearchBar

Campo de pesquisa reutilizável.

Será utilizado por:

- alunos;
- inventário;
- usuários.

---

## Toolbar

Barra superior contendo:

- pesquisa;
- filtros;
- adicionar;
- apagar selecionados.

---

## FilterDropdown

Dropdown reutilizável para filtros.

---

## FormDialog

Estrutura base para formulários.

Será utilizada por:

- alunos;
- encontros;
- competições;
- inventário;
- usuários.

---

## Badge

Responsável por representar:

- status;
- função;
- presença;
- ranking;
- classificações.

---

## EmptyState

Tela apresentada quando não existem registros.

---

## Loading

Indicador de carregamento.

---

## Toast

Mensagens de sucesso e erro.

---

# Guia para desenvolver um módulo

Todo módulo deve seguir exatamente os passos abaixo.

---

## 1. Criar a pasta

```
components/modules/nome-do-modulo
```

---

## 2. Criar o componente principal

```
index.tsx
```

Esse componente controla:

- estados;
- carregamento;
- eventos;
- comunicação com os componentes internos.

---

## 3. Criar o services.ts

Adicionar todas as chamadas RPC.

Exemplo:

```ts
read()

create()

update()

delete()
```

Nenhum outro arquivo deve chamar `rpcClient`.

---

## 4. Criar os componentes internos

Dentro da pasta:

```
components/
```

Separar:

- tabela;
- filtros;
- formulários;
- diálogos;
- componentes específicos.

---

## 5. Criar tipos

Caso existam tipos exclusivos.

---

## 6. Criar constantes

Caso existam filtros ou opções fixas.

---

## 7. Criar utilitários

Caso existam funções auxiliares.

---

## 8. Registrar o módulo

Adicionar o módulo em:

- HomeModule
- Sidebar
- ModuleRenderer

---

## 9. Utilizar apenas componentes reutilizáveis

Antes de criar qualquer componente novo, verificar se já existe um equivalente em `ui`.

Caso o componente possa ser reutilizado por outros módulos, solicitar autorização antes de adicioná-lo à pasta `ui`.

---

# Como cada módulo deve funcionar

## Alunos

Objetivo:

Gerenciar os membros do clube.

Interface:

- barra de pesquisa;
- botão de filtros;
- botão adicionar;
- tabela;
- seleção múltipla;
- exclusão em massa.

Admin:

- botão "Apagar todos".

---

## Encontros

Objetivo:

Gerenciar reuniões.

Interface:

- filtro por trimestre;
- lista de encontros;
- criação;
- edição;
- exclusão;
- gerenciamento de presenças.

Admin:

- botão "Apagar todos".

---

## Bônus (GIP)

Mesmo layout do módulo Alunos.

Além das informações básicas, deve exibir:

- porcentagem de presença;
- pontos bônus.

Os dados são obtidos através de:

```
get_metrics
```

---

## Competições

Mesmo conceito de Encontros.

Permite:

- criar competição;
- editar;
- excluir;
- registrar resultados;
- visualizar resultados.

---

## Ascensão de Nível

Mesmo layout do módulo Bônus.

Deve apresentar:

- ranking;
- pontuação;
- elegibilidade para ascensão.

Utiliza:

```
get_ranking
```

---

## Inventário

Mesmo layout de Alunos.

Possui:

- pesquisa;
- filtros;
- adicionar;
- editar;
- excluir;
- seleção múltipla.

---

## Usuários

Módulo exclusivo para administradores.

Permite:

- listar usuários;
- criar usuários;
- alterar nome;
- alterar senha;
- alterar função;
- excluir usuários.

Não existe recuperação de senha.

A redefinição é realizada diretamente por um administrador.

---

# Objetivo final

O frontend deve permanecer modular, organizado e consistente.

Qualquer novo desenvolvedor deve conseguir criar um módulo inteiro apenas seguindo este documento, sem precisar consultar o restante do código do projeto.