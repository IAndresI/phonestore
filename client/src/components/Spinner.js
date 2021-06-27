import React from 'react';
import { CircularProgress } from '@material-ui/core';

const Spinner = () => {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: "100%", width: "100%"}}>
      <CircularProgress style={{width: 100, height: 100}}/>
    </div>
  );
};

export default Spinner;