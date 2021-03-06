import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Button, makeStyles } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  icon: {
    fontSize: 130,
    color: "#4caf50"
  },
   button: {
    padding: "10px 20px",
    textTransform: "none",
    fontSize: 20,
   }
}))

const OrderStatus = (props) => {

  const history = useHistory()

  const classes = useStyles()
  
  return (
    <section className="page">
      <h1 className="title">Order Status</h1>
      <div className="order__status-container">
        <CheckCircleIcon className="order__status-icon" classes={{fontSizeLarge: classes.icon }} fontSize="large" />
        <h2 className="order__status-text">Your Order With ID: {history.location?.state?.details?.order}<br/> Has Been Successfully Created!</h2>
      </div>
      <Link className="order__status-link" to="/">
        <Button className={classes.button} variant="contained" color="primary">
          Back To Shop
        </Button>
      </Link>
    </section>
  );
};

export default OrderStatus;