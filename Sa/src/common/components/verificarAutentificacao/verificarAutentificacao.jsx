import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ServicoAutentificacao from "../../service/servicoAutentificacao";


const instanciaServicoAutentificacao = new ServicoAutentificacao();

const VerificarAutenticacao = () => {
  const usuarioEstaLogado = instanciaServicoAutentificacao.usuarioEstaLogado();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioEstaLogado) {
      navigate("/login");
    }
  }, [usuarioEstaLogado, navigate]);

  return <Outlet />;
};

export default VerificarAutenticacao;