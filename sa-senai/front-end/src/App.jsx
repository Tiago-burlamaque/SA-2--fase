import './App.css';
import "react-toastify/dist/ReactToastify.css";
import Cabecalho from './common/components/cabecalho/Cabecalho';
import Body from './common/components/body/body';
import { ToastContainer } from 'react-toastify';
import Rodape from './common/components/rodape/Rodape';

function App(){

  return(
    <>
    <Cabecalho />
    <Body />
    <ToastContainer />
    <Rodape />
    </>
  )
}
export default App;