import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReviewRating from './ReviewRating';
import { useForm, Controller  } from "react-hook-form";
import { DialogContent, DialogContentText, DialogTitle, TextField, Dialog, DialogActions, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { createReview, editReview } from '../../../http/phoneAPI';
import Spinner from '../../Spinner';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    minWidth: "80%",
    minHeight: "30%",
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    textAlign: 'center'
  },
  alert: {
    marginTop: 20
  },
  modalContainer: {
    width:"70%"
  },
  statusTitle: {
    fontSize: 35,
    textAlign: 'center',
    margin: "30px 0",
    fontWeight: '700',
    color: 'inherit'
  },
  statusText: {
    fontSize: 25,
    textAlign: 'center',
    color: 'inherit',
    fontWeight: 600
  }
}));

export default function ReviewModal({setOpen, open, phoneId, clientId, alreadyReviewed, setAlreadyReviewed}) {

  const classes = useStyles();

  const { control, setValue, handleSubmit, formState: { errors } } = useForm({defaultValues: {rating: alreadyReviewed?.rating || 4.5, comment: alreadyReviewed?.comment}});

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)

  const onSubmit = (data) => {
    setLoading(true)
    if(alreadyReviewed?.review_id) {
      editReview(alreadyReviewed.review_id, data)
        .then(data => {
          setStatusMessage(data.message)
          setLoading(false)
          setError(null)
        })
        .catch(err => {
          setLoading(false)
          setError(err?.response?.data || err)
        })
    }
    else {
      createReview(phoneId, {...data, clientId, phoneId})
        .then(data => {
          setStatusMessage(data.message)
          setLoading(false)
          setError(null)
          setAlreadyReviewed(true)
        })
        .catch(err => {
          setLoading(false)
          switch(err?.response?.status) {
            case 409: 
              setError({message: "You cannot write a review because you have already written it and it is being reviewed."});
              break;
            default: 
              setError(err?.response?.data || err);
          }
          
        })
    }
  }

  const handleClose = () => {
    setError(null)
    setOpen(false);
    setTimeout(() => {
      setStatusMessage(null)
    }, 400);
  };

  const errorHandler = (err) => {
    const errorType = Object.keys(err).length !== 0 ? Object.entries(err)[0][0] : null;
    let errorText = null;

    switch (errorType) {
      case 'comment':
        switch (err[errorType].type) {
          case "minLength":
            errorText = "Comment length should be more than 50 characters!"
            break;
          default:
            errorText = "Comment is required!"
            break;
        }
        break;
      case 'rating': 
        errorText = "Rate the product!"
        break;
      default: return null;
    }
    return <Alert className={classes.alert} severity="error">{errorText}</Alert>
  }

  const StatusMessage = ({text, success}) => (
    <div style={{color: success ? '#4caf50' : "tomato"}}>
      <div className={classes.statusTitle}>{text}</div>
      {
        success ? <p className={classes.statusText}>Your new review has been sent to our moderators for review, it will take some time before the new review appears in the feed.</p>
        :
        null
      }
    </div>
  )

  return (
    <Dialog onClose={handleClose} open={open}>
      <div style={{width: '100%'}}>
        <DialogTitle id="alert-dialog-description">
          {alreadyReviewed ? "Edit Your Review!" : "Make Your Review!"}
        </DialogTitle>
        <DialogContent>
          {
            loading ?
             <Spinner /> : 
             error ? <StatusMessage text={error.message} /> : 
              statusMessage ? <StatusMessage text={statusMessage} success/> :
                (
                  <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Controller
                        name="rating"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => <ReviewRating field={field}/>}
                      />
                      <Controller
                        name="comment"
                        control={control}
                        rules={{ required: true, minLength: 50 }}
                        defaultValue=""
                        render={({ field }) =><TextField
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          name="Controller"
                          label="Comment"
                          type="text"
                          multiline
                          id="password"
                          {...field}
                        />}
                      />
                      <DialogActions>
                        <Button
                          type="submit"
                          variant="contained"
                        >
                          Submit
                        </Button>
                        <Button
                          type="button"
                          variant="contained"
                          onClick={handleClose} 
                          autoFocus
                        >
                          Close
                        </Button>
                      </DialogActions>
                      {Object.keys(errors).length === 0 ? null : errorHandler(errors)}
                    </form>
                  </div>
                )
          }
        </DialogContent>
      </div>
    </Dialog>
  );
}