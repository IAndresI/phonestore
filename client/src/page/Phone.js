import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Layout from '../components/Layout'
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

const useStyles = makeStyles({
  media: {
    height: 400,
    backgroundSize: "contain !important"
  },
});

export default function Phone() {
  const phone = {id: 1, weight: 20, diagonal: 5, ram: 30, memory: 256, price: 1000, manufacturer_id: 1, name: "Iphone 12 Pro", color: "White", image: "7e8da54c-f815-42ba-b1f3-328c2fa24333.jpg"};
  const classes = useStyles();
  const imagePath=`http://localhost:5000/${phone.image}`
  const info = [["Вес", "weight"], ["Диагональ", "diagonal"], ["Оперативная память", "ram"], ["Внутренняя память", "memory"], ["Производитель", "manufacturer"], ["Цвет", "color"]]
  return (
    <Layout>
      <Grid>
        <CardMedia
          className={classes.media}
          image={imagePath}
          title="Contemplative Reptile"
        />
      </Grid>
      <Button 
        variant="contained"
        color="primary"
        size="large"
        endIcon={<AddShoppingCartIcon>Add To Cart</AddShoppingCartIcon>}>Add To Cart</Button>
      <h1>{phone.name}</h1>
      <Typography>Характеристики:</Typography>
      <Grid>
        {
          info.map((e, i) => (
            <Grid key={e} style={{backgroundColor: i % 2 === 0 ? "lightgray" : "transparent", padding: 10}}>
              {e[0]}:{phone[e[1]]}
            </Grid>
          ))
        }
      </Grid>
    </Layout>
  );
}