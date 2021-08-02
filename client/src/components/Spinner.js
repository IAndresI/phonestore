import React from 'react';
import { CircularProgress } from '@material-ui/core';

const Spinner = () => {
  return (
    <div className="page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%"}}>
      <CircularProgress style={{width: 100, height: 100}}/>
    </div>
  );
};

export default Spinner;