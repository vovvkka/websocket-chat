import React from 'react';
import Layout from "./components/UI/Layout/Layout";
import {Route, Switch} from "react-router-dom";
import Chat from "./containers/Chat/Chat";
import Register from "./containers/Register/Register";
import Login from "./containers/Login/Login";

const App = () => {
    return (
        <Layout>
            <Switch>
                <Route path='/' component={Chat} exact/>
                <Route path='/register' component={Register}/>
                <Route path='/login' component={Login}/>
            </Switch>
        </Layout>
    );
};

export default App;