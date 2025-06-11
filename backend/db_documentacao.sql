DROP DATABASE IF EXISTS nutricare_db;
CREATE DATABASE nutricare_db;
USE nutricare_db;

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
    id_nutricionista INT NOT NULL,
    FOREIGN KEY (id_nutricionista) REFERENCES nutricionista(id) ON DELETE CASCADE
);

CREATE TABLE planoalimentar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT,
    data_inicio DATE,
    data_fim DATE,
    objetivo VARCHAR(255),
    FOREIGN KEY (id_paciente) REFERENCES paciente(id)
);

CREATE TABLE refeicao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_plano_alimentar INT,
    tipo VARCHAR(50),
    horario_sugerido TIME,
    FOREIGN KEY (id_plano_alimentar) REFERENCES planoalimentar(id)
);

CREATE TABLE alimento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    tipo VARCHAR(50),
    calorias_por_100g DECIMAL(6,2)
);

CREATE TABLE composicaorefeicao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_refeicao INT,
    id_alimento INT,
    quantidade DECIMAL(6,2),
    unidade VARCHAR(20),
    FOREIGN KEY (id_refeicao) REFERENCES refeicao(id),
    FOREIGN KEY (id_alimento) REFERENCES alimento(id)
);

CREATE TABLE avaliacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT,
    data_avaliacao DATE,
    peso DECIMAL(5,2),
    altura DECIMAL(4,2),
    circunferencia DECIMAL(5,2),
    observacoes TEXT,
    FOREIGN KEY (id_paciente) REFERENCES paciente(id)
);


INSERT INTO nutricionista (name, crm, email, phone, pwd) VALUES
('Dr. Teste Nutri', '321654988', 'teste@nutri.com', '123456891', 'teste');

INSERT INTO paciente (name, email, phone, pwd) VALUES
('Teste Paciente', 'teste@paciente.com', '123456890', 'teste');
