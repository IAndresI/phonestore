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

  const [pageLoading, setPageLoading] = useState(false)
  const [classLoading, setClassLoading] = useState("main-content pageLoad")

  useEffect(() => {
    if(pageLoading) {
      setClassLoading("main-content pageLoading")
      console.log(11111);
      setTimeout(() => {
        setClassLoading("main-content pageLoad")
        console.log(2222);
        setPageLoading(false)
      }, 500);
    }
  }, [pageLoading])

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
    
    return () => setLoading(false)
  }, [])

  return (
    <Layout loading={loading} classLoading={classLoading}>
      <Switch>
        {
          isAuth && authRoutes.map(({path, Component}) => <Route key={path} path={path} render={() => <Component setPageLoading={setPageLoading}/>} exact/>)
        }
        {
          publicRoutes.map(({path, Component}) => <Route key={path} path={path} render={() => <Component setPageLoading={setPageLoading}/>} exact/>)
        }
        <Redirect to={SHOP_ROUTE}/>
      </Switch>
    </Layout>
  );
};

export default AppRouter;