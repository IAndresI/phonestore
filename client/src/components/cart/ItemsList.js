import React from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {Link} from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import {onChangeCartItem } from '../../store/actions';
import { useDispatch } from 'react-redux';

const ItemsList = ({cartItems, classes}) => {

  // Dispatch

  const dispatch = useDispatch()

  // Change Phone In Cart Count

  const countChange = (e, id, colorId) => {
    const count = e.target.value;
    dispatch(onChangeCartItem({phone_id: id, count, selectedColor:colorId}))
  }

  return (
    <>
      {
        cartItems.map(item => {
          const imagePath = `${process.env.REACT_APP_API_URL}/${item.image ? item.image : "phone.jpg"}`
          return (
            <div key={item.phone_id} className={classes.item} >
              <Button 
                onClick={() => countChange({target:{value: -1}}, item.phone_id, item.selectedColor)}
                className={classes.removeButton}>
                <HighlightOffIcon />
              </Button>
              <div className={classes.className}>
                <Link to={`/phone/${item.phone_id}`} className={classes.imageContainer}>
                  <img className={classes.image} alt={item.name} height="42" width="42" src={imagePath} />
                </Link>
                <div>
                  <Link className={classes.nameContainer} to={`/phone/${item.phone_id}`}><h3 className={classes.name}>{item.name}</h3></Link>
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
                  onChange={(e) => countChange(e, item.phone_id)}
                  id={`outlined-from-input-${item.phone_id}`}
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
      
    </>
  );
};

export default ItemsList;