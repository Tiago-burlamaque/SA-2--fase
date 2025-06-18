class ServicoUsuarios {
  cadastrar(usuario) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioJaCadastrado = usuarios.find(
      (u) => u.email.trim().toLowerCase() === usuario.email.trim().toLowerCase()
    );
    
    if (usuarioJaCadastrado) {
      console.warn("Tentativa de cadastro com e-mail duplicado:", usuario.email);
      return false;
    }

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    console.log("Usuário cadastrado:", usuario);
    return true;
  }

  listar() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
  }
}

export default ServicoUsuarios;