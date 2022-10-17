import React from 'react';
import ReactDOM from 'react-dom/client';
import {Router} from "react-router-dom";
import App from './App';
import './index.css';
import {ThemeProvider} from "@mui/material";
import theme from "./theme";
import history from "./history";

const app = (
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <App/>
            </Router>
        </ThemeProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(app);
