DROP DATABASE IF EXISTS railway;
CREATE DATABASE railway;
USE railway;

CREATE TABLE nutricionista (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    crm VARCHAR(9) NOT NULL UNIQUE, 
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(11) NOT NULL,
    pwd VARCHAR(255) NOT NULL
);

CREATE TABLE paciente (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(11) NOT NULL,
    pwd VARCHAR(100) NOT NULL,
    id_nutricionista INT,
    FOREIGN KEY (id_nutricionista) REFERENCES nutricionista(id) ON DELETE CASCADE
);

-- CREATE TABLE planoalimentar (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     id_paciente INT,
--     data_inicio DATE,
--     data_fim DATE,
--     objetivo VARCHAR(255),
--     FOREIGN KEY (id_paciente) REFERENCES paciente(id)
-- );

CREATE TABLE refeicao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50),
    horario_sugerido VARCHAR(50),
    id_paciente INT NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES paciente(id) ON DELETE CASCADE
);

CREATE TABLE alimento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    api_food_id VARCHAR(50) NOT NULL,
    name_alimento VARCHAR(255),
    quantidade INT,
    descricao_porcao VARCHAR(255),
    calorias INT,
    proteinas DECIMAL(10,2),    
    carboidratos DECIMAL(10,2),
    gorduras DECIMAL(10,2),
    id_refeicao INT NOT NULL,
    FOREIGN KEY (id_refeicao) REFERENCES refeicao(id) ON DELETE CASCADE
);

-- CREATE TABLE composicaorefeicao (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     id_refeicao INT,
--     id_alimento INT,
--     quantidade DECIMAL(6,2),
--     unidade VARCHAR(20),
--     FOREIGN KEY (id_refeicao) REFERENCES refeicao(id),
--     FOREIGN KEY (id_alimento) REFERENCES alimento(id)
-- );

CREATE TABLE avaliacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT,
    data_avaliacao DATE,
    peso DECIMAL(5,2),
    altura DECIMAL(5,2),
    circunferencia DECIMAL(5,2),
    observacoes TEXT,
    FOREIGN KEY (id_paciente) REFERENCES paciente(id)
);

CREATE TABLE diario_refeicao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT NOT NULL,
    id_refeicao INT NOT NULL,
    data_conclusao DATE NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES paciente(id) ON DELETE CASCADE,
    FOREIGN KEY (id_refeicao) REFERENCES refeicao(id) ON DELETE CASCADE,
    UNIQUE KEY `progresso_diario` (`id_paciente`, `id_refeicao`, `data_conclusao`)
);

INSERT INTO nutricionista (name, crm, email, phone, pwd) VALUES
('Carlos Freire', 'SP-688888', 'drcarlos@gmail.com', '11928375362', '$2b$10$UTcfi7DjKU0HnhPsly9hH.BWSx7b69hItMwO2kJK3zs4.q77iahde');

INSERT INTO paciente (name, email, phone, pwd) VALUES
('Pedro da Costa', 'pedrao021@gmail.com', '11967546253', '$2b$10$YNBDN1GXJFYAP1QJqJrrL.XkEICzVfYVCQC7d8j.e/1sabmI9CtIu');

INSERT INTO paciente (name, email, phone, pwd) VALUES
('Max Maya', 'maxm030@gmail.com', '11972635273', '$2b$10$pCXS9AEbSOrHCfBukalsZ.piyhilp9q7VfAVpB5I65NFutuWVe62.');
