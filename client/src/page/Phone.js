import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Container, Grid } from '@material-ui/core';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { useParams } from 'react-router-dom';
import { getOnePhones } from '../http/phoneAPI';
import { useDispatch, useSelector } from 'react-redux';
import { onAddedToCart } from '../store/actions';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const useStyles = makeStyles({
  media: {
    height: 400,
    backgroundSize: "contain !important"
  },
});

export default function Phone() {
  //const phone = {id: 1, weight: 20, diagonal: 5, ram: 30, memory: 256, price: 1000, manufacturer_id: 1, name: "Iphone 12 Pro", color: "White", image: "7e8da54c-f815-42ba-b1f3-328c2fa24333.jpg"};
  const classes = useStyles();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const {id} = useParams();

  const dispatch = useDispatch();
  const cartList = useSelector(state => state.cart.cartList);

  const isInCart = cartList.find(e => e.phone_id === phone?.phone_id);

  const imagePath=`http://localhost:5000/${phone?.image ? phone?.image : "phone.jpg"}`
  const info = [["Weight", "weight"], ["Diagonal", "diagonal"], ["RAM", "ram"], ["ROM", "memory"], ["Manufacturer", "manufacturer"], ["Camera", "camera"]]
  useEffect(() => {
    getOnePhones(id).then(data => {
      setPhone(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <CircularProgress style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0}}/>

  return (
    <section>
      <h1 className="title mini">{phone.name}</h1>
      <Container>
        <Grid>
          <CardMedia
            className={classes.media}
            image={imagePath}
            title={phone.name}
          />
        </Grid>
        <Button
          onClick={() => {
            dispatch(onAddedToCart(phone.phone_id));
          }}
          style={{backgroundColor: isInCart ? "green" : "", marginBottom: 30}}
          variant="contained"
          color="primary"
          size="large"
          endIcon={isInCart ? <ShoppingCartIcon>Already In Cart</ShoppingCartIcon> : <AddShoppingCartIcon>Add To Cart</AddShoppingCartIcon>}>{isInCart ? "Already In Cart" : "Add To Cart"}</Button>
        <Typography style={{marginBottom: 30, fontSize: 20, fontWeight: 700}}>Характеристики:</Typography>
        <Grid>
          {
            info.map((e, i) => (
              <Grid key={e} style={{backgroundColor: i % 2 === 0 ? "lightgray" : "transparent", padding: 10}}>
                <strong>{e[0]}</strong>:    {Array.isArray(phone[e[1]]) ? phone[e[1]].join("x") : phone[e[1]]}
              </Grid>
            ))
          }
        </Grid>
      </Container>
    </section>
  );
}