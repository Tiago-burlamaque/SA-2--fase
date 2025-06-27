// src/common/service/useClientes.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// instância axios com baseURL (ideal usar variável de ambiente)
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001' });

export function useClientes() {
  // —— estados de dados ——
  const [clientes, setClientes]               = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  // —— estados de formulário ——
  const [inputNome, setInputNome]         = useState('');
  const [inputCpf, setInputCpf]           = useState('');
  const [inputEmail, setInputEmail]       = useState('');
  const [inputSenha, setInputSenha]       = useState('');
  const [inputEndereco, setInputEndereco] = useState('');
  const [inputTelefone, setInputTelefone] = useState('');

  // —— flags de controle ——
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // —— limpa o form ——
  const limparForm = useCallback(() => {
    setInputNome('');
    setInputCpf('');
    setInputEmail('');
    setInputSenha('');
    setInputEndereco('');
    setInputTelefone('');
  }, []);

  // —— preenche o form a partir de um cliente ——
  const exibirCliente = useCallback((c) => {
    setClienteSelecionado(c);
    setInputNome(c.nome    || '');
    setInputCpf(c.cpf       || '');
    setInputEmail(c.email   || '');
    setInputSenha('');                // não expor senha existente
    setInputEndereco(c.endereco|| '');
    setInputTelefone(c.telefone|| '');
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
      setError('Não foi possível carregar os clientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  // —— BUSCAR CLIENTE POR ID ——  
  const buscarClientePorId = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/clientes/${id}`);
      exibirCliente(data);
      return data;
    } catch (err) {
      console.error('Erro ao buscar cliente:', err);
      setError('Cliente não encontrado.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [exibirCliente]);

  // —— UPLOAD DO AVATAR ——  
  const uploadAvatar = useCallback(async (clienteId, file) => {
    const form = new FormData();
    form.append('avatar', file);
    const { data } = await api.post(
      `/clientes/${clienteId}/avatar`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    // retorna a URL do avatar salva no servidor
    return data.avatarUrl || data.avatar_url;
  }, []);

  // —— CADASTRAR CLIENTE ——  
  const cadastrarCliente = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        nome: inputNome, cpf: inputCpf,
        endereco: inputEndereco,
        email: inputEmail,
        telefone: inputTelefone,
        senha: inputSenha,
      };
      const { data } = await api.post('/clientes', payload);
      await fetchClientes();
      limparForm();
      return data;
    } catch (err) {
      console.error('Erro ao cadastrar cliente:', err);
      setError(err.response?.data?.error || 'Falha ao cadastrar cliente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [
    inputNome, inputCpf, inputEndereco,
    inputEmail, inputTelefone, inputSenha,
    fetchClientes, limparForm
  ]);

  // —— SALVAR (ATUALIZAR) CLIENTE ——  
// src/common/service/useClientes.js
const salvarCliente = useCallback(async () => {
  if (!clienteSelecionado) {
    setError('Nenhum cliente selecionado.');
    return null;
  }
  setLoading(true);
  setError(null);

  try {
    // 1️⃣ faz o PUT
    await api.put(
      `/clientes/${clienteSelecionado.id_clientes}`,
      {
        nome: inputNome,
        cpf: inputCpf,
        email: inputEmail,
        senha: inputSenha || undefined,
        endereco: inputEndereco,
        telefone: inputTelefone,
      }
    );

    // 2️⃣ re-busca o cliente completo do backend
    const { data: atualizado } = await api.get(
      `/clientes/${clienteSelecionado.id_clientes}`
    );

    // 3️⃣ atualiza o form e o cliente selecionado
    exibirCliente(atualizado);

    // 4️⃣ retorna o objeto inteiro
    return atualizado;
  } catch (err) {
    console.error('Erro ao salvar cliente:', err);
    setError(err.response?.data?.error || 'Falha ao atualizar o cliente.');
    throw err;
  } finally {
    setLoading(false);
  }
}, [
  clienteSelecionado,
  inputNome, inputCpf, inputEmail, inputSenha,
  inputEndereco, inputTelefone,
  exibirCliente
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

  // dispara o fetch ao montar
  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  return {
    // dados
    clientes,
    clienteSelecionado,

    // inputs e setters
    inputNome, inputCpf, inputEmail, inputSenha,
    inputEndereco, inputTelefone,
    setInputNome, setInputCpf, setInputEmail, setInputSenha,
    setInputEndereco, setInputTelefone,

    // flags
    loading, error,

    // actions
    fetchClientes,
    buscarClientePorId,
    cadastrarCliente,
    salvarCliente,
    deletarCliente,
    loginCliente,
    limparForm,
    uploadAvatar      // exposto para uso em AvatarManager, se desejar
  };
}
