import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ClientesContext = createContext();

export const ClientesProvider = ({ children }) => {
  
  // Estados que gerenciam dados e formulários
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [inputNome, setInputNome] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputEndereco, setInputEndereco] = useState('');
  const [inputTelefone, setInputTelefone] = useState('');

  // Busca os clientes no backend
  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  // Executa a busca de clientes quando o componente monta
  useEffect(() => {
    fetchClientes();
  }, []);

  // Função para cadastrar um novo cliente
  const cadastrarCliente = async () => {
    try {
      const cliente = {
        nome: inputNome,
        endereco: inputEndereco,
        email: inputEmail,
        telefone: inputTelefone,
      };
      const response = await axios.post('http://localhost:3000/clientes', cliente);
      if (response.status === 201) {
        fetchClientes();
        limparForm();
      }
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
    }
  };

  // Função para salvar/atualizar um cliente existente
  const salvarCliente = async () => {
    try {
      const cliente = {
        nome: inputNome,
        endereco: inputEndereco,
        email: inputEmail,
        telefone: inputTelefone,
      };
      const response = await axios.put(`http://localhost:3000/clientes/${clienteSelecionado.id}`, cliente);
      if (response.status === 200) {
        fetchClientes();
        setClienteSelecionado(null);
        limparForm();
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  // Função para buscar um cliente pelo ID e popular os inputs do formulário
  const buscarClientePorId = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/clientes/${id}`);
      setClienteSelecionado(response.data);
      exibirCliente(response.data);
    } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error);
    }
  };

  // Função para deletar um cliente
  const deletarCliente = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/clientes/${id}`);
      if (response.status === 200) {
        fetchClientes();
      }
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  // Função para limpar os campos do formulário
  const limparForm = () => {
    setInputNome('');
    setInputEmail('');
    setInputEndereco('');
    setInputTelefone('');
  };

  // Função que popula os inputs com os dados do cliente selecionado
  const exibirCliente = (cliente) => {
    setInputNome(cliente.nome || '');
    setInputEmail(cliente.email || '');
    setInputEndereco(cliente.endereco || '');
    setInputTelefone(cliente.telefone || '');
  };

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        clienteSelecionado,
        inputNome,
        inputEmail,
        inputEndereco,
        inputTelefone,
        setInputNome,
        setInputEmail,
        setInputEndereco,
        setInputTelefone,
        fetchClientes,
        cadastrarCliente,
        salvarCliente,
        buscarClientePorId,
        deletarCliente,
        limparForm,
        exibirCliente,
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};
