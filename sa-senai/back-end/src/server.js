// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// config do pool MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      
  password: 'senai',    
  database: 'crud_cliente_demo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ---------- ROTAS CLIENTES ----------

// GET /clientes — lista todos
app.get('/clientes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// GET /clientes/:id — busca 1
app.get('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM clientes WHERE id_clientes = ?', 
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// POST /clientes — cria novo
app.post('/clientes', async (req, res) => {
  const { nome, cpf, endereco, email, telefone, senha } = req.body;
  if (!nome || !cpf || !endereco || !email || !telefone || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios!' });
  }
  try {
    // checa email único
    const [check] = await pool.query(
      'SELECT COUNT(*) AS cnt FROM clientes WHERE email = ?', 
      [email]
    );
    if (check[0].cnt > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    // insere
    const [result] = await pool.query(
      `INSERT INTO clientes 
       (nome, cpf, endereco, email, telefone, senha)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, cpf, endereco, email, telefone, senha]
    );
    // retorna o novo registro
    const [novo] = await pool.query(
      'SELECT * FROM clientes WHERE id_clientes = ?', 
      [result.insertId]
    );
    res.status(201).json(novo[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar cliente' });
  }
});

// PUT /clientes/:id — atualiza
app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, cpf, endereco, email, telefone, senha } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE clientes 
         SET nome=?, cpf=?, endereco=?, email=?, telefone=?, senha=? 
       WHERE id_clientes=?`,
      [nome, cpf, endereco, email, telefone, senha, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    const [rows] = await pool.query(
      'SELECT * FROM clientes WHERE id_clientes = ?', 
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// DELETE /clientes/:id — remove
app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM clientes WHERE id_clientes = ?', 
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
});

// POST /login — autentica
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM clientes WHERE email = ? AND senha = ?', 
      [email, senha]
    );
    if (rows.length === 0) {
      return res.status(401).json({ sucesso: false });
    }
    res.json({ sucesso: true, cliente: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login' });
  }
});


// GET /clientes/:id/rotinas — todas as rotinas de um cliente
app.get('/clientes/:id/rotinas', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM rotinas WHERE cliente_id = ? ORDER BY data_hora', 
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar rotinas' });
  }
});

// POST /rotinas — cria nova rotina
app.post('/rotinas', async (req, res) => {
  const { cliente_id, titulo, data_hora, recorrencia } = req.body;
  if (!cliente_id || !titulo || !data_hora) {
    return res.status(400).json({ error: 'Faltam campos obrigatórios' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO rotinas 
       (cliente_id, titulo, data_hora, recorrencia)
       VALUES (?, ?, ?, ?)`,
      [cliente_id, titulo, data_hora, recorrencia || 'Nenhuma']
    );
    // retorna a rotina criada
    const [nova] = await pool.query(
      'SELECT * FROM rotinas WHERE id_rotina = ?', 
      [result.insertId]
    );
    res.status(201).json(nova[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar rotina' });
  }
});

// PUT /rotinas/:id — atualiza rotina
app.put('/rotinas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, data_hora, recorrencia } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE rotinas 
         SET titulo = ?, data_hora = ?, recorrencia = ?
       WHERE id_rotina = ?`,
      [titulo, data_hora, recorrencia, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rotina não encontrada' });
    }
    const [rows] = await pool.query(
      'SELECT * FROM rotinas WHERE id_rotina = ?', 
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar rotina' });
  }
});

// DELETE /rotinas/:id — remove rotina
app.delete('/rotinas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM rotinas WHERE id_rotina = ?', 
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rotina não encontrada' });
    }
    res.json({ message: 'Rotina deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar rotina' });
  }
});


// inicializa servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
