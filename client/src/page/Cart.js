import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../http/cartAPI';
import { fetchingCart, onAddedToCart } from '../store/actions';
import { Container, makeStyles, TextField } from '@material-ui/core';
import {Link} from 'react-router-dom';

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
    overflow: 'hidden'
  },
  name: {
    textDecoration: 'none',
    color: 'black',
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
    backgroundColor: "#ffffff",
    borderRadius: '15px',
    padding: "10px 20px",
    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  },
  count: {
    width: '70px',
  },
  className: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

const Cart = () => {

  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.cartList)
  const cartTotal = useSelector(state => state.cart.totalPrice)
  const cartId = useSelector(state => state.user.user.cart_id)
  
  const classes = useStyles();

  const countChange = (e, id) => {
    const caount = e.target.value >= 0 ? e.target.value : 0;
    dispatch(onAddedToCart({phone_id: id, count: caount}))
  }

  return (
    <section className="section">
      <h1 className="title">Cart</h1>
      <Container>
        <div className={classes.container}>
          <div className={classes.info}>
            {
              cartItems.map(item => {
                const imagePath = `${process.env.REACT_APP_API_URL}/${item.image ? item.image : "phone.jpg"}`
                return (
                  <div className={classes.item} >
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
          </div>
          <div className={classes.order}>{cartTotal}</div>
        </div>
        
      </Container>
    </section>
  );
};

export default Cart;