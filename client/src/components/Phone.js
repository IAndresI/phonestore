import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {Link, useParams } from 'react-router-dom'
import { PHONE_ROUTE } from '../utils/consts';
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { onChangeCartItem } from '../store/actions';
import MiniColorPicker from './MiniColorPicker'

const useStyles = makeStyles({
  root: {
    maxWidth: 265,
    width: "100%",
    margin: "15px 15px",
    padding: "10px 0 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  media: {
    height: 200,
    backgroundSize: "contain !important",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    '&:hover': {
      transform: "scale(1.1)"
    }
  },
  name: {
    fontSize: 20,
    display: "-webkit-box",
    "-webkit-box-orient": "vertical",
    lineClamp: 2,
    overflow: "hidden",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  btn: {
    backgroundColor: "#3f51b5",
    color: "#ffffff",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    border: "1px solid #3f51b5",
    textTransform: 'none',
    "&:hover, &:focus": {
      color: "#3f51b5",
      backgroundColor: "#ffffff",
    },
    "&:active": {
      color: "#ffffff",
      backgroundColor: "#3f51b5",
    }
  },
  btnInCart: {
    backgroundColor: "green",
    color: "#ffffff",
    border: "1px solid green",
    textTransform: 'none',
    "&:hover, &:focus": {
      color: "green",
      backgroundColor: "#ffffff",
    },
    "&:active": {
      color: "#ffffff",
      backgroundColor: "green",
    }
  },
  name_link: {
    textDecoration: 'none',
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    color: "inherit",
    '&:hover,&:focus': {
      color: "#3f51b5"
    },
    '&:active': {
      color: "inherit"
    }
  },
  price: {
    color: "black",
    fontSize: 16,
    fontWeight: 600
  },
  colors: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

export default function Phone({phone}) {

  const {image, phone_name: name, price, manufacturer_name, phone_id, phone_colors} = phone
  const dispatch = useDispatch()
  const classes = useStyles();

  const [selectedColor, setSelectedColor] = useState(phone_colors ? {id: phone_colors[0][0], name: phone_colors[0][1]} : -1)

  // phones in cart

  const phonesInCart = useSelector(state => state.cart.cartList);
  const inCart=phonesInCart.find(e => e.phone_id===phone_id && (selectedColor.id ? e.selectedColor.id === selectedColor.id : true))

  const imagePath = `${process.env.REACT_APP_API_URL}/${image ? image : "phone.jpg"}`
  const addToCart = () => dispatch(onChangeCartItem({
    phone_id,
    name,
    price,
    image,
    selectedColor
  }))

  const removeFromCart = () => dispatch(onChangeCartItem({
    phone_id,
    name,
    price,
    image,
    selectedColor,
    count: -1
  }))


  const phoneLink = {
    pathname: `${PHONE_ROUTE}/${phone_id}`,
    state: { selectedColor }
  }

  return (
    <Card className={classes.root}>
      <Link to={phoneLink}>
        <CardMedia
          width={300}
          height={300}
          className={classes.media}
          image={imagePath}
          title={name}
        />
      </Link>
      <CardContent>
        <Link className={classes.name_link} to={phoneLink}>
          <Typography className={classes.name} gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
        </Link>
        <Typography variant="body2" color="textSecondary" component="p">
          {manufacturer_name}
        </Typography>
        {
          phone_colors ? 
          <div className={classes.colors}>
            <Typography variant="body2" color="textSecondary" component="p">
              Colors:
            </Typography>
            <MiniColorPicker id={phone_id} colors={phone_colors} selected={selectedColor} setSelected={setSelectedColor}/>
          </div>
          :
          null
        }
        <div className={classes.footer}>
          <Typography className={classes.price} variant="body2" color="textSecondary" component="p">
            {price}
          </Typography>
          {
            inCart ? 
            (
              <Button onClick={removeFromCart} className={classes.btnInCart}>
                Already In Cart
              </Button>
            )
            :
            (
              <Button onClick={addToCart} className={classes.btn}>
                Add To Cart
              </Button>
            )
          }
          
        </div>
      </CardContent>
    </Card>
  );
}