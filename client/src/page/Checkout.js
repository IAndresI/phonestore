import { Container, makeStyles } from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import { addPayPal } from '../http/cartAPI';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    margin: '0 auto',
    width: '1000px'
  }
});

const Checkout = () => {

  const total = useSelector(state => state.cart.totalPrice)

  const classes = useStyles();

  // PayPal Payment

  const [paypalSDK, setPaypalSDK] = useState(!!document.querySelector('#paypal-button'))

  const successPaymentHandler = (details, data) => {
    alert("Transaction completed by " + details.payer.name.given_name);
    alert(data.orderID);
    console.log(details);
    console.log(data);
  }
  
  const failurePaymentHandler = (error) => {
    alert(error);
  }
  
  // End PayPal Payment

  useEffect(() => {
    addPayPal().then(clientId => {
      if(! document.querySelector('#paypal-button')) {
        const script = document.createElement('script');
        script.type='text/javascript';
        script.id='paypal-button';
        script.async = true;
        script.src = `https://www.paypal.com/sdk/js?&client-id=${clientId}`;
        script.setAttribute("data-namespace", "paypal_sdk")
        script.onload = () => {
          setPaypalSDK(true)
        };
        document.head.insertAdjacentElement("afterbegin", script);
      }
    })
  }, [])

  return (
    <section>
      <h1 className="title">Checkout</h1>
      <Container className={classes.container}>
        {
          paypalSDK ?
          (
            <PayPalButton
              style={{
                color: 'white',
                shape: 'pill',
                height: 55,
                layout: 'vertical',
                tagline: false
              }}
              shippingPreference="NO_SHIPPING"
              amount={total}
              onSuccess={successPaymentHandler}
              onError={failurePaymentHandler}
            />
          )
          :
          <Spinner />
        }
        
      </Container>
    </section>
  );
};

export default Checkout;