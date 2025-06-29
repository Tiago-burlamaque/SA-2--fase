import "./Landing.css"
import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import minhaImagem from './public/images/Frame_4-removebg-preview.png'

function Landing(){
  return (
    <>
        <div className="container">
        
           <div className="title-landing">
          <h1>Easy <span className="laranja">Routines</span></h1>
          </div>

          <div className="descricao-landing">

            <img src="/images/Frame_4-removebg-preview.png" alt="" width={"1000px"}/>
            <p>Um aplicativo de rotinas para crianças autistas pode melhorar significativamente a vida dessas crianças e de suas famílias. Com recursos visuais e lembretes personalizados, ele ajuda na organização do dia a dia, reduz crises de ansiedade e facilita a comunicação entre pais, cuidadores e educadores. Essa tecnologia promove inclusão, autonomia e contribui para uma sociedade mais empática e preparada para a diversidade.
            </p>
            </div>
          <div className="botao-landing" >

            {/* <button className="btn-rotina"><span className="vermelho">Crie </span><span className="amarelo">sua ro</span> <span className="roxo">tina ag</span> <span className="vermelho">ora</span></button> */}
            <button>Crie sua rotina</button>
            
          </div>


       </div>
    </>
  );
};

export default Landing;