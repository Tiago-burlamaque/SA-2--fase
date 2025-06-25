CREATE DATABASE crud_cliente_demo;
USE crud_cliente_demo;

CREATE TABLE clientes (
id_clientes INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR (75),
cpf BIGINT UNIQUE,
email VARCHAR (100),
senha VARCHAR (100),
endereco VARCHAR (100),
telefone BIGINT
);

CREATE TABLE rotinas (
  id_rotina     INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id    INT NOT NULL,
  titulo        VARCHAR(255) NOT NULL,
  data_hora     DATETIME NOT NULL,
  recorrencia   ENUM('Nenhuma','Diária','Semanal','Mensal') 
                  DEFAULT 'Nenhuma',
  FOREIGN KEY (cliente_id) REFERENCES clientes(id_clientes)
);
