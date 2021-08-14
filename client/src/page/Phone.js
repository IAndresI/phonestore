import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {  Container, Grid } from '@material-ui/core';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { useHistory, useParams } from 'react-router-dom';
import { getOnePhones } from '../http/phoneAPI';
import { useDispatch, useSelector } from 'react-redux';
import { addCompareItem, removeCompareItem, onChangeCartItem } from '../store/actions';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CompareIcon from '@material-ui/icons/Compare';
import { usePageDataLoad } from '../customHooks';
import Spinner from '../components/Spinner';
import ColorPicker from '../components/ColorPicker';
import Tab from '../components/phone/tabs';

const useStyles = makeStyles({
  media: {
    height: 400,
    backgroundSize: "contain !important",
    marginBottom: 30
  },
});

export default function Phone(props) {

  const classes = useStyles();

  const history = useHistory();

  const {id} = useParams();
  const {selectedColor} = history.location.state || false;

  const [phone, setPhone, loading, error] = usePageDataLoad(() => getOnePhones(id), null)

  const dispatch = useDispatch();
  const cartList = useSelector(state => state.cart.cartList);
  const compareList = useSelector(state => state.compare.items);

  const [color, setColor] = useState(null)

  useEffect(() => {
    setColor(selectedColor || phone?.colors ? {id: phone?.colors[0][0], name: phone?.colors[0][1], code: phone?.colors[0][2]} : false)
  }, [phone?.colors])

  const inCart = cartList.find(e => e.phone_id===phone?.phone_id && (color?.id ? e.selectedColor?.id === color?.id : true))
  const isInCompare = compareList.find(e => +e === phone?.phone_id);

  const removeFromCart = (phone) => dispatch(onChangeCartItem({
    ...phone,
    count: -1
  }))

  const imagePath=`http://localhost:5000/${phone?.image ? phone?.image : "phone.jpg"}`
  const info = [["Weight", "weight"], ["Diagonal", "diagonal"], ["RAM", "ram"], ["ROM", "memory"], ["Manufacturer", "manufacturer"], ["Camera", "camera"]]

  if (loading) return <Spinner style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0}}/>

  if (error) return <h3>Theres an error: {error.message}</h3>

  return (
    <section className="section page">
      <h1 className="title mini">{phone.name}</h1>
      <Container>
        <Grid>
          <CardMedia
            className={classes.media}
            image={imagePath}
            title={phone.name}
          />
        </Grid>
        {
          inCart ? 
          (
            <Button
            onClick={() => {
              removeFromCart({phone_id: phone.phone_id, name: phone.name, price: phone.price, image: phone.image, selectedColor:color});
            }}
            style={{backgroundColor:"tomato", marginBottom: 30, marginRight: 30}}
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ShoppingCartIcon/>}>
              Remove From Cart
            </Button>
          )
          :
          (
            <Button
            onClick={() => {
              dispatch(onChangeCartItem({phone_id: phone.phone_id, name: phone.name, price: phone.price, image: phone.image, selectedColor: color}));
            }}
            style={{marginBottom: 30, marginRight: 30}}
            variant="contained"
            color="primary"
            size="large"
            endIcon={<AddShoppingCartIcon>Add To Cart</AddShoppingCartIcon>}>
              Add To Cart
            </Button>
          )
        }

        {
          isInCompare ?
          (
            <Button
              onClick={() => {
                dispatch(removeCompareItem(phone.phone_id));
              }}
              style={{backgroundColor: "tomato", marginBottom: 30}}
              variant="contained"
              color="primary"
              size="large"
              endIcon={<CompareIcon/>}>
                Remove From Compare
            </Button>
          )
          :
          (
            <Button
              onClick={() => {
                dispatch(addCompareItem(phone.phone_id));
              }}
              style={{marginBottom: 30}}
              variant="contained"
              color="primary"
              size="large"
              endIcon={<CompareIcon/>}>
                Add To Compare
            </Button>
          )
        }
        {
          color ? (
            <>
              <Typography style={{marginBottom: 30, fontSize: 20, fontWeight: 700}}>Select Color:</Typography>
              <ColorPicker colors={phone.colors} currentColor={color} setColor={setColor}/>
            </>
          ) : null
        }
        <Tab characteristics={{info, phone}}/>
      </Container>
    </section>
  );
}