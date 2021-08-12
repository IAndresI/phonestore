import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { SHOP_ROUTE } from '../utils/consts';
import Layout from './Layout';

const AppRouter = ({loading, isAuth}) => {
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