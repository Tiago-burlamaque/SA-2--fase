class ServicoCliente {
    listar() {
        const clienteLocalStorage = localStorage.getItem(
            'listar-clientes'
        );
    return clienteLocalStorage ? JSON.parse(clienteLocalStorage) : [];
    }

cadastrarCliente(usuario) {
    const usuariosLocalStorage = this.listar();
    usuariosLocalStorage.push(usuario);
    localStorage.setItem(
        'listar-clientes',
        JSON.stringify(usuariosLocalStorage)
    );
}

    editarCliente(cliente) {
        const clienteLocalStorage = this.listar();
        const indexCliente = clienteLocalStorage.findIndex(
            (c) => c.id === +cliente.id
        );
        clienteLocalStorage[indexCliente] = cliente;
        localStorage.setItem(
            'listar-clientes',
            JSON.stringify(clienteLocalStorage)
        );
    }

    buscarPorId(idCliente) {
        const clienteLocalStorage = this.listar();
        return clienteLocalStorage.find(
            (c) => c.id === +idCliente
        );
    }

    excluirCliente(idCliente) {
        const clienteLocalStorage = this.listar();

        const listaAtualizada = clienteLocalStorage.filter((c) => c.id !== Number(idCliente));
        localStorage.setItem(
            'listar-clientes',
            JSON.stringify(listaAtualizada)
        );

        return listaAtualizada;
    }

}

export default ServicoCliente;