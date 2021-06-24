import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../http/cartAPI';
import Layout from '../components/Layout';
import { fetchingCart } from '../store/actions';


const Cart = () => {

  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.cartList)
  const cartId = useSelector(state => state.user.user.cart_id)

  useEffect(() => {
    console.log(cartItems);
    getCart(cartId).then(data => {
      dispatch(fetchingCart(data))
    })
  }, [])

  return (
    <section>
      {JSON.stringify(cartItems)}
    </section>
  );
};

export default Cart;