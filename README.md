WS Work Cars - Sistema de Gerenciamento de Veículos
Descrição do Projeto
Este projeto é um sistema de gerenciamento de carros, marcas e modelos, implementado como uma aplicação web completa. Ele consiste em um backend (API) construído com FastAPI e um frontend (interface de usuário) desenvolvido em React. O sistema permite listar, adicionar, atualizar e remover dados de veículos e suas respectivas marcas e modelos.

Tecnologias Utilizadas
O projeto é dividido em dois módulos principais.

Backend (Python)
A API RESTful foi desenvolvida com Python, utilizando as seguintes bibliotecas:

FastAPI: Framework web de alta performance.

Uvicorn: Servidor ASGI para rodar a aplicação FastAPI.

SQLAlchemy: Toolkit ORM para interagir com o banco de dados.

python-dotenv: Para carregar variáveis de ambiente.

psycopg2-binary: Driver para PostgreSQL.

pydantic: Biblioteca para validação de dados.

O banco de dados utilizado por padrão no ambiente de desenvolvimento é o SQLite.

Frontend (React)
A aplicação de interface de usuário (UI) é um SPA (Single Page Application) criada com React. As principais bibliotecas incluem:

React: Biblioteca JavaScript para construir interfaces de usuário.

axios: Cliente HTTP para fazer requisições à API.

react-scripts: Scripts de desenvolvimento e build do Create React App.

web-vitals: Para monitorar o desempenho da aplicação web.

tailwind: Biblioteca CSS para agilizar o desenvolvimento.

Estrutura do Projeto
O projeto está organizado em duas pastas principais, backend e frontend.

backend/
main.py: O arquivo principal que define os endpoints da API usando FastAPI. Ele também configura o CORS para permitir requisições do frontend.

models.py: Define a estrutura do banco de dados para Brand, Model e Car utilizando SQLAlchemy.

schemas.py: Define os esquemas de dados para validação e serialização com Pydantic.

crud.py: Funções de "Create, Read, Update, Delete" para interagir com o banco de dados.

database.py: Estabelece a conexão com o banco de dados.

seed_data.py: Um script para preencher o banco de dados com dados iniciais, como marcas, modelos e alguns carros de exemplo.

requirements.txt: Lista todas as dependências Python necessárias.

start.py: Um script de utilitário para automatizar a configuração e inicialização do backend.

frontend/
public/: Contém arquivos públicos como index.html, manifest.json, robots.txt e ícones. O manifest.json define a aplicação como uma PWA (Progressive Web App).

src/:

App.js: O componente raiz da aplicação, responsável por gerenciar o estado, a navegação entre a listagem de carros e o formulário de adição, e a comunicação inicial com a API.

index.js: O ponto de entrada do React que renderiza o componente App.

App.css, index.css: Arquivos de estilo globais e específicos da aplicação.

components/: Contém os componentes da UI.

CarsList.js: Exibe a lista de carros agrupados por marca.

CarForm.js: O formulário para adicionar novos carros.

DeleteConfirmation.js: Um modal reutilizável para confirmar a exclusão de itens.

package.json: Informações do projeto e dependências do frontend.

package-lock.json: Lista detalhada de todas as dependências instaladas.

Instalação e Execução
Para iniciar o projeto, siga os passos abaixo em dois terminais separados.

1. Iniciar o Backend
Abra um terminal e navegue até a pasta backend.

Bash

cd backend
Execute o script start.py. Ele irá cuidar da configuração do ambiente Python, instalar as dependências e preparar o banco de dados.

Bash

python start.py
Pressione ENTER para iniciar o servidor. O backend será executado na porta 8000.

2. Iniciar o Frontend
Abra um NOVO terminal e navegue até a pasta frontend.

Bash

cd frontend
Instale as dependências do Node.js (apenas na primeira vez).

Bash

npm install
Inicie a aplicação React.

Bash

npm start
O frontend será executado na porta 3000 e a aplicação será aberta automaticamente no seu navegador.

Endpoints da API
A API foi projetada para ser consumida pelo frontend e oferece as seguintes funcionalidades principais:

Listagem de Carros para o Frontend

GET /cars.json: Retorna a lista de carros com as informações de marca e modelo, formatada para exibição na UI.

Endpoints CRUD para Marcas (/brands)

POST /brands: Cria uma nova marca.

GET /brands: Lista todas as marcas.

GET /brands/{brand_id}: Obtém uma marca por ID.

PUT /brands/{brand_id}: Atualiza uma marca por ID.

DELETE /brands/{brand_id}: Deleta uma marca por ID.

Endpoints CRUD para Modelos (/models)

POST /models: Cria um novo modelo, verificando se a marca associada existe.

GET /models: Lista todos os modelos com os dados da marca associada.

GET /models/{model_id}: Obtém um modelo por ID.

PUT /models/{model_id}: Atualiza um modelo por ID.

DELETE /models/{model_id}: Deleta um modelo por ID.

Endpoints CRUD para Carros (/cars)

POST /cars: Cria um novo carro, verificando se o modelo associado existe.

GET /cars: Lista todos os carros com informações detalhadas de modelo e marca.

GET /cars/{car_id}: Obtém um carro por ID.

PUT /cars/{car_id}: Atualiza um carro por ID.

DELETE /cars/{car_id}: Deleta um carro por ID.
