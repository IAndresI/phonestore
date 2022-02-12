import alertContext from '../context/alertContext';
import SnackBar from '../components/SnackBar';
import { useState } from 'react';
import { ALERT } from '../utils/consts';

export default function withAlert(Component) {
  return (props) => {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarState, setSnackBarState] = useState("")
    const [snackBarText, setSnackBarText] = useState("")


    const makeAlert = ({message, type}) => {
      setOpenSnackBar(true);
      setOpenSnackBar(true);
      switch(type) {
        case ALERT.SUCCESS:
          setSnackBarState(ALERT.SUCCESS);
          setSnackBarText(message || "Success");
          break;
        case ALERT.ERROR:
          setSnackBarState(ALERT.ERROR);
          setSnackBarText(message || "Error");
          break;
        case ALERT.WARNING:
          setSnackBarState(ALERT.WARNING);
          setSnackBarText("Loading");
          break;
        default: 
          setSnackBarState(ALERT.INFO);
          setSnackBarText(message || "Unhandled State!");
          break;
      }
    };

    const handleSnackBarClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      setOpenSnackBar(false);
    };

    return(
      <>
        <alertContext.Provider value={makeAlert}>
          <Component {...props} />
        </alertContext.Provider>
        <SnackBar 
          open={openSnackBar} 
          handleClose={handleSnackBarClose}
          handleClick={makeAlert} 
          snackBarState={snackBarState}
          text={snackBarText}
        />
      </>
    );
  }
}