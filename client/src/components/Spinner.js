import React from 'react';
import { CircularProgress } from '@material-ui/core';

const Spinner = () => {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: "100%", width: "100%"}}>
      <CircularProgress />
    </div>
  );
};

export default Spinner;