import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Grid } from '@material-ui/core';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Layout from '../components/Layout'
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { useParams } from 'react-router-dom';
import { getOnePhones } from '../http/phoneAPI';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
  media: {
    height: 400,
    backgroundSize: "contain !important"
  },
});

export default function Phone() {
  //const phone = {id: 1, weight: 20, diagonal: 5, ram: 30, memory: 256, price: 1000, manufacturer_id: 1, name: "Iphone 12 Pro", color: "White", image: "7e8da54c-f815-42ba-b1f3-328c2fa24333.jpg"};
  const classes = useStyles();
  const manufacturerList = useSelector(state => state.phone.manufacturer)
  const [phone, setPhone] = useState(null)
  const [loading, setLoading] = useState(true)
  const {id} = useParams()
  const imagePath=`http://localhost:5000/${phone?.image ? phone?.image : "phone.jpg"}`
  const info = [["Вес", "weight"], ["Диагональ", "diagonal"], ["Оперативная память", "ram"], ["Внутренняя память", "memory"], ["Производитель", "manufacturer_id"], ["Цвет", "color"]]
  useEffect(() => {
    getOnePhones(id).then(data => {
      setPhone(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <CircularProgress style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0}}/>

  return (
    <Layout>
      <Grid>
        <CardMedia
          className={classes.media}
          image={imagePath}
          title={phone.name}
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
              {e[0]}:   {e[1] === "manufacturer_id" ? manufacturerList.find(el => el.manufacturer_id === phone[e[1]]).name : phone[e[1]]}
            </Grid>
          ))
        }
      </Grid>
    </Layout>
  );
}