// src/pages/LoginCliente/LoginCliente.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import { useClientes } from '../../common/service/useClientes';
import './LoginCliente.css';

export default function LoginCliente() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const {
    inputEmail,
    inputSenha,
    setInputEmail,
    setInputSenha,
    loginCliente
  } = useClientes();

  const entrar = async (e) => {
    e.preventDefault();
    if (!inputEmail || !inputSenha) {
      toast.error('Preencha e-mail e senha!');
      return;
    }

    try {
      const { sucesso, cliente } = await loginCliente();
      if (sucesso) {
      login(cliente);
      localStorage.setItem("clienteId", cliente.id_clientes); // ⬅️ esta linha salva o ID
      toast.success('Bem-vindo(a)!', { autoClose: 1200 });
      navigate('/home');
      }   
      else {
        toast.error('Credenciais inválidas');
      }
    } catch {
      toast.error('Erro ao conectar-se ao servidor');
    }
  };

return (
  <div className="container-login-cliente">
    <div className="container-login-box">
      <h1>Login</h1>
      <form onSubmit={entrar}>
        <div className="cnt-box-login">
          <label htmlFor="email">E-mail:</label>
          <input
            id="email"
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            placeholder="Digite seu e-mail"
          />
        </div>

        <div className="cnt-box-login">
          <label htmlFor="senha">Senha:</label>
          <input
            id="senha"
            type="password"
            value={inputSenha}
            onChange={(e) => setInputSenha(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>

        <button className='btn-log' type="submit">Entrar</button>
      </form>
    </div>
  </div>
);

}
