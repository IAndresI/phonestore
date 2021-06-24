import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Checkbox, Slider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchingColor, onColorChange, onManufacturerChange, onPageSet, onPriceChange } from '../store/actions';
import { getAllColor, getMinMaxPirce } from '../http/phoneAPI';

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
  const [minMaxPrice, setMinMaxPrice] = useState([0, 10000000]);
  const [colorList, setColorList] = useState([]);
  const [checkedManufacturer, setCheckedManufacturer] = useState([]);
  const [checkedColor, setCheckedColor] = useState([]);

  const classes = useStyles();
  const [price, setPrice] = useState([0, 10000000]);

  const handleChange = (event, newValue) => {
    setPrice(newValue);
    dispatch(onPriceChange(newValue))
    dispatch(onPageSet(1))
  };

  const handleToggle = (value, state, changeState, action, type) => () => {
    const previewCurrentIndex = type ==="man" ? currentFilter.manufacturer : currentFilter.color
    const currentIndex = previewCurrentIndex.indexOf(value) || state.indexOf(value);
    const preview = type ==="man" ? [...currentFilter.manufacturer] : [...currentFilter.color]
    const newChecked = preview || [...state];
    if (currentIndex === -1) {
      newChecked.push(value);
      dispatch(action(newChecked));
    } else {
      newChecked.splice(currentIndex, 1);
      dispatch(action(newChecked));
    }
    changeState(newChecked);
    dispatch(onPageSet(1))
  };

  useEffect(() => {
    getMinMaxPirce().then(({min, max}) => {
      const minMax = [parseInt(min.slice(1, min.length).replace(",","")),parseInt(max.slice(1, max.length).replace(",",""))]
      setMinMaxPrice(minMax);
      dispatch(onPriceChange(minMax))
    });
    getAllColor().then((colors) => {
      setColorList(colors);
      dispatch(fetchingColor(colors))
    });
  }, []);


  return (
    <div className={classes.root}>
      <h2>Price</h2>
      <Slider
        value={price || currentFilter.price}
        max={minMaxPrice[1]}
        min={minMaxPrice[0]}
        step={100}
        className={classes.range}
        onChange={handleChange}
        valueLabelDisplay="on"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
      <Divider />
      <List multiple component="nav" aria-label="manyfacturer filter">
        <h2>Manufacturer</h2>
        {
          manufacturer.map(e => {
            const labelId = `checkbox-list-label-${e.name}`;
            return (
              <ListItem key={e.name} role={undefined} dense button onClick={handleToggle(e.manufacturer_id, checkedManufacturer, setCheckedManufacturer, onManufacturerChange, "man")}>
                <Checkbox
                  edge="start"
                  checked={checkedManufacturer.indexOf(e.manufacturer_id) !== -1 || currentFilter.manufacturer.includes(e.manufacturer_id)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
                <ListItemText id={labelId} primary={e.name} />
              </ListItem>
            )
          })
        }
      </List>
      <Divider />
      <List multiple component="nav" aria-label="colors filter">
        <h2>Colors</h2>
        {
          colorList.map(e => {
            const labelId = `checkbox-list-label-${e.name}`;
            return (
              <ListItem key={e.name} dense button onClick={handleToggle(e.color_id, checkedColor, setCheckedColor, onColorChange, "col")}>
                <Checkbox
                  edge="start"
                  checked={checkedColor.indexOf(e.color_id) !== -1 || currentFilter.color.includes(e.color_id)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
                <ListItemText id={labelId} primary={e.name} />
              </ListItem>
            )
          })
        }
      </List>
      <Divider />
    </div>
  );
}

export default Filter;