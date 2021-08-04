import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { SHOP_ROUTE } from '../utils/consts';
import { useState, useEffect } from 'react';
import { check } from '../http/userAPI';
import { onLogin, setCart } from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import Layout from './Layout';
import { getCart } from '../http/cartAPI';

const AppRouter = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const isAuth = useSelector(state => state.user.isAuth)

  useEffect(() => {
    check().then(data => {  
      dispatch(onLogin(data));
      getCart(data.cart_id).then(data => {
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
    <Layout loading={loading} classLoading={() => 1}>
      <Switch>
        {
          isAuth && authRoutes.map(({path, Component}) => <Route key={path} path={path} render={() => <Component setPageLoading={() => 1}/>} exact/>)
        }
        {
          publicRoutes.map(({path, Component}) => <Route key={path} path={path} render={() => <Component setPageLoading={() => 1}/>} exact/>)
        }
        <Redirect to={SHOP_ROUTE}/>
      </Switch>
    </Layout>
  );
};

export default AppRouter;