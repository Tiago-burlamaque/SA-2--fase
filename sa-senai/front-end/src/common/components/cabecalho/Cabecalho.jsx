// src/common/components/cabecalho/Cabecalho.jsx
import "./Cabecalho.css";
import Navbar from "../navbar/Navbar";


function Cabecalho() {

  return (
<header className="cabecalho_root"> 
  <div className="cab_nav">
    <Navbar />
    </div>
</header>
  );
}

export default Cabecalho;
