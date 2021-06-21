import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducers';
import thunkMiddleware from 'redux-thunk';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
  applyMiddleware(thunkMiddleware)
));

export default store;