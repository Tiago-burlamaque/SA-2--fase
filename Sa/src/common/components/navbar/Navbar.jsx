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
            <div className="container-inicio-navbar">
                <img src="public/images/Frame_4-removebg-preview.png" alt="" width={"100px"} />
            </div>
            <ul className="navbar-list">
                
                {online && (
                <div className="container-links">
                    <li className="navbar-item">
                        <Link to="/paginainicial" className="navbar-link">HomePage</Link>
                    </li>
                </div>
                   
                )}

                <li className="navbar-item">
                    <Link to="/landing" className="navbar-link">Landing</Link>
                </li>

                {!online && (
                    <>
                    <div className="container-links">
                        <li className="navbar-item">
                            <Link to="/cadastro" className="navbar-link">Cadastrar</Link>
                        </li>
                    </div>
                    <div className="container-links">
                        <li className="navbar-item">
                            <Link to="/login" className="navbar-login">Login</Link>
                        </li>
                        </div>
                    </>
                )}


                {online && (
                <div className="container-links">
                    <li className="navbar-item">

                        <button onClick={botaoLogout} className="btn-logout">Logout</button>
                    </li>
                </div>
                )}
            </ul>
        </nav>

    );
};

export default Navbar;