import React from 'react';
import Footer from './Footer';
import Header from './Header'
import Spinner from './Spinner';

const Layout = (props) => {
  return (
    <div className="root">
      {
        props.loading ? <Spinner /> :
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