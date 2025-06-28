import "./Rodape.css";

function Rodape() {
    const anoAtual = new Date().getFullYear();

    return (
        <footer className="rodape_root">
            <div className="copyright">
            <h6>
            Copyright © {anoAtual} - Todos os direitos
            reservados.
            </h6>
            </div>
           <div className="rodape">
            <div className="container-integrantes">
                <h5> Integrantes</h5>
                    <ul>
                        <li>
                            Tiago Burlamaque
                        </li>
                        <li>
                            Elionai
                        </li>
                        <li>
                            Guilherme
                        </li>
                        <li>
                            Lucas
                        </li>
                        <li>
                            Mycon 
                        </li>
                    </ul>
            </div>
            <div className="acoes-sa">
                <h5>O que cada um fizemos?</h5>
                <ul>
                    <li>
                        Front-end
                    </li>
                    <li>
                        Documentação
                    </li>
                    <li>
                        Back-end
                    </li>
                    <li>

                    </li>
                    <li>
                        Back-end
                    </li>
                </ul>
            </div>
            </div>
        </footer>
    );
}

export default Rodape;