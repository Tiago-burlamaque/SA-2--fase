// src/common/service/useClientes.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// cria uma instância axios com a baseURL
const api = axios.create({ baseURL: 'http://localhost:3001' });

export function useClientes() {
  // —— estados de dados ——
  const [clientes, setClientes]               = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  // —— estados de formulário ——
  const [inputNome, setInputNome]             = useState('');
  const [inputCpf, setInputCpf]             = useState('');
  const [inputEmail, setInputEmail]           = useState('');
  const [inputSenha, setInputSenha]           = useState('');
  const [inputEndereco, setInputEndereco]     = useState('');
  const [inputTelefone, setInputTelefone]     = useState('');
  // —— estados de controle ——
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // limpa todos os campos do formulário
  const limparForm = useCallback(() => {
    setInputNome('');
    setInputCpf('');
    setInputEmail('');
    setInputSenha('');
    setInputEndereco('');
    setInputTelefone('');
  }, []);

  // preenche o formulário a partir de um objeto cliente
  const exibirCliente = useCallback((c) => {
    if (!c) return;
    setInputNome(c.nome || '');
    setInputCpf(c.cpf || '');
    setInputEmail(c.email || '');
    setInputSenha(c.senha || '');
    setInputEndereco(c.endereco || '');
    setInputTelefone(c.telefone || '');
  }, []);

  // —— BUSCAR TODOS OS CLIENTES ——  
  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/clientes');
      setClientes(data);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      setError('Não foi possível carregar a lista de clientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  // —— BUSCAR CLIENTE POR ID ——  
  const buscarClientePorId = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get(`/clientes/${id}`);
      if (resp.status === 200 && resp.data) {
        setClienteSelecionado(resp.data);
        exibirCliente(resp.data);
        return resp.data;
      } else {
        setError('Cliente não encontrado.');
        return null;
      }
    } catch (err) {
      console.error('Erro ao buscar cliente:', err);
      setError('Erro na requisição do cliente.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [exibirCliente]);

  // —— CADASTRAR CLIENTE ——  
  const cadastrarCliente = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/clientes', {
        nome: inputNome,
        cpf: inputCpf,
        email: inputEmail,
        senha: inputSenha,
        endereco: inputEndereco,
        telefone: inputTelefone,
      });
      await fetchClientes();
      limparForm();
    } catch (err) {
      console.error('Erro ao cadastrar cliente:', err);
      setError('Falha ao cadastrar o cliente.');
    } finally {
      setLoading(false);
    }
  }, [
    inputNome, inputCpf, inputEmail, inputSenha, inputEndereco, inputTelefone,
    fetchClientes, limparForm
  ]);

  // —— SALVAR (ATUALIZAR) CLIENTE ——  
  const salvarCliente = useCallback(async () => {
    if (!clienteSelecionado) {
      setError('Nenhum cliente selecionado.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.put(`/clientes/${clienteSelecionado.id_clientes}`, {
        nome: inputNome,
        cpf: inputCpf,
        email: inputEmail,
        senha: inputSenha,
        endereco: inputEndereco,
        telefone: inputTelefone,
      });
      await fetchClientes();
      setClienteSelecionado(null);
      limparForm();
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      setError('Falha ao atualizar o cliente.');
    } finally {
      setLoading(false);
    }
  }, [
    clienteSelecionado, inputNome, inputCpf, inputEmail, inputSenha,
    inputEndereco, inputTelefone, fetchClientes, limparForm
  ]);

  // —— DELETAR CLIENTE ——  
  const deletarCliente = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/clientes/${id}`);
      await fetchClientes();
      setClienteSelecionado(null);
      limparForm();
    } catch (err) {
      console.error('Erro ao deletar cliente:', err);
      setError('Não foi possível deletar o cliente.');
    } finally {
      setLoading(false);
    }
  }, [fetchClientes, limparForm]);

  // —— LOGIN ——  
  const loginCliente = useCallback(async () => {
    setError(null);
    if (!inputEmail || !inputSenha) {
      throw new Error('Preencha e-mail e senha');
    }
    try {
      const { data } = await api.post('/login', {
        email: inputEmail,
        senha: inputSenha,
      });
      return data;
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Falha ao autenticar.');
      throw err;
    }
  }, [inputEmail, inputSenha]);

  // dispara o fetch de clientes quando o hook monta
  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  return {
    // dados
    clientes,
    clienteSelecionado,
    // inputs
    inputNome, inputCpf, inputEmail, inputSenha, inputEndereco, inputTelefone,
    // setters
    setInputNome, setInputCpf, setInputEmail, setInputSenha,
    setInputEndereco, setInputTelefone,
    // flags
    loading, error,
    // ações
    fetchClientes,
    buscarClientePorId,
    cadastrarCliente,
    salvarCliente,
    deletarCliente,
    loginCliente,
    limparForm,
  };
}
