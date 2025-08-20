WS Work Cars - Sistema de Gerenciamento de Veículos
Descrição do Projeto
Este é um sistema completo para gerenciamento de carros, marcas e modelos. O projeto é dividido em duas partes: um backend construído com FastAPI e um frontend desenvolvido com React. Ele permite listar, adicionar, atualizar e remover marcas, modelos e carros, além de fornecer uma interface de usuário para visualizar e interagir com os dados.

Tecnologias Utilizadas
Backend
O backend é uma API RESTful construída com Python e o framework FastAPI. As principais dependências são:

fastapi==0.104.1

uvicorn==0.24.0

sqlalchemy==2.0.23

python-dotenv==1.0.0

alembic==1.12.1

pydantic==2.5.0

Frontend
O frontend é uma aplicação de página única (SPA) desenvolvida com React. As dependências principais são:

react

react-dom

axios

react-scripts

Estrutura do Projeto
O projeto está organizado em duas pastas principais: backend e frontend.

backend/
Contém a lógica da API, o banco de dados e as ferramentas de inicialização.

main.py: Ponto de entrada da API, onde os endpoints são definidos.

models.py: Define os modelos de banco de dados (Brand, Model, Car) usando SQLAlchemy.

schemas.py: Contém os esquemas de validação de dados para as requisições e respostas da API, utilizando Pydantic.

crud.py: Funções para interagir com o banco de dados (Criar, Ler, Atualizar, Deletar).

database.py: Gerencia a conexão com o banco de dados, utilizando SQLite localmente.

requirements.txt: Lista todas as dependências Python.

seed_data.py: Script para popular o banco de dados com dados de exemplo iniciais.

start.py: Script de inicialização que verifica a instalação do Python e das dependências, cria e popula o banco de dados, e inicia o servidor backend.

frontend/
Contém a aplicação React e seus recursos.

public/: Arquivos estáticos como index.html, manifest.json e robots.txt.

src/: Contém o código-fonte da aplicação React.

App.js: O componente principal que gerencia o estado da aplicação e a navegação entre a listagem e o formulário.

components/: Subdiretório para componentes reutilizáveis como CarsList.js, CarForm.js e DeleteConfirmation.js.

Instalação e Execução
As instruções a seguir foram adaptadas do script start.py fornecido no backend.

Navegue para a pasta backend:

Bash

cd backend
Execute o script de inicialização:

Bash

python start.py
O script irá verificar a versão do Python, criar um ambiente virtual (venv), instalar as dependências, criar o banco de dados cars.db e inserir dados de exemplo, se necessário.

Inicie o servidor backend:
Pressione ENTER no terminal para iniciar o servidor. O backend será executado na porta 8000.

Abra um novo terminal e navegue para a pasta frontend:

Bash

cd ../frontend
Instale as dependências do frontend:

Bash

npm install
Inicie a aplicação frontend:

Bash

npm start
A aplicação será executada na porta 3000 e abrirá automaticamente no seu navegador.

Endpoints da API (Resumo de backend/main.py)
A API oferece endpoints CRUD para gerenciamento de marcas (/brands), modelos (/models) e carros (/cars).

GET /cars.json: Retorna a lista completa de carros em um formato específico para o frontend.

GET /brands: Lista todas as marcas.

POST /brands: Cria uma nova marca.

GET /brands/{brand_id}: Retorna uma marca específica por ID.

PUT /brands/{brand_id}: Atualiza uma marca por ID.

DELETE /brands/{brand_id}: Deleta uma marca por ID.

GET /models: Lista todos os modelos.

POST /models: Cria um novo modelo.

GET /models/{model_id}: Retorna um modelo específico por ID.

PUT /models/{model_id}: Atualiza um modelo por ID.

DELETE /models/{model_id}: Deleta um modelo por ID.

GET /cars: Lista todos os carros.

POST /cars: Cria um novo carro.

GET /cars/{car_id}: Retorna um carro específico por ID.

PUT /cars/{car_id}: Atualiza um carro por ID.

DELETE /cars/{car_id}: Deleta um carro por ID.