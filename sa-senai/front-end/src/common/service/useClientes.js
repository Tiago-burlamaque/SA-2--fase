// src/commom/service/useClientes.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useClientes() {
  // ——— Estados de cliente/crud ———
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [inputNome, setInputNome] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputSenha, setInputSenha] = useState('');
  const [inputEndereco, setInputEndereco] = useState('');
  const [inputTelefone, setInputTelefone] = useState('');

  useEffect(() => { fetchClientes() }, []);

  const fetchClientes = async () => {
    try {
      const { data } = await axios.get('http://localhost:3001/clientes');
      setClientes(data);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    }
  };

  const cadastrarCliente = async () => {
    await axios.post('http://localhost:3001/clientes', {
      nome: inputNome,
      email: inputEmail,
      senha: inputSenha,
      endereco: inputEndereco,
      telefone: inputTelefone,
    });
    fetchClientes();
    limparForm();
  };

  const salvarCliente = async () => {
    if (!clienteSelecionado) return;
    await axios.put(
      `http://localhost:3001/clientes/${clienteSelecionado.id_clientes}`, 
      { nome: inputNome, email: inputEmail, senha: inputSenha,
        endereco: inputEndereco, telefone: inputTelefone }
    );
    fetchClientes();
    setClienteSelecionado(null);
    limparForm();
  };

  const buscarClientePorId = async (id) => {
    const { data } = await axios.get(`http://localhost:3001/clientes/${id}`);
    setClienteSelecionado(data);
    exibirCliente(data);
  };

 const deletarCliente = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/clientes/${id}`);
      if (response.status === 200) {
        fetchClientes();
      }
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  // ——— Novo: login ———
  const loginCliente = async () => {
    if (!inputEmail || !inputSenha) {
      throw new Error('Preencha e-mail e senha');
    }
    // precisa existir rota POST /login no seu server.js
    const { data } = await axios.post('http://localhost:3001/login', {
      email: inputEmail,
      senha: inputSenha,
    });
    return data; // { sucesso: true, cliente: {...} } ou { sucesso: false }
  };

  const limparForm = () => {
    setInputNome('');
    setInputEmail('');
    setInputSenha('');
    setInputEndereco('');
    setInputTelefone('');
  };

  const exibirCliente = (c) => {
    setInputNome(c.nome || '');
    setInputEmail(c.email || '');
    setInputSenha(c.senha || '');
    setInputEndereco(c.endereco || '');
    setInputTelefone(c.telefone || '');
  };

  return {
    // estados
    clientes, clienteSelecionado,
    inputNome, inputEmail, inputSenha, inputEndereco, inputTelefone,
    // setters
    setInputNome, setInputEmail, setInputSenha,
    setInputEndereco, setInputTelefone,
    // ações
    fetchClientes, cadastrarCliente, salvarCliente,
    buscarClientePorId, deletarCliente, loginCliente,
    limparForm,
  };
}
