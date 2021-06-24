import { makeStyles } from '@material-ui/core';
import React from 'react';

const Footer = () => {
  const useStyles = makeStyles({
    root: {
      minHeight: 100,
      width: "100%",
      backgroundColor: '#3f51b5',
      color: 'white',
      fontSize: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 60
    },
  });
  
  const classes = useStyles();
  return (
    <footer className={classes.root}>
      PhoneStore
    </footer>
  );
};

export default Footer;