const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Altere para o nome do seu user no MySQL
    password: 'senai',    // Altere para a senha correta
    database: 'crud_cliente_demo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(cors());
app.use(express.json());

app.get('/clientes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

app.get('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE id_clientes = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
});

// Endpoint para cadastrar um novo cliente (completo: nome, endereco, email, telefone, senha)
app.post('/clientes', async (req, res) => {
    const { nome, endereco, email, telefone, senha } = req.body;
  
    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!nome || !endereco || !email || !telefone || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios!" });
    }
  
    try {
      // Verifica se o e-mail já existe no banco de dados
      const [results] = await pool.query(
        "SELECT COUNT(*) AS count FROM clientes WHERE email = ?",
        [email]
      );
  
      if (results[0].count > 0) {
        return res.status(400).json({ error: "Já existe um cliente cadastrado com este e-mail!" });
      }
  
      // Se o e-mail não existe, realiza a inserção do novo cliente
      const [result] = await pool.query(
        "INSERT INTO clientes (nome, endereco, email, telefone, senha) VALUES (?, ?, ?, ?, ?)",
        [nome, endereco, email, telefone, senha]
      );
  
      // Busca o cliente recém-cadastrado para retornar os dados
      const [novoCliente] = await pool.query(
        "SELECT * FROM clientes WHERE id_clientes = ?",
        [result.insertId]
      );
  
      res.status(201).json(novoCliente[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Erro ao adicionar cliente" });
    }
  });
  

app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, endereco, email, telefone, senha } = req.body;
    try {
        const [result] = await pool.query(
    'UPDATE clientes SET nome = ?, endereco = ?, email = ?, telefone = ?, senha = ? WHERE id_clientes = ?',
    [nome, endereco, email, telefone, senha, id]
    );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        const [clienteAtualizado] = await pool.query('SELECT * FROM clientes WHERE id_clientes = ?', [id]);
        res.json(clienteAtualizado[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
});

app.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM clientes WHERE id_clientes = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json({ message: 'Cliente deletado com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const [rows] = await pool.query(
     'SELECT * FROM clientes WHERE email = ? AND senha = ?',
      [email, senha] ); 
      if (rows.length === 0) return res.status(401).json({ sucesso: false }); 
      res.json({ sucesso: true, cliente: rows[0] }); 
    });

// rota GET todas as rotinas de um cliente
app.get('/clientes/:id/rotinas', async (req, res) => {
  const rotinas = await db('rotinas').where({ cliente_id: req.params.id });
  res.json(rotinas);
});

// rota POST para criar uma rotina
app.post('/rotinas', async (req, res) => {
  const { cliente_id, titulo, data_hora, recorrencia } = req.body;
  const [id] = await db('rotinas').insert({ cliente_id, titulo, data_hora, recorrencia });
  res.status(201).json({ id, cliente_id, titulo, data_hora, recorrencia });
});

// rota PUT para atualizar
app.put('/rotinas/:id', async (req, res) => {
  const { titulo, data_hora, recorrencia } = req.body;
  await db('rotinas').where({ id_rotina: req.params.id })
    .update({ titulo, data_hora, recorrencia });
  res.sendStatus(204);
});

// rota DELETE
app.delete('/rotinas/:id', async (req, res) => {
  await db('rotinas').where({ id_rotina: req.params.id }).del();
  res.sendStatus(204);
});




const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

