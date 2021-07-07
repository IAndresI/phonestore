import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAddedToCart } from '../store/actions';
import { Button, Container, makeStyles, TextField } from '@material-ui/core';
import {Link} from 'react-router-dom';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

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
    padding: '10px 30px',
    color: "#ffffff",
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
  }
}));

const Cart = () => {

  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.cartList)
  const cartTotal = useSelector(state => state.cart.totalPrice)
  const cartId = useSelector(state => state.user.user.cart_id)
  
  const classes = useStyles();

  const countChange = (e, id) => {
    const count = e.target.value;
    dispatch(onAddedToCart({phone_id: id, count}))
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <section className="section">
      <h1 className="title">Cart</h1>
      <Container>
        {
          cartItems.length > 0 ? 
          (
            <div className={classes.container}>
              <div className={classes.info}>
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
                            <img className={classes.image} alt={item.phone_name} height="42" width="42" src={imagePath} />
                          </Link>
                          <div>
                            <Link className={classes.name} to={`/phone/${item.phone_id}`}><h3>{item.phone_name}</h3></Link>
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
              </div>
              <div className={classes.order}>
                <h2>Total Amount</h2>
                <span className={classes.totalPrice}>{cartTotal ? formatter.format(cartTotal) : 0}</span>
                <Button className={classes.checkout}>
                  Go To Checkout
                </Button>
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
