import React from 'react';
import App from './App'
import ReactDom from 'react-dom'
import {Provider} from 'react-redux';
import store from './store';

ReactDom.render(    <Provider store={store}><App/></Provider>, document.getElementById('root'))