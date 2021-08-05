import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Checkbox, Slider, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { onCameraCountChange, onColorChange, onDiagonalChange, onManufacturerChange, onPageSet, onPriceChange, onRamChange, onRomChange } from '../store/actions';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  },
  listItemContainer: {
    height: 200,
    overflowY: "auto"
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: "50%",
    border: '1px solid lightgrey',
    marginRight: 10
  },
  diagonalContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 20
  },
  accordionInner: {
    width: '100%'
  },
  button: {
    backgroundColor: "#3f51b5",
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 500,
    padding: '15px 30px',
    color: "#ffffff",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    textDecoration: 'none',
    textTransform: "none",
    border: '1px solid #3f51b5',
    "&:hover, &:focus": {
      outline: "transparent",
      color: "#3f51b5",
      backgroundColor: "#ffffff",
    },
    "&:active": {
      color: "#ffffff",
      backgroundColor: "#3f51b5",
    }
  }
});

const Filter = ({color, price: {min, max}, manufacturer, diagonal, camera, memory, ram}) => {

  // Store
  
  const dispatch = useDispatch();
  const currentFilter = useSelector(state => state.filter)

  // State

  const [firstRender, setFirstRender] = useState(true)
  
  // All Filtres Form DB

  const minMaxPriceFormatter = [parseInt(min.slice(1, min.length).replace(",","")),parseInt(max.slice(1, max.length).replace(",",""))]
  const minMaxDiagonalFormatter = [+diagonal.min, +diagonal.max]
  const ramFormatter = ram.map(e => e.ram);
  const romFormatter = memory.map(e => e.memory)

  // Data that user pick

  const [checkedManufacturer, setCheckedManufacturer] = useState([]);
  const [checkedColor, setCheckedColor] = useState([]);
  const [checkedPrice, setCheckedPrice] = useState([]);
  const [checkedDiagonal, setCheckedDiagonal] = useState([])
  const [checkedCamera, setCheckedCamera] = useState([]);
  const [checkedRam, setCheckedRam] = useState([]);
  const [checkedMemory, setCheckedMemory] = useState([]);

  // styles

  const classes = useStyles();

  const clearFilters = async () => {
    setCheckedManufacturer([])
    setCheckedColor([])
    setCheckedPrice([])
    setCheckedDiagonal([])
    setCheckedCamera([])
    setCheckedRam([])
    setCheckedMemory([])

    dispatch(onPriceChange(minMaxPriceFormatter));
    dispatch(onDiagonalChange([+diagonal.min, +diagonal.max]));
    dispatch(onColorChange([]));
    dispatch(onManufacturerChange([]));
    dispatch(onCameraCountChange([]));
    dispatch(onRamChange([]));
    dispatch(onRomChange([]));
    dispatch(onPageSet(1))
  }

  // Form Event Handlers

  const diagonalChange = (event) => {
    if(event.target.name==="min") {
      if(+event.target.value > minMaxDiagonalFormatter[1] || +event.target.value < minMaxDiagonalFormatter[0]) {
        setCheckedDiagonal([minMaxDiagonalFormatter[0], currentFilter.diagonal[1]])
        event.target.value=minMaxDiagonalFormatter[0].toFixed(2)
      }
      if(+event.target.value > checkedDiagonal[1]) {
        setCheckedDiagonal([+event.target.value, +event.target.value])
      }
      else setCheckedDiagonal([+event.target.value, currentFilter.diagonal[1]])
    }
    else {
      if(+event.target.value > minMaxDiagonalFormatter[1] || +event.target.value < minMaxDiagonalFormatter[0]) {
        setCheckedDiagonal([currentFilter.diagonal[0], minMaxDiagonalFormatter[1]])
        event.target.value=minMaxDiagonalFormatter[1].toFixed(2)
      }
      if(+event.target.value < checkedDiagonal[0]) {
        setCheckedDiagonal([+event.target.value, +event.target.value])
      }
      else setCheckedDiagonal([currentFilter.diagonal[0], +event.target.value])
    }
  }

  const handleCheckedPriceChange = (event, newValue) => {
    setCheckedPrice(newValue);
  };

  const handleCheckBoxToggle = (value, state, changeState, action, type) => () => {
    let previewCurrentIndex, currentIndex;
    switch (type) {
      case "man":
        previewCurrentIndex = currentFilter.manufacturer;
        break;
      case "col":
        previewCurrentIndex = currentFilter.color;
        break;
      case "cam":
        previewCurrentIndex = currentFilter.camera;
        break;
      case "ram":
        previewCurrentIndex = currentFilter.ram;
        break;
      case "mem":
        previewCurrentIndex = currentFilter.rom;
        break;
      default: break;
    }
    if (previewCurrentIndex.indexOf(value) !== -1) currentIndex = previewCurrentIndex.indexOf(value)
    else currentIndex=state.indexOf(value)
    const preview = [...previewCurrentIndex];
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

  // Dispatch Time Out

  const dispatchTimeOut = (actionCreator, checked, initial) => {
    return setTimeout(() => {
      dispatch(actionCreator(checked.length > 0 ? checked : initial))
      dispatch(onPageSet(1))
    }, 500);
  }

  useEffect(() => {
    if(!firstRender) {
      const timer = dispatchTimeOut(onPriceChange,checkedPrice,minMaxPriceFormatter);
      return () => {
        clearTimeout(timer)
      }
    }
    else setFirstRender(false)
  }, [checkedPrice, dispatch])

  useEffect(() => {
    if(!firstRender) {
      const timer = dispatchTimeOut(onDiagonalChange,checkedDiagonal,minMaxDiagonalFormatter);
      return () => {
        clearTimeout(timer)
      }
    }
    else setFirstRender(false)
  }, [checkedDiagonal, dispatch])

  // Component
  
  return (
    <div className={classes.root}>
      <button className={classes.button} onClick={() => clearFilters()}>Clear All Filtres</button>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h2 className={classes.heading}>Price</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.accordionInner}>
            <Slider
              value={checkedPrice.length > 0 ? checkedPrice : currentFilter.price.length> 0 ? currentFilter.price : minMaxPriceFormatter}
              max={minMaxPriceFormatter[1]}
              min={minMaxPriceFormatter[0]}
              step={100}
              className={classes.range}
              onChange={handleCheckedPriceChange}
              valueLabelDisplay="on"
              aria-labelledby="range-slider"
            />
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h2 className={classes.heading}>Manufacturer</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.accordionInner}>
            <List multiple component="nav" aria-label="manyfacturer filter">
              <div className={classes.listItemContainer}>
                {
                  manufacturer.map(e => {
                    const labelId = `checkbox-list-label-${e.name}`;
                    return (
                      <ListItem key={e.name} role={undefined} dense button onClick={handleCheckBoxToggle(e.name, checkedManufacturer, setCheckedManufacturer, onManufacturerChange, "man")}>
                        <Checkbox
                          edge="start"
                          checked={checkedManufacturer.indexOf(e.name) !== -1 || currentFilter.manufacturer.includes(e.name)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                        <ListItemText id={labelId} primary={e.name} />
                      </ListItem>
                    )
                  })
                }
              </div>
            </List>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h2 className={classes.heading}>Colors</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.accordionInner}>
            <List multiple component="nav" aria-label="colors filter">
              <div className={classes.listItemContainer}>
                {
                  color.map(e => {
                    const labelId = `checkbox-list-label-${e.name}`;
                    return (
                      <ListItem key={e.name} dense button onClick={handleCheckBoxToggle(e.color_id, checkedColor, setCheckedColor, onColorChange, "col")}>
                        <Checkbox
                          edge="start"
                          checked={checkedColor.indexOf(e.color_id) !== -1 || currentFilter.color.includes(e.color_id)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                        <span style={{backgroundColor: e.code}} className={classes.circle}></span>
                        <ListItemText id={labelId} primary={e.name} />
                      </ListItem>
                    )
                  })
                }
              </div>
            </List>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h2 className={classes.heading}>Diagonal</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.accordionInner}>
            <div className={classes.diagonalContainer}>
              <TextField
                onChange={diagonalChange}
                id="outlined-from-input"
                type="number"
                name="min"
                value={checkedDiagonal[0] || currentFilter.diagonal[0] || minMaxDiagonalFormatter[0]}
                inputProps={{ min: minMaxDiagonalFormatter[0], max: minMaxDiagonalFormatter[1], step: "0.01"}}
                variant="outlined"
              />
              <span>-</span>
              <TextField
                onChange={diagonalChange}
                id="outlined-to-input"
                type="number"
                name="max"
                value={checkedDiagonal[1] || currentFilter.diagonal[1] || minMaxDiagonalFormatter[1]}
                inputProps={{ min: minMaxDiagonalFormatter[0], max: minMaxDiagonalFormatter[1], step: "0.01"}}
                variant="outlined"
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h2 className={classes.heading}>Camera Count</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.accordionInner}>
            <List multiple component="nav" aria-label="camera count filter">
              <div className={classes.listItemContainer}>
                {
                  camera.map(e => {
                    const labelId = `checkbox-list-label-${e.name}`;
                    return (
                      <ListItem key={e.camera_count} dense button onClick={handleCheckBoxToggle(e.camera_count, checkedCamera, setCheckedCamera, onCameraCountChange, "cam")}>
                        <Checkbox
                          edge="start"
                          checked={checkedCamera.indexOf(e.camera_count) !== -1 || currentFilter.camera.includes(e.camera_count)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                        <ListItemText id={labelId} primary={e.camera_count} />
                      </ListItem>
                    )
                  })
                }
              </div>
            </List>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h2 className={classes.heading}>RAM</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.accordionInner}>
            <List multiple component="nav" aria-label="RAM count filter">
              <h2></h2>
              <div className={classes.listItemContainer}>
              {
                ramFormatter.map(e => {
                  const labelId = `checkbox-list-label-${e}`;
                  return (
                    <ListItem key={e} dense button onClick={handleCheckBoxToggle(e, checkedRam, setCheckedRam, onRamChange, "ram")}>
                      <Checkbox
                        edge="start"
                        checked={checkedRam.indexOf(e) !== -1 || currentFilter.ram.includes(e)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                      <ListItemText id={labelId} primary={e} />
                    </ListItem>
                  )
                })
              }
              </div>
            </List>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h2 className={classes.heading}>ROM</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.accordionInner}>
            <List multiple component="nav" aria-label="ROM filter">
              <div className={classes.listItemContainer}>
              {
                romFormatter.map(e => {
                  const labelId = `checkbox-list-label-${e}`;
                  return (
                    <ListItem key={e} dense button onClick={handleCheckBoxToggle(e, checkedMemory, setCheckedMemory, onRomChange, "mem")}>
                      <Checkbox
                        edge="start"
                        checked={checkedMemory.indexOf(e) !== -1 || currentFilter.rom.includes(e)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                      <ListItemText id={labelId} primary={e} />
                    </ListItem>
                  )
                })
              }
              </div>
            </List>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default Filter;