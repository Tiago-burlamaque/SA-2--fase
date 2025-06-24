CREATE DATABASE crud_cliente_demo;
USE crud_cliente_demo;

CREATE TABLE clientes (
id_clientes INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR (75),
email VARCHAR (100),
senha VARCHAR (100),
endereco VARCHAR (100),
telefone BIGINT
);