import './index.css';

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from 'react-router-dom';
import router from './common/service/router';

const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement);

root.render(
  
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);