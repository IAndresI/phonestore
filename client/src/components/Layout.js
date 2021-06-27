import React from 'react';
import Footer from './Footer';
import Header from './Header'

const Layout = (props) => {
  return (
    <>
      <Header className="header" />
      <main className="main-content">
        {props.children}
      </main>
      <Footer className="footer"/>
    </>
  );
};

export default Layout;