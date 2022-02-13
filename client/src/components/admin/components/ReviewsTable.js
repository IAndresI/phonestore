import React, {useContext, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Avatar, FormControl, MenuItem, TablePagination } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import DialogModal from './DialogModal';
import { editReview, removeReview } from '../../../http/phoneAPI';
import alertContext from '../../../context/alertContext'

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  statusSelect: {
    maxWidth: 150,
    width: "100%",
    height: 60,
  },
  selectSelectItem: {
    whiteSpace: "initial",
    fontSize: 16,
    fontWeight: 600
  },
  emailColumn: {
    maxWidth: 150,
    whiteSpace: "initial",
    wordWrap: "break-word",
    margin: "0 auto"
  },
  large: {
    width: 50,
    height: 50,
    margin: "0 auto"
  },
  button: {
    margin: "20px 0",
  }
});

function Row({review, refreshPage}) {

  const [open, setOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [verified, setVerified] = useState(review?.verified);

  const [action, setAction] = useState("")

  const classes = useRowStyles();

  const makeAlert = useContext(alertContext)

  const applyNewStatus = async () => {
    makeAlert({type: 'loading'})
    try {
      await editReview(review.review_id, {status: !verified, comment: review.comment,rating: review.rating})
      setVerified((prevStatus) => !prevStatus)
      makeAlert({type: 'success', message: 'Success!'})
    }
    catch(err) {
      makeAlert({type: 'error', message: err.message})
    } 
  }

  const applyRemoveReview = async () => {
    makeAlert({type: 'loading'})
    try {
      await removeReview(review.review_id)
        .then(() => refreshPage());
      makeAlert({type: 'success', message: 'Success!'})
    }
    catch(err) {
      makeAlert({type: 'error', message: err.message})
    } 
  }

  const handleChange = () => {
    setAction("edit")
    setModalOpen(true)
  };

  const imagePath=`http://localhost:5000/${review?.image ? review?.image : "user.jpg"}`

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton id={review.review_id} aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          <Avatar alt={`${review.fio}`} src={imagePath} className={classes.large} />
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {review.review_id}
        </TableCell>
        <TableCell align="left">{review.comment}</TableCell>
        <TableCell align="center"><Typography className={classes.emailColumn}>{review.rating}</Typography></TableCell>
        <TableCell align="center">
          <FormControl variant="outlined">
            <Select
              className={classes.statusSelect}
              value={verified}
              onChange={handleChange}
            >
              <MenuItem value={true}><Typography className={classes.selectSelectItem} style={{color: 'green'}} >Verified</Typography></MenuItem>
              <MenuItem value={false}><Typography className={classes.selectSelectItem} style={{color: 'tomato'}}>Not Verified</Typography></MenuItem>
            </Select>
          </FormControl>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <button
                className={`${classes.button} button button--danger`}
                onClick={() => {
                  setModalOpen(true)
                  setAction("del")
                }}
              >
                Delete This Review
              </button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <DialogModal 
        open={modalOpen}  
        setOpen={setModalOpen} 
        title={action === "edit" ? "Edit Review" : "Remove Review"}
        text={action === "edit" ? 
        "Are you sure you want to change the status of this review?"
        :
        "Are you sure you want to remove this review?"} 
        onYes={action === "edit" ? applyNewStatus : applyRemoveReview}
      />
    </React.Fragment>
  );
}

export default function ReviwesTable({
  reviews,
  count,
  page,
  rowsPerPage,
  refreshPage,
  handleChangePage,
  handleChangeRowsPerPage,
  makeAlert
}) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">User</TableCell>
              <TableCell align="center">Text</TableCell>
              <TableCell align="center">Rating</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews?.map((review) => (
              <Row key={review?.review_id} makeAlert={makeAlert} review={review} refreshPage={refreshPage} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}