import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Checkbox, Slider, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchingColor, fetchingManufacturer, onCameraCountChange, onColorChange, onDiagonalChange, onManufacturerChange, onPageSet, onPriceChange, onRamChange, onRomChange } from '../store/actions';
import { getFilter } from '../http/phoneAPI';
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
  }
});

const Filter = () => {

  // Store
  
  const dispatch = useDispatch();
  const currentFilter = useSelector(state => state.filter)

  // Data for filter

  const [minMaxPrice, setMinMaxPrice] = useState([0, 10000000]);
  const [minMaxDiagonal, setMinMaxDiagonal] = useState([0, 10]);
  const [colorList, setColorList] = useState([]);
  const [manufacturerList, setManufacturerList] = useState([]);
  const [cameraList, setCameraList] = useState([]);
  const [ramList, setRamList] = useState([]);
  const [memoryList, setMemoryList] = useState([]);

  // Data that user pick

  const [checkedManufacturer, setCheckedManufacturer] = useState([]);
  const [checkedColor, setCheckedColor] = useState([]);
  const [price, setPrice] = useState([0, 10000000]);
  const [checkedCamera, setCheckedCamera] = useState([]);
  const [checkedRam, setCheckedRam] = useState([]);
  const [checkedMemory, setCheckedMemory] = useState([]);

  // styles

  const classes = useStyles();

  // on filter change and componentDidMount

  const diagonalChange = (event) => {
    if(event.target.name==="min") {
      if(+event.target.value > minMaxDiagonal[1] || +event.target.value < minMaxDiagonal[0]) {
        dispatch(onDiagonalChange([minMaxDiagonal[0], currentFilter.diagonal[1]]))
        event.target.value=minMaxDiagonal[0].toFixed(2)
      }
      else dispatch(onDiagonalChange([+event.target.value, currentFilter.diagonal[1]]))
    }
    else {
      if(+event.target.value > minMaxDiagonal[1] || +event.target.value < minMaxDiagonal[0]) {
        dispatch(onDiagonalChange([currentFilter.diagonal[0], minMaxDiagonal[1]]))
        event.target.value=minMaxDiagonal[1].toFixed(2)
      }
      else dispatch(onDiagonalChange([currentFilter.diagonal[0], +event.target.value]))
    }
  }

  const handleChange = (event, newValue) => {
    setPrice(newValue);
  };

  const handleToggle = (value, state, changeState, action, type) => () => {
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

  useEffect(() => {
    getFilter().then(({color, price: {min, max}, manufacturer, diagonal, camera, memory, ram}) => {

      setRamList(ram.map(e => e.ram))

      setMemoryList(memory.map(e => e.memory))

      setCameraList(camera)

      setMinMaxDiagonal([+diagonal.min, +diagonal.max]);
      dispatch(onDiagonalChange([+diagonal.min, +diagonal.max]))

      setManufacturerList(manufacturer)
      dispatch(fetchingManufacturer(manufacturer))

      const minMaxPri = [parseInt(min.slice(1, min.length).replace(",","")),parseInt(max.slice(1, max.length).replace(",",""))]
      setMinMaxPrice(minMaxPri);
      dispatch(onPriceChange(minMaxPri))

      setColorList(color);
      dispatch(fetchingColor(color))
    });
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(onPriceChange(price))
      dispatch(onPageSet(1))
    }, 500);
    return () => {
      clearTimeout(timer)
    }
  }, [price, dispatch])

  return (
    <div className={classes.root}>
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
              value={price || currentFilter.price}
              max={minMaxPrice[1]}
              min={minMaxPrice[0]}
              step={100}
              className={classes.range}
              onChange={handleChange}
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
                  manufacturerList.map(e => {
                    const labelId = `checkbox-list-label-${e.name}`;
                    return (
                      <ListItem key={e.name} role={undefined} dense button onClick={handleToggle(e.name, checkedManufacturer, setCheckedManufacturer, onManufacturerChange, "man")}>
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
                inputProps={{ min: minMaxDiagonal[0], max: minMaxDiagonal[1], step: "0.01", placeholder: minMaxDiagonal[0]}}
                variant="outlined"
              />
              <span>-</span>
              <TextField
                onChange={diagonalChange}
                id="outlined-to-input"
                type="number"
                name="max"
                inputProps={{ min: minMaxDiagonal[0], max: minMaxDiagonal[1], step: "0.01", placeholder: minMaxDiagonal[1]}}
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
                  cameraList.map(e => {
                    const labelId = `checkbox-list-label-${e.name}`;
                    return (
                      <ListItem key={e.camera_count} dense button onClick={handleToggle(e.camera_count, checkedCamera, setCheckedCamera, onCameraCountChange, "cam")}>
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
                ramList.map(e => {
                  const labelId = `checkbox-list-label-${e}`;
                  return (
                    <ListItem key={e} dense button onClick={handleToggle(e, checkedRam, setCheckedRam, onRamChange, "ram")}>
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
                memoryList.map(e => {
                  const labelId = `checkbox-list-label-${e}`;
                  return (
                    <ListItem key={e} dense button onClick={handleToggle(e, checkedMemory, setCheckedMemory, onRomChange, "mem")}>
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