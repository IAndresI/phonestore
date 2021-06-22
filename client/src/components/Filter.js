import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Slider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { onManufacturerChange, onPriceChange } from '../store/actions';
import { getMaximumPrice } from '../http/phoneAPI';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
  range: {
    paddingTop: "40px"
  },
  selected: {
    backgroundColor: "#0d6efd !important",
    color: "#ffffff"
  }
});

function valuetext(value) {
  return `${value}°C`;
}


const Filter = ({manufacturer}) => {
  const dispatch = useDispatch();
  const currentFilter = useSelector(state => state.filter)
  const [maximumPrice, setMaximumPrice] = useState(400000)

  const classes = useStyles();
  const [selectedManufacturer, setSelectedManufacturer] = React.useState(null);
  const [price, setPrice] = React.useState([0, 400000]);

  const handleChange = (event, newValue) => {
    setPrice(newValue);
    dispatch(onPriceChange(newValue))
  };

  const handleListItemClick = (event, id) => {
    setSelectedManufacturer(id);
    dispatch(onManufacturerChange(id));
  };

  useEffect(() => {
    // getMaximumPrice().then(data => {
    //   setMaximumPrice(data)
    // })
  }, [])

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="secondary mailbox folder">
        <h2>Производитель</h2>
        {
          manufacturer.map(e => (
            <ListItem
              key={e.id}
              style={{borderRadius: "10px"}}
              classes={{
                selected: classes.selected
              }}
              button
              selected={e.manufacturer_id === currentFilter.manufacturer}
              onClick={(event) => handleListItemClick(event, e.manufacturer_id)}
            >
              <ListItemText primary={e.name} />
            </ListItem>
          ))
        }
      </List>
      <Divider />
      <h2>Price</h2>
      <Slider
        value={currentFilter.price || price}
        max={maximumPrice}
        className={classes.range}
        onChange={handleChange}
        valueLabelDisplay="on"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}

export default Filter;