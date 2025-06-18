import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ServicoUsuarios from "../../common/service/servicoUsuarios";
import "./CadastroCliente.css";

const instanciaServicoUsuarios = new ServicoUsuarios();

function CadastroCliente() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const cadastrar = () => {
    if (!nome || !email || !senha) {
      toast.error("Preencha todos os campos!");
      return;
    }

    const novoUsuario = { nome, email, senha };
    const sucesso = instanciaServicoUsuarios.cadastrar(novoUsuario);

    if (sucesso) {
      toast.success("Cadastro realizado com sucesso! Faça login.", {
        onClose: () => navigate("/login"),
        autoClose: 1500,
      });
    } else {
      toast.error("Um usuário com este e-mail já foi cadastrado!");
    }
  };

  return (
    <div className="container-cadastro-cliente">
      <div className="container-cadastro-box">
        <div className="container-topo">
        <h1>Cadastro</h1><img src="public/images/Icon.svg" alt="" />
        </div>
        <div className="input-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
             placeholder="E-mail"
          />
        </div>
        <div className="input-group">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
             placeholder="Senha"
          />
        </div>
        <button className="btn-cad" onClick={cadastrar}>Cadastrar</button>
      </div>
    </div>
  );
}

export default CadastroCliente;