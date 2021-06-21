import { Container } from '@material-ui/core';
import React from 'react';
import Header from './Header'


const Layout = (props) => {
  return (
    <>
      <Header />
      <Container>
        {props.children}
      </Container>
    </>
  );
};

export default Layout;