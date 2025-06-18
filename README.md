# 🍎 NutriCare


**NutriCare** é uma plataforma web que conecta nutricionistas e pacientes de forma prática, visual e moderna.  
O sistema permite criar planos alimentares personalizados e acompanhar o progresso calórico de forma interativa.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

## Sobre o Projeto

O NutriCare nasceu da observação de uma realidade comum: apesar de nutricionistas elaborarem planos alimentares completos, muitos pacientes não os seguem por falta de acompanhamento contínuo. O sistema resolve isso criando uma ponte direta e funcional entre profissional e paciente — saindo do papel e entrando na rotina digital.

![Banner da home do site](https://github.com/user-attachments/assets/c36611ba-8c1d-4147-8633-c5bc532afe89)
![Tela de dietas do site](https://github.com/user-attachments/assets/d725a50c-5447-4983-9e8a-d648cc9ad6ca)


---

## Funcionalidades

- **Autenticação Dupla:** Sistema de login e cadastro seguro para Médicos e Pacientes.
- **Gestão de Pacientes:** O nutricionista pode adicionar, visualizar e desvincular pacientes.
- **Criação de Planos Interativos:** Ferramenta para montar dietas com busca de alimentos via API externa (FatSecret).
- **Acompanhamento do Paciente:** O paciente visualiza sua dieta, marca refeições como concluídas e acompanha seu progresso de metas calóricas.
- **Registro de Avaliações:** O nutricionista pode registrar e atualizar os dados antropométricos dos seus pacientes.

---

## Tecnologias Utilizadas

- **Frontend:** [React](https://reactjs.org/) com [TypeScript](https://www.typescriptlang.org/)
- **Backend:** [Node.js](https://nodejs.org/) com [Express.js](https://expressjs.com/)
- **Banco de Dados:** [MySQL](https://www.mysql.com/)
- **API**: [FatSecret API](https://platform.fatsecret.com/) 

---

## Guia de Instalação

Para rodar o NutriCare localmente, siga os passos a seguir:

> Certifique-se de ter o [Node.js](https://nodejs.org/) e o [MySQL](https://www.mysql.com/downloads/) instalados.

---

### 1. Backend & Banco de Dados

1.  **Navegue até a pasta do backend:**
    ```bash
    cd backend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Banco de Dados:**
    * Crie um banco de dados MySQL chamado `nutricare_db`.
    * Execute o script SQL fornecido no projeto para criar as tabelas.

4.  **Configure as Variáveis de Ambiente:**
    * Na pasta `backend`, crie um arquivo `.env`.
    * Adicione o seguinte conteúdo, substituindo com suas credenciais:

    ```ini
    # backend/.env
    DB_HOST=localhost
    DB_USER=seu_usuario_mysql
    DB_PASSWORD=sua_senha_mysql
    DB_DATABASE=nutricare_db
    JWT_SECRET=coloque_uma_chave_secreta_longa_e_segura_aqui
    FATSECRET_CLIENT_ID=sua_chave_da_api_fatsecret
    FATSECRET_CLIENT_SECRET=seu_segredo_da_api_fatsecret
    ```

5.  **Inicie o Servidor Backend:**
    ```bash
    npm run dev 
    ```
    * O servidor estará rodando na porta 8080. Mantenha este terminal aberto.

---

### 2. Configuração da API Externa (FatSecret)

1.  **Crie uma Conta:** Vá ao site da [FatSecret Platform API](https://platform.fatsecret.com/) e crie uma conta de desenvolvedor.
2.  **Obtenha as Chaves:** Crie uma aplicação na plataforma para receber um **Client ID** e um **Client Secret**.
3.  **⚠️ Adicione seu IP à Whitelist (Obrigatório):** Na plataforma da FatSecret, encontre a seção "IP Whitelist" e adicione o seu IP público (pesquise "qual é o meu IP" no Google para encontrá-lo).

---

### 3. Configuração do Frontend

1.  **Abra um Novo Terminal:** Navegue até a pasta `frontend`.
    ```bash
    cd ../frontend 
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Na pasta `frontend`, crie um arquivo `.env`.
    * Adicione a seguinte linha:
    
    ```ini
    # frontend/.env
    REACT_APP_API_BASE_URL=http://localhost:8080
    ```

4.  **Inicie a Aplicação React:**
    ```bash
    npm start
    ```
    * Seu navegador deverá abrir automaticamente em `http://localhost:3000`.

---

## Equipe

Este projeto foi desenvolvido com dedicação por estudantes da USJT.

* **Pedro Santos** - *Desenvolvedor Back-end* - [GitHub](https://github.com/seu-usuario) | [LinkedIn](https://linkedin.com/in/seu-usuario)
* **Pedro da Costa** - *Designer e Desenvolvedor Front-end* - [GitHub](https://github.com/seu-usuario) | [LinkedIn](https://linkedin.com/in/seu-usuario)
* **Márcio** - *Designer e Desenvolvedor Front-end* - [GitHub](https://github.com/seu-usuario) | [LinkedIn](https://linkedin.com/in/seu-usuario)
* **Gabriela Danielly** - *Desenvolvedora Front-end* - [GitHub](https://github.com/seu-usuario) | [LinkedIn](https://linkedin.com/in/seu-usuario)
* **Max Maya** - *Desenvolvedor Front-end* - [GitHub](https://github.com/seu-usuario) | [LinkedIn](https://linkedin.com/in/seu-usuario)
* **Vitor Martins** - *Desenvolvedor Front-end* - [GitHub](https://github.com/seu-usuario) | [LinkedIn](https://linkedin.com/in/seu-usuario)
* **Carlos Freire** - *Desenvolvedor Full-Stack* - [GitHub](https://github.com/seu-usuario) | [LinkedIn](https://linkedin.com/in/seu-usuario)
