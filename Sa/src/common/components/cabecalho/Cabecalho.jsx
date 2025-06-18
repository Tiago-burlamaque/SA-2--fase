import "./Cabecalho.css";
import Navbar from "../navbar/Navbar";


function Cabecalho () {

    return (
        <header className="cabecalho_root">
            {/* <img src="icon-profile-3.jpg" height={40} /> */}
            <Navbar />
            {/* <Avatar nome="Nome Sobrenome" />
            <h1 className="cabecalho-title">Autism Aid Game</h1> */}
        </header>
    );
}

export default Cabecalho;