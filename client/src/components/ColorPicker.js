import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Spinner from './Spinner';

const ColorPicker = ({colors, currentColor, setColor}) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '10%',
      marginBottom: 30
    },
    color: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      marginLeft: 10,
      border: "1px solid black",
      display: "inline-block"
    }
  }));

  const classes = useStyles();

  if(!colors) return <Spinner />

  return (
    <div>
      <InputLabel id="color-picker-label">Color</InputLabel>
      <Select
        className={classes.root}
        labelId="color-picker-label"
        id="color-picker"
        value={currentColor.id}
      >
        {
          colors.map(e => <MenuItem key={e[0]} onClick={() => setColor({id: e[0],name: e[1], code: e[2]})} value={+e[0]}>{e[1]}<span className={classes.color} style={{backgroundColor: e[2]}}></span></MenuItem>)
        }
      </Select>
    </div>
  );
};

export default ColorPicker;