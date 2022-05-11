import './index.scss'
import {BrowserRouter as Router} from 'react-router-dom';
import AppRouter from './components/AppRouter'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useState, useEffect } from 'react';
import { check } from './http/userAPI';
import { onLogin, setCart } from './store/actions';
import {useDispatch, useSelector} from 'react-redux';
import { getCart } from './http/cartAPI';


function App() {

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const isAuth = useSelector(state => state.user.isAuth)

  useEffect(() => {
    check().then(data => {  
      dispatch(onLogin(data));
      
      getCart(data.cart_id).then(data => {
        console.log(data);
        dispatch(setCart(data.map((el, i) => ({...el, selectedColor: {id: el.selectedColor[0][0], name: el.selectedColor[0][1], code: el.selectedColor[0][2]}}))))
      })
    })
    .catch(error => {
      const cart = isAuth ? localStorage.getItem('userCart') : localStorage.getItem('cart')
      dispatch(setCart(JSON.parse(cart) || []))
    }).finally(() => setLoading(false))
    
    return () => setLoading(false)
  }, [])

  return (
    <Router>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <AppRouter loading={loading} isAuth={isAuth}/>
      </MuiPickersUtilsProvider>
    </Router>
  );
}

export default App;
