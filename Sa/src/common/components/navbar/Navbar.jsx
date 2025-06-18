import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import ServicoAutentificacao from '../../service/servicoAutentificacao';

const instanciaServicoAutentificacao = new ServicoAutentificacao();

const Navbar = () => {

    const [online, setOnline] = useState(false);

    useEffect(() => {

        const statusOnline = () => {

            const loggedIn = instanciaServicoAutentificacao.usuarioEstaLogado();
            setOnline(loggedIn);
        };
        statusOnline();
        
    }, []); 


    const botaoLogout = () => {
        instanciaServicoAutentificacao.logout(); 
        setOnline(false);

    };

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                {online && (
                    <li className="navbar-item">
                        <Link to="/paginainicial" className="navbar-link">HomePage</Link>
                    </li>
                )}

                <li className="navbar-item">
                    <Link to="/landing" className="navbar-link">Landing</Link>
                </li>

                {!online && (
                    <>
                        <li className="navbar-item">
                            <Link to="/cadastro" className="navbar-link">Cadastrar</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/login" className="navbar-login">Login</Link>
                        </li>
                    </>
                )}


                {online && (
                    <li className="navbar-item">

                        <button onClick={botaoLogout} className="btn-logout">Logout</button>
                    </li>
                )}
            </ul>
        </nav>

    );
};

export default Navbar;