import React, {useState} from 'react';
import Footer from './Footer';
import Header from './Header'

const Layout = (props) => {
  return (
    <div className="root">
      {
        props.loading ? null :
        (
          <>
            <Header />
            <main className="main-content loading-transition">
              {props.children}
            </main>
            <Footer className="footer"/>
          </>
        )
      }
      
    </div>
  );
};

export default Layout;