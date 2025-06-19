import './index.css';

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from 'react-router-dom';
import router from './common/service/router';
// Selecione o elemento raiz
const rootElement = document.getElementById("root");

// Crie a raiz com "createRoot"
const root = ReactDOM.createRoot(rootElement);

// Renderize o componente
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
    
);