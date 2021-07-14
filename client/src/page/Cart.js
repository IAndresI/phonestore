import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { onAddCartTotal, onChangeCartItem, setPaymentMethod } from '../store/actions';
import { Button, Container, FormControlLabel, makeStyles, Radio, RadioGroup, TextField } from '@material-ui/core';
import {Link} from 'react-router-dom';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { CHECKOUT_ROUTE } from '../utils/consts';
import Map from '../components/cart/Map';
import {getLocations, getPaymentMethod} from '../http/cartAPI'
import PickupPointSelect from '../components/cart/PickupPointSelect';
import Spinner from '../components/Spinner';
import UserAddress from '../components/cart/UserAddressSelect';

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
    borderRadius: 10,
    padding: '15px 30px',
    color: "#ffffff",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    textDecoration: 'none',
    textTransform: "none",
    border: '1px solid #3f51b5',
    "&:hover, &:focus": {
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
  deliveryInfo: {
    display: "flex",
    justifyContent: "space-between",
  },
  deliveryInfoItem: {
    margin: "0 10px",
    "&:first-child": {
      marginLeft: 0
    },
    "&:last-child": {
      marginRight: 0
    }
  },
  delivery: {
    width: '100%'
  },
  paymentMethod: {
    width: '100%'
  }
}));

const Cart = () => {

  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.cartList, shallowEqual)
  const cartTotal = useSelector(state => state.cart.totalPrice)
  const cartPoint = useSelector(state => state.cart.pickupPoint, shallowEqual)
  const cartPaymentMethod = useSelector(state => state.cart.paymentMethod)
  const deliveryAddress = useSelector(state => state.cart.deliveryAddress, shallowEqual)

  const [pickupPoints, setPickupPoints] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true)

  const [wayToGet, setWayToGet] = useState('point');

  const classes = useStyles();

  const getCartData = async () => {
    getLocations().then(data => {
      setPickupPoints(data)
    })
    getPaymentMethod().then(data => {
      setPaymentMethods(data)
      dispatch(setPaymentMethod(data[0].method_id))
    })
  }

  useEffect(() => {
    setLoading(true);
    getCartData().then(() => setLoading(false))
  }, [])

  const paymentMathodHandleChange = (event) => {
    dispatch(setPaymentMethod(event.target.value))
  };

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

  const countChange = (e, id) => {
    const count = e.target.value;
    dispatch(onChangeCartItem({phone_id: id, count}))
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

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
                <h2>Choose A Way To Get</h2>
                <RadioGroup className={classes.wayToGet} aria-label="Way To Get" name="wayToGet" value={wayToGet} onChange={wayToGetHandleChange}>
                  <FormControlLabel className={classes.wayToGetItem} style={{borderRight: '1px solid rgba(0, 0, 0, 0.23)'}} value="point" control={<Radio classes={{checked: classes.radio}} />} label={<WayToGetLabel name="Pickup Point" price="Free"/>}/>
                  <FormControlLabel className={classes.wayToGetItem} value="delivery" control={<Radio classes={{checked: classes.radio}} />} label={<WayToGetLabel name="Courier Delivery" price="$4.00"/>} />
                </RadioGroup>
                {
                  wayToGet==="point" ? 
                  (
                    <>
                      <PickupPointSelect defaultPoint={cartPoint} pickupPoints={pickupPoints}/>
                      <Map defaultPoint={cartPoint} selectedPointCoordinates={{lat:cartPoint?.coordinates[0] || 59.869464, lng:cartPoint?.coordinates[1] || 30.34734}} pickupPoints={pickupPoints}/>
                    </> 
                  )
                  :
                  (
                    <div className={classes.delivery}>
                      <UserAddress defaultAddress={deliveryAddress} />
                      <div className={classes.deliveryInfo}>
                        <TextField
                          className={classes.deliveryInfoItem}
                          required
                          id="outlined-required"
                          label="Room"
                          placeholder="Enter Room"
                          variant="outlined"
                        />
                        <TextField
                          className={classes.deliveryInfoItem}
                          id="outlined-required"
                          label="Entrance"
                          placeholder="Enter Entrance"
                          variant="outlined"
                        />
                        <TextField
                          className={classes.deliveryInfoItem}
                          id="outlined-required"
                          label="Floor"
                          placeholder="Enter Floor"
                          variant="outlined"
                        />
                      </div>
                    </div>
                  )
                }
                <h2>Choose A Payment Method</h2>
                <RadioGroup className={classes.paymentMethod} aria-label="gender" name="gender1" value={+cartPaymentMethod} onChange={paymentMathodHandleChange}>
                  {
                    paymentMethods.map(method => <FormControlLabel key={method.method_id} value={method.method_id} control={<Radio classes={{checked: classes.radio}} />} label={method.name} />)
                  }
                </RadioGroup>
              </div>
              <div className={classes.order}>
                <h2>Total Amount</h2>
                <span className={classes.totalPrice}>{cartTotal ? formatter.format(cartTotal) : 0}</span>
                <Link to={CHECKOUT_ROUTE} className={classes.checkout}>
                  Go To Checkout
                </Link>
              </div>
            </div>
          )
          :
          <h2 style={{textAlign: 'center', fontSize: 30}}>Your cart is empty!</h2>
        }
      </Container>
    </section>
  );
};

export default Cart;
