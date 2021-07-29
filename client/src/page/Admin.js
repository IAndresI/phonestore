import React, {useEffect} from 'react';

const Admin = ({setPageLoading}) => {

  useEffect(() => {
    return () => setPageLoading(true)
  }, [])
  
  return (
    <section className="section">
      Admin
    </section>
  );
};

export default Admin;