import { Fade, Snackbar } from '@material-ui/core';
import React, {useState,useEffect} from 'react';
import MuiAlert from '@material-ui/lab/Alert';

const SnackBar = ({errors}) => {

  const [snackBar, setSnackBar] = useState({
    open: false,
    Transition: Fade,
  });

  useEffect(() => {
    if(Object.keys(errors).length > 0) {
      setSnackBar({
        open: true,
        Transition: Fade,
      })
    }
  }, [errors])

  const getErrorText = (err) => {

    const errorType = Object.keys(err).length !== 0 ? Object.entries(err)[0][0] : null;

    switch (errorType) {
      case "firstName":
        return "Enter your first name!"
      case "lastName":
        return "Enter your last name!"
      case "email":
        return "Enter email!"
      case "deliveryAvenue":
        return "Enter correct delivery address!"
      case "room":
        return "Enter your room number!"
      case "pickupPoint":
        return "Enter pick-up point address!"
      case "emailDuplicate":
        return "This email already registred! Please, register before make order!"
      default: return "";
    }
  }

  const snackBarOnClose = () => {
    setSnackBar((prev) => ({
      ...prev,
      open: false,
    }));
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <Snackbar
      open={snackBar.open}
      TransitionComponent={snackBar.Transition}
      onClose={snackBarOnClose}
      key={snackBar.Transition.name}>
        <Alert severity="error">
          {getErrorText(errors)}
        </Alert>
    </Snackbar>
  );
};

export default SnackBar;