import React from 'react';
import ReactDOM from 'react-dom/client';
import {Router} from "react-router-dom";
import App from './App';
import './index.css';
import {ThemeProvider} from "@mui/material";
import theme from "./theme";
import history from "./history";
import store from "./store/configureStore";
import {Provider} from "react-redux";

const app = (
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <App/>
            </Router>
        </ThemeProvider>
    </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(app);
