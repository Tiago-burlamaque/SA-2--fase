// src/pages/PaginaInicial/PaginaInicial.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useClientes } from "../../common/service/useClientes";
import { useRotinas }  from "../../common/service/useRotinas";
import AvatarManager   from "../../common/components/avatar/AvatarManager";
import "./PaginaInicial.css";

export default function PaginaInicial() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useContext(AuthContext);

  // Se não estiver logado, redireciona
  if (!user) return <Navigate to="/login" replace />;

  const clienteId = user.id_clientes;

  // hooks de cliente (conta)
  const {
    inputNome, inputEmail, inputSenha,
    inputEndereco, inputTelefone,
    setInputNome, setInputEmail, setInputSenha,
    setInputEndereco, setInputTelefone,
    buscarClientePorId, salvarCliente,
    deletarCliente, limparForm
  } = useClientes();

  // hooks de rotinas
  const {
    rotinas,
    loading: loadingRotinas,
    error: errorRotinas,
    fetchRotinas,
    criarRotina,
    atualizarRotina,
    deletarRotina
  } = useRotinas();

  // estados de modais
  const [isContaModalOpen, setContaModalOpen] = useState(false);
  const [isRotinaModalOpen, setRotinaModalOpen] = useState(false);

  // estado de formulário de rotina
  const [editRotinaIndex, setEditRotinaIndex] = useState(null);
  const [titulo, setTitulo]         = useState("");
  const [dataHora, setDataHora]     = useState("");
  const [recorrencia, setRecorrencia] = useState("Nenhuma");

  // busca rotinas ao montar
  useEffect(() => {
    fetchRotinas(clienteId);
  }, [clienteId, fetchRotinas]);

  // carrega dados do cliente ao abrir modal de conta
  useEffect(() => {
    if (isContaModalOpen) {
      buscarClientePorId(clienteId).catch(() => {
        logout();
        navigate("/login");
      });
    }
  }, [isContaModalOpen, clienteId, buscarClientePorId, logout, navigate]);

  // abre modal de rotina (criar ou editar)
  function openRotinaModal(idx = null) {
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
    setEditRotinaIndex(idx);
    setRotinaModalOpen(true);
  }

  // fecha modal de rotina
  function closeRotinaModal() {
    setRotinaModalOpen(false);
    setEditRotinaIndex(null);
  }

  // cria ou atualiza rotina
  async function handleSaveRotina() {
    const payload = { titulo, data_hora: dataHora, recorrencia };
    if (editRotinaIndex !== null) {
      await atualizarRotina(
        clienteId,
        rotinas[editRotinaIndex].id_rotina,
        payload
      );
    } else {
      await criarRotina(clienteId, payload);
    }
    closeRotinaModal();
  }

  // exclui rotina
  async function handleDeleteRotina() {
    if (editRotinaIndex !== null) {
      await deletarRotina(
        clienteId,
        rotinas[editRotinaIndex].id_rotina
      );
      closeRotinaModal();
    }
  }

  // conta: salvar, excluir, cancelar
  async function handleSaveConta() {
    await salvarCliente();
    setContaModalOpen(false);
  }

  async function handleDeleteConta() {
    await deletarCliente(clienteId);
    limparForm();
    logout();
    navigate("/login");
  }

  function handleCancelConta() {
    limparForm();
    setContaModalOpen(false);
  }

  return (
    <div className="pagina-inicial">
      {/* CABEÇALHO */}
      <header className="header-perfil">
        <AvatarManager
          userId={user.id_clientes}
          initialUrl={user.avatar_url}
          userName={user.nome}
          onUpdate={(patch) => updateUser(patch)}
        />
        <div className="perfil-info">
          <span>Olá, {user.nome.split(" ")[0]}!</span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>

      {/* AÇÕES */}
      <div className="acoes">
        <button onClick={() => setContaModalOpen(true)}>
          Editar / Excluir Conta
        </button>
        <button onClick={() => openRotinaModal()}>
          + Nova Rotina
        </button>
      </div>

      {/* GRID DE ROTINAS */}
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

      {/* MODAL DE CONTA */}
      {isContaModalOpen && (
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

      {/* MODAL DE ROTINA */}
      {isRotinaModalOpen && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <h2>
              {editRotinaIndex !== null ? "Editar Rotina" : "Nova Rotina"}
            </h2>
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
                {editRotinaIndex !== null ? "Atualizar" : "Criar"}
              </button>
              {editRotinaIndex !== null && (
                <button
                  onClick={handleDeleteRotina}
                  className="btn-excluir"
                >
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
