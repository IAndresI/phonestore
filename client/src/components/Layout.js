import React, {useState} from 'react';
import Footer from './Footer';
import Header from './Header'

const Layout = (props) => {
  return (
    <div className={props.loading ? "root loading" : "root onload"}>
      {
        props.loading ? null :
        (
          <>
            <Header className="header" />
            <main className={props.classLoading}>
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