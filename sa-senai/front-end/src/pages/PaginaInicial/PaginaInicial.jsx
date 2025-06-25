// src/pages/PaginaInicial.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useClientes } from "../../common/service/useClientes"; 
import "./PaginaInicial.css";

export default function PaginaInicial() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const clienteId = user?.id_clientes;

  // — estados para editar conta —
  const [modalContaOpen, setModalContaOpen] = useState(false);

  // — estados para rotinas —
  const [modalRotinaOpen, setModalRotinaOpen] = useState(false);
  const [rotinas, setRotinas] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // — campos do formulário de rotina —
  const [titulo, setTitulo] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [recorrencia, setRecorrencia] = useState("Nenhuma");

  // — hook de cliente (sua lógica já existente) —
  const {
    inputNome, inputEmail, inputSenha, inputEndereco, inputTelefone,
    setInputNome, setInputEmail, setInputSenha, setInputEndereco, setInputTelefone,
    buscarClientePorId, salvarCliente, deletarCliente, limparForm
  } = useClientes();

  // — carregar dados de conta —
  useEffect(() => {
    if (modalContaOpen && clienteId) {
      buscarClientePorId(clienteId)
        .then(c => {
          if (!c) { logout(); navigate("/login"); return; }
          setInputNome(c.nome); setInputEmail(c.email);
          setInputSenha(c.senha); setInputEndereco(c.endereco);
          setInputTelefone(c.telefone);
        })
        .catch(() => { logout(); navigate("/login"); });
    }
  }, [modalContaOpen]);

  // — abrir modal de rotina para criar ou editar —
  const abrirModalRotina = (idx = null) => {
    if (idx !== null) {
      const r = rotinas[idx];
      setTitulo(r.titulo);
      setDataHora(r.dataHora);
      setRecorrencia(r.recorrencia);
    } else {
      setTitulo("");
      setDataHora("");
      setRecorrencia("Nenhuma");
    }
    setEditIndex(idx);
    setModalRotinaOpen(true);
  };

  // — salvar rotina (create / update) —
  const salvarRotina = () => {
    const nova = { titulo, dataHora, recorrencia };
    setRotinas(prev => {
      if (editIndex !== null) {
        // substitui
        const arr = [...prev];
        arr[editIndex] = nova;
        return arr;
      }
      // adiciona
      return [...prev, nova];
    });
    fecharModalRotina();
  };

  const excluirRotina = () => {
    if (editIndex === null) return;
    setRotinas(prev => prev.filter((_, i) => i !== editIndex));
    fecharModalRotina();
  };

  const fecharModalRotina = () => {
    setModalRotinaOpen(false);
    setEditIndex(null);
    setTitulo(""); setDataHora(""); setRecorrencia("Nenhuma");
  };

  // — conta: salvar, deletar, cancelar —
  const handleSaveConta = async () => { await salvarCliente(); setModalContaOpen(false); };
  const handleDeleteConta = async () => {
    await deletarCliente(clienteId);
    limparForm();
    logout();
    navigate("/login");
  };
  const handleCancelConta = () => { limparForm(); setModalContaOpen(false); };

  return (
    <div className="pagina-inicial">
      <h1>Bem-vindo ao seu painel</h1>
      <button onClick={() => setModalContaOpen(true)}>Editar / Excluir Conta</button>
      <button onClick={() => abrirModalRotina()}>+ Nova Rotina</button>

 {/* grid de rotinas */}
<div className="rotinas-grid">
  {rotinas.length === 0 && <p>Você não tem rotinas ainda.</p>}
  {rotinas.map((r, i) => (
    <div className="rotina-card" key={i}>
      <h3>{r.titulo}</h3>
      <time>
        {new Date(r.dataHora).toLocaleDateString()} –{" "}
        {new Date(r.dataHora).toLocaleTimeString()}
      </time>
      <p>Recorrência: {r.recorrencia}</p>
      <button
        className="btn-editar"
        onClick={() => abrirModalRotina(i)}
      >
        ✎ Editar
      </button>
    </div>
  ))}
</div>


      {/* modal de conta */}
      {modalContaOpen && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <h2>Editar Conta</h2>
            <label>Nome</label>
            <input value={inputNome} onChange={e => setInputNome(e.target.value)} />
            <label>E-mail</label>
            <input type="email" value={inputEmail} onChange={e => setInputEmail(e.target.value)} />
            <label>Senha</label>
            <input type="password" value={inputSenha} onChange={e => setInputSenha(e.target.value)} />
            <label>Endereço</label>
            <input value={inputEndereco} onChange={e => setInputEndereco(e.target.value)} />
            <label>Telefone</label>
            <input value={inputTelefone} onChange={e => setInputTelefone(e.target.value)} />
            <div className="modal-botoes">
              <button onClick={handleSaveConta}>Salvar</button>
              <button onClick={handleDeleteConta}>Excluir Conta</button>
              <button onClick={handleCancelConta}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* modal de criação/edição de rotina */}
      {modalRotinaOpen && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <h2>{editIndex !== null ? "Editar Rotina" : "Nova Rotina"}</h2>

            <label>Título</label>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
            />

            <label>Data e Hora</label>
            <input
              type="datetime-local"
              value={dataHora}
              onChange={e => setDataHora(e.target.value)}
            />

            <label>Recorrência</label>
            <select
              value={recorrencia}
              onChange={e => setRecorrencia(e.target.value)}
            >
              <option>Nenhuma</option>
              <option>Diária</option>
              <option>Semanal</option>
              <option>Mensal</option>
            </select>

            <div className="modal-botoes">
              <button onClick={salvarRotina}>
                {editIndex !== null ? "Atualizar" : "Criar"}
              </button>
              {editIndex !== null && (
                <button onClick={excluirRotina} className="btn-excluir">
                  Excluir Rotina
                </button>
              )}
              <button onClick={fecharModalRotina}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
