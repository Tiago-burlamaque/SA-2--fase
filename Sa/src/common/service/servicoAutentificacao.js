import ServicoUsuarios from "./servicoUsuarios";

class ServicoAutentificacao {
  constructor() {
    this.servicoUsuarios = new ServicoUsuarios();
  }

  login(email, senha) {
    const usuarios = this.servicoUsuarios.listar();
    const usuarioEncontrado = usuarios.find(
      (u) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.senha === senha
    );

    if (usuarioEncontrado) {
      localStorage.setItem("usuario-logado", JSON.stringify(usuarioEncontrado));
      return usuarioEncontrado;
    }
    return null;
  }

  usuarioEstaLogado() {
    return localStorage.getItem("usuario-logado") !== null;
  }

  logout() {
    localStorage.removeItem("usuario-logado");
  }
}

export default ServicoAutentificacao;