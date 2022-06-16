import React from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {Link} from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import {onChangeCart } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { changeCart } from '../../http/cartAPI';

const ItemsList = ({cartItems, classes}) => {

  // Dispatch

  const dispatch = useDispatch()
  const cartId = useSelector((state) => state.user.user.cart_id);

  // Change Phone In Cart Count
  const countChange = async (e, phone) => {
    const count = e.target.value;
    if(count > 0) {
      if(cartId) {
        await changeCart(cartId, {phoneId: phone.phone_id, colorId: phone.selectedColor.id, actionType: 'change_item', count})
        .then(() => {
          dispatch(onChangeCart({
            phone_id: phone.phone_id,
            name: phone.name,
            price: phone.price,
            image: phone.image,
            selectedColor: phone.selectedColor,
            count
          }))
        })
      }
      else {
        dispatch(onChangeCart({
          phone_id: phone.phone_id,
          name: phone.name,
          price: phone.price,
          image: phone.image,
          selectedColor: phone.selectedColor,
          count
        }))
      }
      
    }
  }

  return (
    <>
      {
        cartItems.map(item => {
          const imagePath = `${process.env.REACT_APP_API_URL}/${item.image ? item.image : "phone.jpg"}`
          return (
            <div key={item.phone_id} className={classes.item} >
              <Button 
                onClick={async () => {
                  if(cartId) {
                    await changeCart(cartId, {phoneId: item.phone_id, colorId: item.selectedColor.id, actionType: 'remove_item'})
                    .then(() => {
                      dispatch(onChangeCart({
                        phone_id: item.phone_id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        selectedColor: item.selectedColor,
                        count: -1
                      }))
                    })
                  }
                  else {
                    dispatch(onChangeCart({
                      phone_id: item.phone_id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        selectedColor: item.selectedColor,
                        count: -1
                    }))
                  }
                }}
                className={classes.removeButton}>
                <HighlightOffIcon />
              </Button>
              <div className={classes.className}>
                <Link to={`/phone/${item.phone_id}`} className={classes.imageContainer}>
                  <img className={classes.image} alt={item.name} height="42" width="42" src={imagePath} />
                </Link>
                <div>
                  <Link className={classes.nameContainer} to={`/phone/${item.phone_id}`}><h3 className={classes.name}>{item.name}</h3></Link>
                  <span>{item.selectedColor.count} in stock</span>
                  {
                    item.selectedColor ? 
                    <div className={classes.color}><span className={classes.colorDot} style={{backgroundColor: item.selectedColor.code}}/>{item.selectedColor.name}</div>
                    :
                    null
                  }
                  <div className={classes.price}>{item.price}</div>
                  <div></div>
                </div>
          
              </div>
              <div>
                <TextField
                  className={classes.count}
                  onChange={(e) => countChange(e, item)}
                  id={`count-input-${item.phone_id}`}
                  type="number"
                  name="min"
                  defaultValue={item.count}
                  inputProps={{ max: item.selectedColor.count, step: 1, min: 1}}
                  variant="outlined"
                />
              </div>
            </div>
          )
        })
      }
      
    </>
  );
};

export default ItemsList;