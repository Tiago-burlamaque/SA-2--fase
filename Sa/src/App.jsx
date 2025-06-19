import './App.css';
import Cabecalho from './common/components/cabecalho/Cabecalho';
import Rodape from './common/components/rodape/Rodape';

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ServicoAutentificacao from './common/service/servicoAutentificacao';
import { useState } from 'react';
import Body from './common/components/body/body';


function App() {

  return (
    <>
    
    <Cabecalho />
    <Body />
    {/* <Outlet /> */}
    <ToastContainer />
    <Rodape />

    </>
  )
}
export default App;
