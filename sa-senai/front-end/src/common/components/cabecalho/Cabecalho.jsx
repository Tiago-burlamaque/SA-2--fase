// src/common/components/cabecalho/Cabecalho.jsx
import "./Cabecalho.css";
import { useLocation } from "react-router-dom";
import Navbar from "../navbar/Navbar";

function Cabecalho() {
  const { pathname } = useLocation();

  return (
    <header className="cabecalho_root">
      {pathname !== "/" && <Navbar />}
    </header>
  );
}

export default Cabecalho;
