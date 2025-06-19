import { createBrowserRouter } from "react-router-dom";
import Landing from "../../pages/Landing/Landing";
import PaginaInicial from "../../pages/PaginaInicial/PaginaInicial";
import CadastroCliente from "../../pages/CadastroCliente/CadastroCliente";
import LoginCliente from "../../pages/LoginCliente/LoginCliente";
import App from "../../App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [

            {   path: "home",
                element: <PaginaInicial />
            },
            {   
                path: "cadastro",
                element: <CadastroCliente />
            },
            {   
                path: "login",
                element: <LoginCliente />
            },
            { 
                path: "landing",
                element: <Landing />
            },
            {   
                path: "*",
                element: <div>404 - Página não encontrada</div>
            }
        ]
    }
]);

export default router;
