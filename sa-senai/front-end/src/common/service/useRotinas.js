// src/common/service/useRotinas.js
import { useState, useCallback } from "react";
import axios from "axios";

// Instância do Axios com baseURL
const api = axios.create({ baseURL: "http://localhost:3001" });

export function useRotinas() {
  // Estados
  const [rotinas, setRotinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // —— BUSCAR TODAS AS ROTINAS DE UM CLIENTE ——  
  const fetchRotinas = useCallback(async (clienteId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/clientes/${clienteId}/rotinas`);
      setRotinas(data);
    } catch (err) {
      console.error("Erro ao buscar rotinas:", err);
      setError("Não foi possível carregar as rotinas.");
    } finally {
      setLoading(false);
    }
  }, []);

  // —— CRIAR NOVA ROTINA ——  
  const criarRotina = useCallback(async (clienteId, rotina) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/rotinas", {
        cliente_id: clienteId,
        titulo: rotina.titulo,
        data_hora: rotina.data_hora,
        recorrencia: rotina.recorrencia || "Nenhuma",
      });
      setRotinas((prev) => [...prev, data]); // Adiciona a nova rotina ao estado
    } catch (err) {
      console.error("Erro ao criar rotina:", err);
      setError("Falha ao criar rotina.");
    } finally {
      setLoading(false);
    }
  }, []);

  // —— ATUALIZAR ROTINA ——  
  const atualizarRotina = useCallback(async (clienteId, id, rotina) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/rotinas/${id}`, {
        titulo: rotina.titulo,
        data_hora: rotina.data_hora,
        recorrencia: rotina.recorrencia,
      });
      await fetchRotinas(clienteId); // Atualiza a lista de rotinas
    } catch (err) {
      console.error("Erro ao atualizar rotina:", err);
      setError("Falha ao atualizar rotina.");
    } finally {
      setLoading(false);
    }
  }, [fetchRotinas]);

  // —— DELETAR ROTINA ——  
  const deletarRotina = useCallback(async (clienteId, id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/rotinas/${id}`);
      setRotinas((prev) => prev.filter((r) => r.id_rotina !== id)); // Remove do estado
    } catch (err) {
      console.error("Erro ao deletar rotina:", err);
      setError("Falha ao deletar rotina.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rotinas,
    loading,
    error,
    fetchRotinas,
    criarRotina,
    atualizarRotina,
    deletarRotina,
  };
}
