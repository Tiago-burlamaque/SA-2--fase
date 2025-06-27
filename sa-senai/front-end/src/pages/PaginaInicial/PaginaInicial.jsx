// src/pages/PaginaInicial/PaginaInicial.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useClientes } from "../../common/service/useClientes";
import { useRotinas } from "../../common/service/useRotinas";

import AvatarManager from "../../common/components/avatar/AvatarManager";
import "./PaginaInicial.css";

export default function PaginaInicial() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useContext(AuthContext);
  if (!user) return null;
  const clienteId = user.id_clientes;

 // callback que o AvatarManager vai chamar
 const handleAvatarUpdate = async (patch) => {
   // 1) atualiza imediatamente o avatar no contexto
   updateUser(patch);

   // 2) busca o cliente completo (contendo nome, e-mail, etc)
   const full = await buscarClientePorId(clienteId);

   // 3) mescla o objeto completo no contexto
   updateUser(full);
 };

  // Hooks de cliente
  const {
    inputNome, inputEmail, inputSenha, inputEndereco, inputTelefone,
    setInputNome, setInputEmail, setInputSenha, setInputEndereco, setInputTelefone,
    buscarClientePorId, salvarCliente, deletarCliente, limparForm
  } = useClientes();

  // Hooks de rotinas
  const {
    rotinas, loading: loadingRotinas, error: errorRotinas,
    fetchRotinas, criarRotina, atualizarRotina, deletarRotina
  } = useRotinas();

  // Modais
  const [modalContaOpen,  setModalContaOpen]  = useState(false);
  const [modalRotinaOpen, setModalRotinaOpen] = useState(false);

  // Form Rotina
  const [editIndex, setEditIndex] = useState(null);
  const [titulo,    setTitulo]    = useState("");
  const [dataHora,  setDataHora]  = useState("");
  const [recorrencia, setRecorrencia] = useState("Nenhuma");

  // Busca rotinas ao montar
  useEffect(() => {
    if (!clienteId) return navigate("/login");
    fetchRotinas(clienteId);
  }, [clienteId, fetchRotinas, navigate]);

  // Carrega dados do cliente no modal de conta
  useEffect(() => {
    if (modalContaOpen) {
      buscarClientePorId(clienteId).catch(() => {
        logout();
        navigate("/login");
      });
    }
  }, [modalContaOpen, clienteId, buscarClientePorId, logout, navigate]);

  // Helpers Rotina
  const openRotinaModal = (idx = null) => {
    if (idx !== null) {
      const r = rotinas[idx];
      setTitulo(r.titulo);
      setDataHora(r.data_hora);
      setRecorrencia(r.recorrencia);
    } else {
      setTitulo("");
      setDataHora("");
      setRecorrencia("Nenhuma");
    }
    setEditIndex(idx);
    setModalRotinaOpen(true);
  };
  const closeRotinaModal = () => {
    setModalRotinaOpen(false);
    setEditIndex(null);
  };
  const handleSaveRotina = async () => {
    const payload = { titulo, data_hora: dataHora, recorrencia };
    if (editIndex !== null) {
      await atualizarRotina(clienteId, rotinas[editIndex].id_rotina, payload);
    } else {
      await criarRotina(clienteId, payload);
    }
    closeRotinaModal();
  };
  const handleDeleteRotina = async () => {
    if (editIndex !== null) {
      await deletarRotina(clienteId, rotinas[editIndex].id_rotina);
      closeRotinaModal();
    }
  };

  // Salvar Conta
  async function handleSaveConta() {
    try {
      // retorna o objeto atualizado (com nome, avatar_url, etc.)
      const usuarioAtualizado = await salvarCliente();
  
      // dispara o merge no contexto + storage
      updateUser(usuarioAtualizado);
  
      // fecha o modal
      setModalContaOpen(false);
    } catch (err) {
      console.error("Erro ao salvar conta:", err);
    }
  }

  const handleDeleteConta = async () => {
    await deletarCliente(clienteId);
    limparForm();
    logout();
    navigate("/login");
  };
  const handleCancelConta = () => {
    limparForm();
    setModalContaOpen(false);
  };

  return (
    <div className="pagina-inicial">
      <h1>Bem-vindo ao seu painel</h1>

      <header className="header-perfil">
        <AvatarManager
          userId={clienteId}
          initialUrl={user.avatar_url}
          userName={user.nome}
         onUpdate={handleAvatarUpdate}
        />
       <span>Olá, {user.nome.split(" ")[0]}</span>
      </header>

      <div className="acoes">
        <button onClick={() => setModalContaOpen(true)}>
          Editar / Excluir Conta
        </button>
        <button onClick={() => openRotinaModal()}>
          + Nova Rotina
        </button>
      </div>

      <div className="rotinas-grid">
        {loadingRotinas && <p>Carregando rotinas...</p>}
        {errorRotinas && <p className="erro">{errorRotinas}</p>}
        {!loadingRotinas && rotinas.length === 0 && (
          <p>Você não tem rotinas ainda.</p>
        )}
        {rotinas.map((r, i) => (
          <div className="rotina-card" key={r.id_rotina}>
            <h3>{r.titulo}</h3>
            <time>{new Date(r.data_hora).toLocaleString()}</time>
            <p>Recorrência: {r.recorrencia}</p>
            <button onClick={() => openRotinaModal(i)}>✎ Editar</button>
          </div>
        ))}
      </div>

      {/* Modal Conta */}
      {modalContaOpen && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <h2>Editar Conta</h2>
            <label>Nome</label>
            <input
              value={inputNome}
              onChange={(e) => setInputNome(e.target.value)}
            />
            <label>E-mail</label>
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
            />
            <label>Senha</label>
            <input
              type="password"
              value={inputSenha}
              onChange={(e) => setInputSenha(e.target.value)}
            />
            <label>Endereço</label>
            <input
              value={inputEndereco}
              onChange={(e) => setInputEndereco(e.target.value)}
            />
            <label>Telefone</label>
            <input
              value={inputTelefone}
              onChange={(e) => setInputTelefone(e.target.value)}
            />
            <div className="modal-botoes">
              <button onClick={handleSaveConta}>Salvar</button>
              <button onClick={handleDeleteConta}>Excluir Conta</button>
              <button onClick={handleCancelConta}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rotina */}
      {modalRotinaOpen && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <h2>{editIndex !== null ? "Editar Rotina" : "Nova Rotina"}</h2>
            <label>Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            <label>Data e Hora</label>
            <input
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
            />
            <label>Recorrência</label>
            <select
              value={recorrencia}
              onChange={(e) => setRecorrencia(e.target.value)}
            >
              <option>Nenhuma</option>
              <option>Diária</option>
              <option>Semanal</option>
              <option>Mensal</option>
            </select>
            <div className="modal-botoes">
              <button onClick={handleSaveRotina}>
                {editIndex !== null ? "Atualizar" : "Criar"}
              </button>
              {editIndex !== null && (
                <button onClick={handleDeleteRotina} className="btn-excluir">
                  Excluir Rotina
                </button>
              )}
              <button onClick={closeRotinaModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
