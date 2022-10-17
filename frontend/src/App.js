import React from 'react';
import Layout from "./components/Layout/Layout";
import {Route, Switch} from "react-router-dom";
import Chat from "./containers/Chat/Chat";

const App = () => {
    return (
        <Layout>
            <Switch>
                <Route path='/' component={Chat}/>
            </Switch>
        </Layout>
    );
};

export default App;