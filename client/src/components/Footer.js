import { makeStyles } from '@material-ui/core';
import React from 'react';

const Footer = () => {
  const useStyles = makeStyles({
    root: {
      minHeight: 100,
      width: "100%",
      backgroundColor: '#3f51b5',
      color: 'black',
      fontSize: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 60,
      background: "#3f51b5",
      background: "-webkit-linear-gradient(to top, #3f51b5 0.1%,#fafafa 90% ,#fafafa 99%)",
      background: "linear-gradient(to top, #3f51b5 0.1%, #fafafa 90% ,#fafafa 99%)"
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