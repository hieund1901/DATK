import 'antd/dist/antd.css';
import React from 'react';
import {CookiesProvider} from 'react-cookie';
import ReactDOM from 'react-dom';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {Provider} from "react-redux";
import App from './App';
import './index.css';
import {store} from "./redux/store";

ReactDOM.render(
    <HelmetProvider>
        <CookiesProvider>
            <Helmet>
                <title>Main App</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                      crossOrigin="anonymous"/>
            </Helmet>
            <Provider store={store}>
                <App/>
            </Provider>
        </CookiesProvider>
    </HelmetProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
