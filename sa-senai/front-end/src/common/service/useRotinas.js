// src/common/service/useRotinas.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001' });

export function useRotinas() {
  const [rotinas, setRotinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchRotinas = useCallback(async (clienteId) => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.get(`/clientes/${clienteId}/rotinas`);
      setRotinas(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar rotinas.');
    } finally {
      setLoading(false);
    }
  }, []);

  const criarRotina = useCallback(async (clienteId, rotina) => {
    setLoading(true); setError(null);
    try {
      await api.post('/rotinas', { cliente_id: clienteId, ...rotina });
      await fetchRotinas(clienteId);
    } catch (err) {
      console.error(err);
      setError('Falha ao criar rotina.');
    } finally {
      setLoading(false);
    }
  }, [fetchRotinas]);

  const atualizarRotina = useCallback(async (clienteId, id, rotina) => {
    setLoading(true); setError(null);
    try {
      await api.put(`/rotinas/${id}`, rotina);
      await fetchRotinas(clienteId);
    } catch (err) {
      console.error(err);
      setError('Falha ao atualizar rotina.');
    } finally {
      setLoading(false);
    }
  }, [fetchRotinas]);

  const deletarRotina = useCallback(async (clienteId, id) => {
    setLoading(true); setError(null);
    try {
      await api.delete(`/rotinas/${id}`);
      await fetchRotinas(clienteId);
    } catch (err) {
      console.error(err);
      setError('Falha ao deletar rotina.');
    } finally {
      setLoading(false);
    }
  }, [fetchRotinas]);

  return {
    rotinas, loading, error,
    fetchRotinas, criarRotina,
    atualizarRotina, deletarRotina
  };
}
