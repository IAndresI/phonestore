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
import { FormControl, MenuItem, TablePagination } from '@material-ui/core';
import OrderDetailsSubTable from './OrderDetailsSubTable';
import Select from '@material-ui/core/Select';
import { changeOrderStatus } from '../../../http/orderAPI';
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
  }
});

function setStatusName(statusCode) {
  switch (statusCode) {
    case 0: 
      return "processed";
    case 1: 
      return "sent_for_delivery";
    case 2: 
      return "delivered";
    case 3: 
      return "rejected";
    default: throw new Error("Unkniwn status!")
  }
}

function Row({order}) {

  const [open, setOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const classes = useRowStyles();

  const [status, setStatus] = useState(order.status[0].lastIndexOf(true));
  const [newStatus, setNewStatus] = useState(null)

  const applyNewStatus = async () => {
    let prevStatusText = setStatusName(status);
    let newStatusText = setStatusName(newStatus)

    setStatus(newStatus);
    setNewStatus(null)

    await changeOrderStatus(order.order_id, prevStatusText, newStatusText)
  }

  const handleChange = (event) => {
    setModalOpen(true)
    setNewStatus(event.target.value)
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {order.order_id}
        </TableCell>
        <TableCell  align="center"><Typography className={classes.emailColumn}>{order.email}</Typography></TableCell>
        <TableCell align="center">
          <FormControl variant="outlined">
            <Select
              className={classes.statusSelect}
              value={status}
              onChange={handleChange}
            >
              <MenuItem value={0}><Typography className={classes.selectSelectItem} style={{color: 'goldenRod'}} >Processed</Typography></MenuItem>
              <MenuItem value={1}><Typography className={classes.selectSelectItem} style={{color: 'darkSeaGreen'}} >Sent For Delivery</Typography></MenuItem>
              <MenuItem value={2}><Typography className={classes.selectSelectItem} style={{color: 'green'}} >Delivered</Typography></MenuItem>
              <MenuItem value={3}><Typography className={classes.selectSelectItem} style={{color: 'tomato'}}>Rejected</Typography></MenuItem>
            </Select>
          </FormControl>
        </TableCell>
        <TableCell align="center">{new Date(order.date_order_placed).toLocaleString().replace(',', " ")}</TableCell>
        <TableCell align="center">{new Date(order.date_order_paid).toLocaleString().replace(',', " ")}</TableCell>
        <TableCell align="center">{order.total}</TableCell>
        <TableCell align="center">{order.payment_method}</TableCell>
        <TableCell align="center">{order.delivery_address || order.point_address}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h4" gutterBottom component="div">
                Details
              </Typography>
              <OrderDetailsSubTable orderId={order.order_id}/>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <DialogModal 
        open={modalOpen} 
        setOpen={setModalOpen} 
        title="Order" 
        text="Are you sure you want to change the status of this order?" 
        onYes={applyNewStatus}
      />
    </React.Fragment>
  );
}

export default function OrdersTable({
  orders,
  count,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">Order ID</TableCell>
              <TableCell align="center">Client Email</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Date Order Placed</TableCell>
              <TableCell align="center">Order Paid</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Payment Method</TableCell>
              <TableCell align="center">Delivery Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <Row key={order.order_id} order={order} />
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