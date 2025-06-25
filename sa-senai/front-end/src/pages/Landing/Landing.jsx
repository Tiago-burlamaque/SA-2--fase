import "./Landing.css"
import React from "react";
import { useNavigate } from "react-router-dom";
// import minhaImagem from './public/images/Frame_4-removebg-preview.png'

function Landing(){
  const navigate = useNavigate(); // Hook para navegação

  // Função para redirecionar para a página de cadastro
  const ChamarCadastro = () => {
    navigate("/cadastro"); // Altere para a rota correta
  };
  
  return (
    <>
        <div className="container">
        
           <div className="title-landing">
          <h1>Easy <span className="laranja">Routines</span></h1>
          </div>

          <div className="descricao-landing">

            <img src="public/images/Frame_4-removebg-preview.png" alt="" width={"1000px"}/>
            <p>Um aplicativo de rotinas para crianças autistas pode melhorar significativamente a vida dessas crianças e de suas famílias. Com recursos visuais e lembretes personalizados, ele ajuda na organização do dia a dia, reduz crises de ansiedade e facilita a comunicação entre pais, cuidadores e educadores. Essa tecnologia promove inclusão, autonomia e contribui para uma sociedade mais empática e preparada para a diversidade.
            </p>
            </div>
          <div className="botao-landing" >

            {/* <button className="btn-rotina"><span className="vermelho">Crie </span><span className="amarelo">sua ro</span> <span className="roxo">tina ag</span> <span className="vermelho">ora</span></button> */}
            <button onClick={ChamarCadastro}>Crie sua rotina</button>
            
          </div>


       </div>
    </>
  );
};

export default Landing;