import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  radioContainer: {
    display: 'flex',
    marginBottom: 10
  },
  radio: {
    color: '#000000',
    cursor: 'pointer',
    appearance: "none",
    '&:focus +label': {
      transform: "scale(1.1)"
    },
    '&:hover +label': {
      transform: "scale(1.1)"
    },
    "&:active": {
      transform: "scale(1)"
    }
  },
  radioLabel: {
    width: 22,
    height: 22,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: "50%",
    overflow: "hidden",
    border: "1px solid black",
    transition: "all .5s",
    cursor: 'pointer',
    "&:last-child": {
      marginRight: 0
    },
    
  },
  radioCheck: {
    width: "70%",
    height: "70%",
    display: 'block',
    borderRadius: "50%",
    margin: 0,
    transition: "all .5s",
    border: "1px solid grey",
  },
  radioIsChecked: {
    borderColor: '#000000'
  },
  radioNotChecked: {
    borderColor: 'transparent'
  }
});

export default function MiniColorPicker({colors, selected, setSelected, id}) {

  const classes = useStyles();

  return (
    <div className={classes.radioContainer}>
      {
        colors.map(e => {
          if (e[3] != 0) {
            return (
              <span key={id+e[0]}>
                <input
                  checked={e[1] === selected.name}
                  className={classes.radio}
                  onChange={() => setSelected({id:e[0],name:e[1],code: e[2]})}
                  name={id}
                  id={id+e[0]}
                  value={e[1]}
                  type="radio"
                />
                <label className={`${classes.radioLabel} ${e[0] === selected.id ? classes.radioIsChecked : classes.radioNotChecked}`} htmlFor={id+e[0]}>
                  <div className={classes.radioCheck} style={{backgroundColor: e[2]}}></div>
                </label>
              </span>
            )
          }
        })
      }
    </div>
  );
}