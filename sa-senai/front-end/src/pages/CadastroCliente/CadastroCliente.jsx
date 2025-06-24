// src/pages/CadastroCliente/CadastroCliente.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useClientes } from "../../common/service/useClientes";
import "./CadastroCliente.css";

export default function CadastroCliente() {
  const navigate = useNavigate();

  // Consome do hook apenas o que o cadastro precisa
  const {
    inputNome,
    inputCpf,
    inputEmail,
    inputSenha,
    inputEndereco,
    inputTelefone,
    setInputNome,
    setInputCpf,
    setInputEmail,
    setInputSenha,
    setInputEndereco,
    setInputTelefone,
    cadastrarCliente,
    limparForm,
  } = useClientes();

  // Handler do form: chama a função do hook, trata toast e redireciona
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Checa validação mínima
    if (!inputNome || !inputEmail || !inputSenha) {
      toast.error("Nome, e-mail e senha são obrigatórios!");
      return;
    }

    try {
      await cadastrarCliente();  
      
      toast.success("Cadastro realizado com sucesso!", {
        onClose: () => navigate("/login"),
        autoClose: 1500,
      });
    } catch (error) {
      // O hook já loga o erro no console, mas aqui mostramos no toast
      toast.error(error?.response?.data?.error || "Erro ao cadastrar cliente");
    }
  };

  return (
    <div className="container-cadastro-cliente">
      <div className="container-cadastro-box">
        <div className="container-topo">
          <h1>Cadastro</h1>
        </div>

        <form onSubmit={handleSubmit}>
        <div className="container-form">
          <div className="input-group">
            <label htmlFor="nome">Nome:</label>
            <input
              id="nome"
              type="text"
              placeholder="Nome"
              value={inputNome}
              onChange={(e) => setInputNome(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="cpf">Cpf:</label>
            <input
              id="cpf"
              type="text"
              placeholder="Digite apenas números"
              value={inputCpf}
              onChange={(e) => setInputCpf(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail:</label>
            <input
              id="email"
              type="email"
              placeholder="E-mail"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha:</label>
            <input
              id="senha"
              type="password"
              placeholder="Senha"
              value={inputSenha}
              onChange={(e) => setInputSenha(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="endereco">Endereço:</label>
            <input
              id="endereco"
              type="text"
              placeholder="Endereço (opcional)"
              value={inputEndereco}
              onChange={(e) => setInputEndereco(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="telefone">Telefone:</label>
            <input
              id="telefone"
              type="text"
              placeholder="Telefone (opcional)"
              value={inputTelefone}
              onChange={(e) => setInputTelefone(e.target.value)}
            />
          </div>

          <div className="botoes-cadastro">
            <button className="btn-cad" type="submit">
            Limpar
            </button>
            <button
              className="btn-clean"
              type="button"
              onClick={limparForm}
              >
              Cadastrar
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}
