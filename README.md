# API de Gerenciamento de Academia

Esta API foi desenvolvida para gerenciar um sistema de academia, permitindo o controle de alunos, professores, exercícios, aulas e fichas de treino. Ela oferece funcionalidades de autenticação e rotas protegidas para garantir a segurança dos dados.



## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework web para Node.js, utilizado para construir a API.
- **PostgreSQL**: Banco de dados relacional para armazenamento de dados.
- **Sequelize**: ORM (Object-Relational Mapper) para Node.js, facilitando a interação com o banco de dados PostgreSQL.
- **bcrypt/bcryptjs**: Bibliotecas para hash de senhas, garantindo a segurança das credenciais dos usuários.
- **jsonwebtoken**: Para geração e verificação de tokens JWT (JSON Web Tokens) para autenticação.
- **cors**: Middleware para habilitar o CORS (Cross-Origin Resource Sharing).
- **dotenv**: Para carregar variáveis de ambiente de um arquivo `.env`.
- **multer**: Middleware para lidar com upload de arquivos (embora não explicitamente usado no `app.js` principal, está listado nas dependências).




## Funcionalidades

- **Autenticação de Usuários**: Login e registro de usuários (professores e alunos) com JWT.
- **Gerenciamento de Professores**: Rotas para operações CRUD (Criar, Ler, Atualizar, Deletar) de professores.
- **Gerenciamento de Alunos**: Rotas para operações CRUD de alunos.
- **Gerenciamento de Exercícios**: Rotas para operações CRUD de exercícios.
- **Gerenciamento de Aulas**: Rotas para operações CRUD de aulas.
- **Gerenciamento de Fichas de Treino**: Rotas para operações CRUD de fichas de treino.
- **Associação Ficha-Exercício**: Rotas para gerenciar a relação entre fichas de treino e exercícios.
- **Conexão com Banco de Dados**: Utiliza Sequelize para conexão e sincronização com PostgreSQL.




## Estrutura do Projeto

- `app.js`: Arquivo principal da aplicação, onde o Express é configurado, os middlewares são aplicados e as rotas são importadas e utilizadas.
- `src/config/config.js`: Contém a configuração do Sequelize e a conexão com o banco de dados.
- `src/routes/`: Pasta que contém os arquivos de definição de rotas para cada entidade (authRoutes, alunoRoutes, professorRoutes, exercicioRoutes, aulaRoutes, fichaRoutes, fichaExercicioRoutes, protectedRoutes).
- `.env`: Arquivo para armazenar variáveis de ambiente sensíveis, como credenciais do banco de dados e segredo JWT.
- `package.json`: Define as dependências do projeto e scripts de inicialização.




## Configuração

Para configurar o projeto, você precisará de um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
DB_NAME=seu_nome_do_banco
DB_USER=seu_usuario_do_banco
DB_PASSWORD=sua_senha_do_banco
DB_HOST=seu_host_do_banco
PORT=porta_da_aplicacao (ex: 3000)
JWT_SECRET=sua_chave_secreta_jwt
```

Certifique-se de substituir os valores pelos seus próprios dados de conexão com o banco de dados PostgreSQL.


## Instalação e Execução

Siga os passos abaixo para configurar e executar a API localmente:

1.  **Clone o repositório** (se aplicável, caso contrário, certifique-se de ter todos os arquivos em um diretório):

    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd <nome_do_diretorio>
    ```

2.  **Instale as dependências**:

    ```bash
    npm install
    ```

3.  **Crie o arquivo `.env`** na raiz do projeto com as variáveis de ambiente conforme a seção de Configuração.

4.  **Execute a aplicação**:

    ```bash
    npm start
    ```

    A API estará disponível em `http://localhost:3000` (ou na porta especificada na sua variável `PORT`).






## Rotas da API

As rotas principais da API são:

-   `/auth`: Rotas para autenticação (login, registro).
-   `/api/professores`: Rotas para gerenciamento de professores.
-   `/api/alunos`: Rotas para gerenciamento de alunos.
-   `/api/exercicios`: Rotas para gerenciamento de exercícios.
-   `/api/aulas`: Rotas para gerenciamento de aulas.
-   `/api/fichas`: Rotas para gerenciamento de fichas de treino.
-   `/api/ficha-exercicios-admin`: Rotas para gerenciamento de exercícios em fichas de treino.
-   `/api`: Rotas protegidas que requerem autenticação.


## Observações

-   A sincronização com o banco de dados (`sequelize.sync()`) é feita automaticamente na inicialização da aplicação, criando as tabelas caso não existam.
-   A aplicação utiliza `node --watch app.js` para reiniciar automaticamente em caso de alterações no código durante o desenvolvimento.


