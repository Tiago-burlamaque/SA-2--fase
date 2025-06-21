import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useClientes } from "../../common/service/useClientes"; 
import "./PaginaInicial.css";

export default function PaginaInicial() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const clienteId = user?.id_clientes;


  const {
    inputNome,
    inputEmail,
    inputSenha,
    inputEndereco,
    inputTelefone,
    setInputNome,
    setInputEmail,
    setInputSenha,
    setInputEndereco,
    setInputTelefone,
    buscarClientePorId,
    salvarCliente,
    deletarCliente,
    limparForm,
  } = useClientes();

  // Se abrir o modal, busca os dados do cliente logado
  useEffect(() => {
    if (modalOpen && clienteId) {
      if (!user?.id_clientes) return;
  buscarClientePorId(user.id_clientes).catch((err) => {
    console.warn("Cliente não encontrado:", err);
    logout(); // limpa contexto e localStorage
    navigate("/login"); // redireciona pro login
  });
    }
  }, [modalOpen, clienteId, buscarClientePorId, navigate]);

  const handleSave = async () => {
    try {
      await salvarCliente();
      setModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deletarCliente(clienteId);
      limparForm();
      localStorage.removeItem("clienteId");
      localStorage.removeItem("cliente");
      setModalOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  const handleCancel = () => {
    limparForm();
    setModalOpen(false);
  };

  return (
    <div className="pagina-inicial">
      <h1>Bem-vindo ao seu painel</h1>

      <button className="btn-abrir-modal" onClick={() => setModalOpen(true)}>
        Editar / Excluir Conta
      </button>

      {modalOpen && (
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
              <button className="btn-salvar" onClick={handleSave}>
                Salvar
              </button>
              <button className="btn-excluir" onClick={handleDelete}>
                Excluir Conta
              </button>
              <button className="btn-cancelar" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
