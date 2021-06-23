import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Button, Slider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { onManufacturerChange, onPriceChange } from '../store/actions';
import { getMinMaxPirce } from '../http/phoneAPI';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
  range: {
    paddingTop: 60,
  },
  selected: {
    backgroundColor: "#0d6efd !important",
    color: "#ffffff"
  },
  submit_button: {
    width: '100%',
    borderWidth: 3,
    fontWeight: 500,
    fontSize: 20,
    marginTop: 30,
  }
});

function valuetext(value) {
  return `${value}°C`;
}


const Filter = ({manufacturer}) => {
  const dispatch = useDispatch();
  const currentFilter = useSelector(state => state.filter)
  const [minMaxPrice, setMinMaxPrice] = useState([0, 0]);

  const classes = useStyles();
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [price, setPrice] = useState([0, 10000000]);

  const handleChange = (event, newValue) => {
    setPrice(newValue);
    dispatch(onPriceChange(newValue))
  };

  const handleListItemClick = (event, id) => {
    setSelectedManufacturer(id);
    dispatch(onManufacturerChange(id));
  };

  useEffect(() => {
    getMinMaxPirce().then(({min, max}) => {
      setMinMaxPrice([parseInt(min.slice(1, min.length).replace(",","")),parseInt(max.slice(1, max.length).replace(",",""))]);
    })
  }, []);

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="secondary mailbox folder">
        <h2>Manufacturer</h2>
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
        max={minMaxPrice[1]}
        min={minMaxPrice[0]}
        step={100}
        className={classes.range}
        onChange={handleChange}
        valueLabelDisplay="on"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
      <Button className={classes.submit_button} variant="outlined" color="primary">
        Search
      </Button>
    </div>
  );
}

export default Filter;