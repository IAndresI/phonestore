import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAddCartTotal, setPaymentMethod } from '../../store/actions';
import { Button, Container, FormControlLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import Map from '../../components/cart/Map';
import {addPayPal, getLocations, getPaymentMethod} from '../../http/cartAPI'
import PickupPointSelect from '../../components/cart/PickupPointSelect';
import Spinner from '../../components/Spinner';
import UserAddressSelect from '../../components/cart/UserAddressSelect';
import { PayPalButton } from "react-paypal-button-v2";
import { Controller, useForm } from 'react-hook-form';
import PayPalModal from '../../components/cart/PayPalModal';
import {createUnregistredUserOrder, createRegistredUserOrder} from '../../http/orderAPI'
import { ORDER_STATUS } from '../../utils/consts';
import useStyles from './style'
import SnackBar from '../../components/cart/SnackBar';
import ItemsList from '../../components/cart/ItemsList';
import { isAlreadyRegistred } from '../../http/userAPI';
import usePageDataLoad from '../../customHooks/usePageDataLoad';

const Cart = () => {

  // Dispatch

  const dispatch = useDispatch()

  // Material UI Styles

  const classes = useStyles();

  // API Errors

  const [apiErrors, setApiErrors] = useState({})

  // Redirect

  const history = useHistory()

  // Cart Stored Info

  const cartItems = useSelector(state => state.cart.cartList)
  const cartTotal = useSelector(state => state.cart.totalPrice)
  const cartPaymentMethod = useSelector(state => state.cart.paymentMethod)
  const cartPickupPoint = useSelector(state => state.cart.pickupPoint)

  // User Stored Info

  const isAuth = useSelector(state => state.user.isAuth)
  const user = useSelector(state => state.user.user)

  // Inputs State

  const [pickupPoints, setPickupPoints] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [wayToGet, setWayToGet] = useState('pickupPoint');
  const [tempUserData, setTempUserData] = useState({})

  // Loading Scripts And Queries

  const [paypalSDK, setPaypalSDK] = useState(!!document.querySelector('#paypal-button'))
  const [googleSDK, setGoogleSDK] = useState(!!document.querySelector('#googlemaps'))

  // Form Controll

  const { control, handleSubmit, setValue, formState: { errors } } = useForm();

  const getFullData = (formData, unregistred) => {

    let clientAddress;

    if(formData.deliveryAvenue && wayToGet==='delivery') {
      const fragmentedAddress = formData.deliveryAvenue.split(',')
      const countryAndCity = fragmentedAddress.splice(fragmentedAddress.length - 2)
      clientAddress = `${fragmentedAddress.join(',')}, room ${formData.room},${countryAndCity.join(',')}`;
    }

    if(unregistred) {
      const orderDeatils = {
        pickupPoint: pickupPoints.find(el => el.address===formData.pickupPoint)?.pickup_point_id || null,
        deliveryAddress: clientAddress || null,
        dateOrderPaid: cartPaymentMethod === 2 ? new Date() : null, 
        total: cartTotal,
        items: cartItems.map(e => [e.phone_id, e.count, e.selectedColor.id || -1]),
        paymentMethod: cartPaymentMethod
      }
      const clientDeatils = {
        email: formData.email,
        phone: formData.phone || null,
        firstName: formData.firstName,
        lastName: formData.lastName
      }

      return {orderDeatils, clientDeatils};
    }
    else {
      const orderDeatils = {
        clientId: user.id,
        pickupPoint: pickupPoints.find(el => el.address===formData.pickupPoint)?.pickup_point_id || null,
        deliveryAddress: clientAddress || null,
        total: cartTotal,
        items: cartItems.map(e => [e.phone_id, e.count, e.selectedColor.id || -1]),
        dateOrderPaid: cartPaymentMethod === 2 ? new Date() : null,
        paymentMethod: cartPaymentMethod,
      }

      return orderDeatils;
    }
  }

  const createOrder = async (data, e) => {
    e.preventDefault();
    setApiErrors({})
    if (cartPaymentMethod === 2) {
      if(isAuth) {
        setTempUserData(getFullData(data, false))
        setOpenPayPalMpdal(true);
      }
      else {
        const alreadyRegistred = await isAlreadyRegistred(data.email)
        if(!alreadyRegistred) {
          setTempUserData(getFullData(data, true))
          setOpenPayPalMpdal(true);
        }
        else setApiErrors((oldErrors) => ({...oldErrors, emailDuplicate: "This Email already exists"}))
      }
    }
    else {
      if(isAuth) {
        try {

          const orderDetails = getFullData(data, false)

          const orderId = await createRegistredUserOrder(orderDetails)
          setApiErrors({})
          history.push({
            pathname: ORDER_STATUS,
            state: { details: orderId }
          })
        }
        catch(err) {
          if(err?.response?.status === 409) {
            setApiErrors((oldErrors) => ({...oldErrors, emailDuplicate: "This Email already exists"}))
          }
        }
      }
      else {
        try {

          const orderDetails = getFullData(data, true)
          const details = await createUnregistredUserOrder(orderDetails.orderDeatils, orderDetails.clientDeatils)

          history.push({
            pathname: ORDER_STATUS,
            state: { details: details }
          })
        }
        catch(err) {
          if(err?.response?.status === 409) {
            setApiErrors((oldErrors) => ({...oldErrors, emailDuplicate: "This Email already exists"}))
          }
        }
      }
    }
  }

  // Upload Data From Server

  const getCartData = async () => {
    getLocations().then(data => {
      setPickupPoints(data)
    })
    getPaymentMethod().then(data => {
      setPaymentMethods(data)
      dispatch(setPaymentMethod(data[1].method_id))
    })
    addPayPal().then(clientId => {
      if(!document.querySelector('#paypal-button')) {
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
    addGoogleAPIs();
  }

  // ComponentDidMount

  const [data, setData, loading, error] = usePageDataLoad(getCartData)

  //PayPal modal control

  const [openPayPalMpdal, setOpenPayPalMpdal] = useState(false);

  const handlePayPalModalClose = () => {
    setOpenPayPalMpdal(false);
  };

  // PayPal payment

  const successPaymentHandler = async (details, data) => {
    if(isAuth) {
      try {
        const orderId = await createRegistredUserOrder(tempUserData)
        setApiErrors({})
        history.push({
          pathname: ORDER_STATUS,
          state: { detail: orderId }
        })
      }
      catch(err) {
        if(err?.response?.status === 409) {
          setApiErrors((oldErrors) => ({...oldErrors, emailDuplicate: "This Email already exists"}))
        }
      }
    }
    else {
      try {
        const details = await createUnregistredUserOrder(tempUserData.orderDeatils, tempUserData.clientDeatils)
        history.push({
          pathname: ORDER_STATUS,
          state: { detail: {order: details.order.data} }
        })
      }
      catch(err) {
        if(err?.response?.status === 409) {
          setApiErrors((oldErrors) => ({...oldErrors, emailDuplicate: "This Email already exists"}))
        }
      }
    }
  }

  const failurePaymentHandler = (error) => {
    setApiErrors((oldErrors) => ({...oldErrors, payError: "You didn't pay"}))
  }

  // Google maps and autocomplete 

  const addGoogleAPIs = () => {
    if(!document.querySelector('#googlemaps')) {
      const script = document.createElement('script');
      script.id='googlemaps';
      script.type='text/javascript';
      script.async = false;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=geometry,drawing,places`;
      script.onload = () => {
        setGoogleSDK(true)
      };
      document.head.insertAdjacentElement("afterbegin", script);
    }
  }

  // Dispatch payment method
  
  const paymentMathodHandleChange = (event) => {
    dispatch(setPaymentMethod(+event.target.value))
  };

  // Way To Get RadioGroup

  const WayToGetLabel = ({name, price}) => {
    return (
      <div className={classes.wayToGetLabel}>
        <span className={classes.wayToGetName}>{name}</span>
        <span className={classes.wayToGetPrice}>{price}</span>
      </div>
    )
  }

  const wayToGetHandleChange = (event) => {
    setWayToGet(event.target.value);
    if(event.target.value==="delivery") {
      dispatch(onAddCartTotal(4));
      setValue('pickupPoint', null)
    }
    else {
      dispatch(onAddCartTotal(-4))
      setValue('deliveryAvenue', null)
    }
  };

  // Format Price Data From DB

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Loading & Error Indicator

  if(loading) return <Spinner />

  if(error) return <h3>Some Error {error.message}</h3>

  // Returning Component

  return (
    <section className="section page">
      <h1 className="title">Cart</h1>
      <Container>
        {
          cartItems.length > 0 ? 
          (
            <div className={classes.container}>
              <div className={classes.info}>
                <h2>Items In Cart</h2>
                <ItemsList classes={classes} cartItems={cartItems} />
                <form className={classes.form} onSubmit={handleSubmit(createOrder)}>
                  {
                    !isAuth ? 
                    (
                      <>
                        <h2>Enter Your Details</h2>
                        <div className={classes.userData}>
                          <Controller
                            name="firstName"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <TextField
                              className={classes.userDataInput}
                              type="text"
                              id="outlined-required"
                              label="First Name"
                              placeholder="Enter Your First Name"
                              variant="outlined"
                              {...field }
                            />}
                          />
                          <Controller
                            name="lastName"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <TextField
                              className={classes.userDataInput}
                              type="text"
                              id="outlined-required"
                              label="Last Name"
                              placeholder="Enter Your Last Name"
                              variant="outlined"
                              {...field }
                            />}
                          />
                          <Controller
                            name="email"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <TextField
                              className={classes.userDataInput}
                              id="outlined-required"
                              type="email"
                              label="Email"
                              placeholder="Enter Email"
                              variant="outlined"
                              {...field }
                            />}
                          />
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => <TextField
                              className={classes.userDataInput}
                              id="outlined-required"
                              label="Phone"
                              type="tel"
                              placeholder="Enter Phone"
                              variant="outlined"
                              {...field }
                            />}
                          />
                        </div>
                      </>

                    )
                    :
                    null
                  }
                  <h2>Choose A Way To Get</h2>
                  <RadioGroup className={classes.wayToGet} aria-label="Way To Get" name="wayToGet" onChange={wayToGetHandleChange} value={wayToGet}>
                    <FormControlLabel className={classes.wayToGetItem} style={{borderRight: '1px solid rgba(0, 0, 0, 0.23)'}} value="pickupPoint" control={<Radio classes={{checked: classes.radio}} />} label={<WayToGetLabel name="Pickup Point" price="Free"/>}/>
                    <FormControlLabel className={classes.wayToGetItem} value="delivery" control={<Radio classes={{checked: classes.radio}} />} label={<WayToGetLabel name="Courier Delivery" price="$4.00"/>} />
                  </RadioGroup>
                  {
                    wayToGet==="pickupPoint" ? 
                      googleSDK ?
                      (
                        <>
                          <Controller
                            name="pickupPoint"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <PickupPointSelect setValue={setValue} pickupPoints={pickupPoints} {...field}/>}
                          />
                          <Map 
                            setValue={setValue} 
                            selectedPointCoordinates={{
                              lat: pickupPoints.find(el=> el.address===cartPickupPoint?.address)?.coordinates[0] || 59.869464, 
                              lng: pickupPoints.find(el=> el.address===cartPickupPoint?.address)?.coordinates[1] || 30.34734
                            }} 
                            pickupPoints={pickupPoints}/>
                        </> 
                      ) : <Spinner />
                    :
                    (
                      <Controller
                        name="deliveryAvenue"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => <UserAddressSelect setValue={setValue} control={control} {...field}/>}
                      />
                    )
                  }
                  <h2>Choose A Payment Method</h2>
                  <RadioGroup 
                    className={classes.paymentMethod}
                    aria-label="payment method"
                    name="paymentMethod"
                    value={cartPaymentMethod}
                    onChange={paymentMathodHandleChange}>
                    {
                      paymentMethods.map(method => <FormControlLabel key={method.method_id} value={method.method_id} control={<Radio classes={{checked: classes.radio}} />} label={method.name} />)
                    }
                  </RadioGroup>
                  
                  {
                    cartPaymentMethod === 2 ? 
                      paypalSDK ?
                        Object.keys(errors).length > 0 ?
                        (
                          <Button type="submit" className={classes.checkout}>
                            Go To Checkout
                          </Button>
                        )
                        :
                        (
                          <Button type="submit" className={classes.checkout}>
                            Go To Checkout
                          </Button>
                        )
                      : <Spinner />
                    : (
                      <Button type="submit" className={classes.checkout}>
                        Create Order
                      </Button>
                    )
                  }
                </form>
              
              </div>
              <div className={classes.order}>
                <h2>Total Amount</h2>
                <span className={classes.totalPrice}>{cartTotal ? formatter.format(cartTotal) : 0}</span>
              </div>
            </div>
          )
          :
          <h2 style={{textAlign: 'center', fontSize: 30}}>Your cart is empty!</h2>
        }
      </Container>
      <PayPalModal loading={!paypalSDK} open={openPayPalMpdal && Object.keys(errors).length === 0} handleClose={handlePayPalModalClose}>
        <div className={classes.paypalButton}>
          {
            paypalSDK ?
            <PayPalButton
              shippingPreference="NO_SHIPPING"
              amount={cartTotal}
              onSuccess={successPaymentHandler}
              onError={failurePaymentHandler}
            />
            :
            <Spinner />
          }
          
        </div>
      </PayPalModal>
      <SnackBar errors={{...apiErrors, ...errors}}/>
    </section>
  );
};

export default Cart;