import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRotinas }   from "../../common/service/useRotinas";
import "./PaginaInicial.css";

export default function PaginaInicial() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const clienteId = user.id_clientes;

  // hook de rotinas
  const {
    rotinas, fetchRotinas,
    criarRotina, atualizarRotina, deletarRotina,
    loading, error
  } = useRotinas();

  // estado para controlar modal de rotina
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [titulo, setTitulo]       = useState("");
  const [dataHora, setDataHora]   = useState("");
  const [recorrencia, setRecorrencia] = useState("Nenhuma");

  // ao montar, busca as rotinas do usuário
  useEffect(() => {
    if (!clienteId) navigate("/login");
    else fetchRotinas(clienteId);
  }, [clienteId, fetchRotinas]);

  const abrirModal = (idx=null) => {
    if (idx!==null) {
      const r = rotinas[idx];
      setTitulo(r.titulo);
      setDataHora(r.data_hora);
      setRecorrencia(r.recorrencia);
    } else {
      setTitulo(""); setDataHora(""); setRecorrencia("Nenhuma");
    }
    setEdit(idx);
    setOpen(true);
  };

  const fecharModal = () => {
    setOpen(false); setEdit(null);
  };

  const handleSalvar = async () => {
    const obj = { titulo, data_hora: dataHora, recorrencia };
    if (edit!==null) {
      await atualizarRotina(clienteId, rotinas[edit].id_rotina, obj);
    } else {
      await criarRotina(clienteId, obj);
    }
    fecharModal();
  };

  const handleExcluir = async () => {
    if (edit!==null) {
      await deletarRotina(clienteId, rotinas[edit].id_rotina);
      fecharModal();
    }
  };

  return (
      
      <div className="pagina-inicial">
      <h1>Minhas Rotinas</h1>
      <button onClick={() => abrirModal(null)}>+ Nova Rotina</button>
      {loading && <p>Carregando...</p>}
      {error   && <p className="erro">{error}</p>}

      <div className="rotinas-grid">
        {rotinas.map((r,i) => (
          <div className="rotina-card" key={r.id_rotina}>
            <h3>{r.titulo}</h3>
            <time>{new Date(r.data_hora).toLocaleString()}</time>
            <p>Recorrência: {r.recorrencia}</p>
            <button onClick={() => abrirModal(i)}>✎ Editar</button>
          </div>
        ))}
      </div>

      {open && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <h2>{edit!==null? "Editar Rotina":"Nova Rotina"}</h2>
            <label>Título</label>
            <input value={titulo}       onChange={e => setTitulo(e.target.value)} />
            <label>Data e Hora</label>
            <input type="datetime-local"
                   value={dataHora}
                   onChange={e => setDataHora(e.target.value)} />
            <label>Recorrência</label>
            <select value={recorrencia}
                    onChange={e => setRecorrencia(e.target.value)}>
              <option>Nenhuma</option>
              <option>Diária</option>
              <option>Semanal</option>
              <option>Mensal</option>
            </select>
            <div className="modal-botoes">
              <button onClick={handleSalvar}>
                {edit!==null? "Atualizar":"Criar"}
              </button>
              {edit!==null && (
                <button className="btn-excluir" onClick={handleExcluir}>
                  Excluir
                </button>
              )}
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
