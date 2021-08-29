import React, {useState} from 'react';
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
import OrderDetailsSubTable from './OrderDetailsSubTable';
import Select from '@material-ui/core/Select';
import { changeUserRole } from '../../../http/userAPI';
import DialogModal from './DialogModal';

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
    wordWrap: "break-word"
  },
  large: {
    width: 50,
    height: 50,
    margin: "0 auto"
  },
});

function Row({user, makeAlert, refreshPage}) {

  const [open, setOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const classes = useRowStyles();

  const [status, setStatus] = useState(user.role);
  const [newStatus, setNewStatus] = useState(null)

  const applyNewStatus = async () => {
    makeAlert({type: 'loading'})
    try {
      await changeUserRole(user.client_id, newStatus)
      setStatus(newStatus)
      makeAlert({type: 'success', message: 'Success!'})
    }
    catch(err) {
      makeAlert({type: 'error', message: err.message})
    } 
  }

  const handleChange = (event) => {
    setModalOpen(true)
    setNewStatus(event.target.value)
  };

  const imagePath=`http://localhost:5000/${user?.image ? user?.image : "user.jpg"}`

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          <Avatar alt={`${user.first_name} ${user.last_name}`} src={imagePath} className={classes.large} />
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {user.client_id}
        </TableCell>
        <TableCell align="center"><Typography className={classes.emailColumn}>{`${user.first_name} ${user.last_name}`}</Typography></TableCell>
        <TableCell align="center">{user.email}</TableCell>
        <TableCell align="center">
          <FormControl variant="outlined">
            <Select
              className={classes.statusSelect}
              value={status}
              onChange={handleChange}
            >
              <MenuItem value="CLIENT"><Typography className={classes.selectSelectItem} style={{color: 'darkSeaGreen'}} >CLIENT</Typography></MenuItem>
              <MenuItem value='ADMIN'><Typography className={classes.selectSelectItem} style={{color: 'tomato'}} >ADMIN</Typography></MenuItem>
            </Select>
          </FormControl>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h4" gutterBottom component="div">
                Details
              </Typography>
              <OrderDetailsSubTable refreshPage={refreshPage} makeAlert={makeAlert} orderId={user.order_id}/>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <DialogModal 
        open={modalOpen} 
        setOpen={setModalOpen} 
        title="User" 
        text="Are you sure you want to change the status of this user?" 
        onYes={applyNewStatus}
      />
    </React.Fragment>
  );
}

export default function UsersTable({
  users,
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
              <TableCell align="center">Client Image</TableCell>
              <TableCell align="center">Client ID</TableCell>
              <TableCell align="center">Client Name</TableCell>
              <TableCell align="center">Client Email</TableCell>
              <TableCell align="center">Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <Row key={user.order_id} makeAlert={makeAlert} user={user} refreshPage={refreshPage} />
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