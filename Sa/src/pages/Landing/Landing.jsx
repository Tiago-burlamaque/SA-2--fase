import "./Landing.css"
import React from "react";
import { Link } from "react-router-dom";
// import minhaImagem from './public/images/Frame_4-removebg-preview.png'

function Landing(){

  return (
    <>
        <div className="container">
          <img src="" alt="" />
          
           <div className="title-landing">
          <h1>Easy <span className="laranja">Routines</span></h1>
          </div>

          <div className="descricao-landing">

            <img src="public/images/Frame_4-removebg-preview.png" alt="" width={"1000px"}/>
            <p>Um aplicativo de criação de rotinas para crianças autistas pode ter um impacto profundamente positivo na sociedade, promovendo inclusão, autonomia e bem-estar tanto para as crianças quanto para suas famílias. Ao oferecer recursos visuais, lembretes personalizados e atividades estruturadas, o app facilita a compreensão do dia a dia por parte das crianças com transtorno do espectro autista (TEA), que frequentemente se beneficiam de previsibilidade e organização. Além disso, ao reduzir crises de ansiedade e melhorar a comunicação entre pais, cuidadores e educadores, o aplicativo contribui para um ambiente mais acolhedor e colaborativo. A longo prazo, esse tipo de tecnologia pode auxiliar no desenvolvimento da independência dessas crianças, diminuir a sobrecarga familiar e fomentar uma sociedade mais empática e preparada para lidar com a diversidade.
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