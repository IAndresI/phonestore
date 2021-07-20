import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAddCartTotal, onChangeCartItem, setPaymentMethod } from '../store/actions';
import { Button, Container, Fade, FormControlLabel, makeStyles, Radio, RadioGroup, TextField, Snackbar } from '@material-ui/core';
import {Link} from 'react-router-dom';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Map from '../components/cart/Map';
import {addPayPal, getLocations, getPaymentMethod} from '../http/cartAPI'
import PickupPointSelect from '../components/cart/PickupPointSelect';
import Spinner from '../components/Spinner';
import UserAddressSelect from '../components/cart/UserAddressSelect';
import { PayPalButton } from "react-paypal-button-v2";
import { Controller, useForm } from 'react-hook-form';
import MuiAlert from '@material-ui/lab/Alert';
import PayPalModal from '../components/cart/PayPalModal';
import {createUnregistredUserOrder, createRegistredUserOrder} from '../http/orderAPI'

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  imageContainer: {
    height: 120,
    width: 120,
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    overflow: 'hidden',
    marginRight: 20
  },
  name: {
    textDecoration: 'none',
    color: 'black',
    transition: 'all 0.5s',
    '&:hover,&:focus': {
      color: "#3f51b5"
    },
    '&:active': {
      color: "inherit"
    }
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transform: "scale(0.9)",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    '&:hover': {
      transform: "scale(1)"
    },
  },
  item: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    borderRadius: '15px',
    marginBottom: 15,
    padding: "10px 20px",
    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    backgroundColor: "#ffffff",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    '&:hover': {
      background: "#fafafa",
      transform: "translateY(-2px)"
    },
  },
  info: {
    display: 'flex',
    width: '70%',
    alignItems: 'center',
    flexDirection: 'column',
    marginRight: 50
  },
  order: {
    marginTop: 72,
    position: "sticky",
    top: 30,
    width: '30%',
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: '15px',
    padding: 20,
    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  count: {
    width: '70px',
  },
  className: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  checkout: {
    backgroundColor: "#3f51b5",
    width: '100%',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 500,
    padding: '15px 30px',
    color: "#ffffff",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    textDecoration: 'none',
    textTransform: "none",
    border: '1px solid #3f51b5',
    "&:hover, &:focus": {
      outline: "transparent",
      color: "#3f51b5",
      backgroundColor: "#ffffff",
    },
    "&:active": {
      color: "#ffffff",
      backgroundColor: "#3f51b5",
    }
  },
  totalPrice: {
    fontSize: 25,
    color: "#000000",
    fontWeight: 700,
    marginBottom: 25
  },
  removeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    borderRadius: "0 10px 0 0",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    "&:hover, &:focus": {
      color: "red",
    },
    "&:active": {
      color: "black",
    }
  },
  wayToGet: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 30
  },
  wayToGetItem: {
    width: "50%",
    display: "flex",
    alignItems: "flex-start",
    marginRight: 0,
    justifyContent: "center",
    padding: "40px 0",
  },
  wayToGetLabel: {
    display: "flex",
    flexDirection: "column",
  },
  wayToGetName: {
    fontWeight: 500,
    fontSize: 20,
    marginBottom: 5,
    paddingTop: 6.5
  },
  radio: {
    color: "#3f51b5 !important",
  },
  map: {
    height: 400,
    width: '100%'
  },
  paymentMethod: {
    width: '100%',
    marginBottom: 30
  },
  paypalButton: {
    width: '100%',
  },
  userData: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%'
  },
  userDataInput: {
    width: '100%',
    marginBottom: 30
  },
  form: {
    width: '100%'
  }
}));

const Cart = () => {

  const dispatch = useDispatch()

  // Cart Info

  const cartItems = useSelector(state => state.cart.cartList)
  const cartTotal = useSelector(state => state.cart.totalPrice)
  const cartPaymentMethod = useSelector(state => state.cart.paymentMethod)
  const cartPickupPoint = useSelector(state => state.cart.pickupPoint)

  // User Info

  const isAuth = useSelector(state => state.user.isAuth)
  const user = useSelector(state => state.user.user)

  // Inputs

  const [pickupPoints, setPickupPoints] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [wayToGet, setWayToGet] = useState('pickupPoint');

  // Loading Scripts And Queries

  const [loading, setLoading] = useState(true)
  const [paypalSDK, setPaypalSDK] = useState(!!document.querySelector('#paypal-button'))
  const [googleSDK, setGoogleSDK] = useState(!!document.querySelector('#googlemaps'))

  // Snack Bar control

  const [snackBar, setSnackBar] = useState({
    open: false,
    Transition: Fade,
  });

  const getErrorText = (errors) => {
    const errorType = Object.keys(errors).length !== 0 ? Object.entries(errors)[0][0] : null;

    switch (errorType) {
      case "first_name":
        return "Enter your first name!"
      case "last_name":
        return "Enter your last name!"
      case "email":
        return "Enter email!"
      case "deliveryAvenue":
        return "Enter correct delivery address!"
      case "room":
        return "Enter your room number!"
      case "pickupPoint":
        return "Enter pick-up point address!"
      default: return "";
    }
  }

  const snackBarHandleClick = (Transition) => () => {
    setSnackBar({
      open: true,
      Transition,
    });
  };

  const snackBarHandleClose = () => {
    setSnackBar({
      ...snackBar,
      open: false,
    });
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  // Form Controll

  const { control, getValues, handleSubmit, setValue, formState: { errors } } = useForm();

  const getFullData = async (formData, unregistred) => {
    if(unregistred) {
      const data = {
        dateOrderPaid: null, 
        ...formData,
        total: cartTotal,
        items: cartItems,
          
      }
      console.log(data);
      // return await createUnregistredUserOrder({
      //   dateOrderPaid: null, 
      //   total: 15000, 
      //   paymentMethod: 1, 
      //   pickupPoint: 2, 
      //   deliveryAddress: null,
      //   items: [[1,2],[2,3]]
      // },
      // {
      //   email: "Irina@mail.ru", 
      //   firstName: 'Irina', 
      //   lastName: 'Vanchenko', 
      //   phone: 89111233456
      // })
    }
    else {
      let clientAddress
      if(formData.deliveryAvenue) {
        const fragmentedAddress = formData.deliveryAvenue.split(',')
        const countryAndCity = fragmentedAddress.splice(fragmentedAddress.length - 2)
        clientAddress = `${fragmentedAddress.join(',')}, room ${formData.room},${countryAndCity.join(',')}`;
      }
      
      const data = {
        clientId: user.id,
        pickupPoint: pickupPoints.find(el => el.address===formData.pickupPoint).pickup_point_id || null,
        deliveryAddress: clientAddress || null,
        total: cartTotal,
        items: cartItems.map(e => [e.phone_id, e.count]),
        dateOrderPaid: null,
        paymentMethod: cartPaymentMethod,
      }
      console.log(data);
    }
  }

  const createOrder = async (data, e) => {
    e.preventDefault();
    
    if (cartPaymentMethod === 2) {
      setOpenPayPalMpdal(true);
    }
    else {
      if(isAuth) {
        getFullData(data, false)
      }
      else getFullData(data, true)
      // await createUnregistredUserOrder({
      //   dateOrderPaid: null, 
      //   total: 15000, 
      //   paymentMethod: 1, 
      //   pickupPoint: 2, 
      //   deliveryAddress: null,
      //   items: [[1,2],[2,3]]
      // },
      // {
      //   email: "Irina@mail.ru", 
      //   firstName: 'Irina', 
      //   lastName: 'Vanchenko', 
      //   phone: 89111233456
      // })
    }

  }

  // Material UI Styles

  const classes = useStyles();

  // Upload Data From Server

  const getCartData = async () => {
    getLocations().then(data => {
      setPickupPoints(data)
    })
    getPaymentMethod().then(data => {
      setPaymentMethods(data)
      dispatch(setPaymentMethod(data[0].method_id))
    })
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
    addGoogleAPIs();
  }

  // ComponentDidMount

  useEffect(() => {
    setLoading(true);
    getCartData().then(() => setLoading(false))
  }, [])

  //PayPal modal control

  const [openPayPalMpdal, setOpenPayPalMpdal] = useState(false);

  const handlePayPalModalClose = () => {
    setOpenPayPalMpdal(false);
  };

  // PayPal payment

  const successPaymentHandler = (details, data) => {
    alert("Transaction completed by " + details.payer.name.given_name);
    alert(data.orderID);
    console.log(details);
    console.log(data);
  }

  const failurePaymentHandler = (error) => {
    alert(error);
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
    if(event.target.value==="delivery") dispatch(onAddCartTotal(4))
    else dispatch(onAddCartTotal(-4))
  };

  // Change Phone In Cart Count

  const countChange = (e, id) => {
    const count = e.target.value;
    dispatch(onChangeCartItem({phone_id: id, count}))
  }

  // Format Price Data From DB

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Loading Indicator

  if(loading) return <Spinner />

  return (
    <section className="section">
      <h1 className="title">Cart</h1>
      <Container>
        {
          cartItems.length > 0 ? 
          (
            <div className={classes.container}>
              <div className={classes.info}>
                <h2>Items In Cart</h2>
                {
                  cartItems.map(item => {
                    const imagePath = `${process.env.REACT_APP_API_URL}/${item.image ? item.image : "phone.jpg"}`
                    return (
                      <div key={item.phone_id} className={classes.item} >
                        <Button 
                          onClick={() => countChange({target:{value: -1}}, item.phone_id)}
                          className={classes.removeButton}>
                          <HighlightOffIcon />
                        </Button>
                        <div className={classes.className}>
                          <Link to={`/phone/${item.phone_id}`} className={classes.imageContainer}>
                            <img className={classes.image} alt={item.name} height="42" width="42" src={imagePath} />
                          </Link>
                          <div>
                            <Link className={classes.name} to={`/phone/${item.phone_id}`}><h3>{item.name}</h3></Link>
                            <div className={classes.price}>{item.price}</div>
                          </div>

                        </div>
                        <div>
                          <TextField
                            className={classes.count}
                            onChange={(e) => countChange(e, item.phone_id)}
                            id="outlined-from-input"
                            type="number"
                            name="min"
                            defaultValue={item.count}
                            inputProps={{ max: 100, step: 1}}
                            variant="outlined"
                          />
                        </div>
                      </div>
                    )
                  })
                }
                <form className={classes.form} onSubmit={handleSubmit(createOrder)}>
                  {
                    !isAuth ? 
                    (
                      <>
                        <h2>Enter Your Details</h2>
                        <div className={classes.userData}>
                          <Controller
                            name="first_name"
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
                            name="last_name"
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
                      (
                        <Button type="submit" onClick={snackBarHandleClick(Fade)} className={classes.checkout}>
                          Go To Checkout
                        </Button>
                      ) 
                      : <Spinner />
                    : (
                      <Button type="submit" onClick={snackBarHandleClick(Fade)} className={classes.checkout}>
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
      {
        Object.keys(errors).length !== 0 ? 
        (
          <Snackbar
            open={snackBar.open}
            onClose={snackBarHandleClose}
            TransitionComponent={snackBar.Transition}
            key={snackBar.Transition.name}>
              <Alert severity="error">
                {getErrorText(errors)}
              </Alert>
          </Snackbar>
        )
        :
        null
      }
      <PayPalModal open={openPayPalMpdal} handleClose={handlePayPalModalClose}>
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
    </section>
  );
};

export default Cart;