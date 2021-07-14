import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { SHOP_ROUTE } from '../utils/consts';
import { useState, useEffect } from 'react';
import { check } from '../http/userAPI';
import { onLogin, setCart } from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import Layout from './Layout';
import Spinner from './Spinner';
import { getCart } from '../http/cartAPI';

const AppRouter = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const isAuth = useSelector(state => state.user.isAuth)

  useEffect(() => {
    check().then(data => {  
      dispatch(onLogin(data));
      getCart(data.cart_id).then(data => {
        dispatch(setCart(data))
      })
    })
    .catch(error => {
      const cart = isAuth ? localStorage.getItem('userCart') : localStorage.getItem('cart')
      dispatch(setCart(JSON.parse(cart) || []))
    }).finally(() => setLoading(false))
    
  }, [])

  if(loading) return <Layout><Spinner/></Layout> 
  return (
    <Layout>
      <Switch>
        {
          isAuth && authRoutes.map(({path, Component}) => <Route key={path} path={path} component={Component} exact/>)
        }
        {
          publicRoutes.map(({path, Component}) => <Route key={path} path={path} component={Component} exact/>)
        }
        <Redirect to={SHOP_ROUTE}/>
      </Switch>
    </Layout>
  );
};

export default AppRouter;