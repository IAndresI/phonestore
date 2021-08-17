import React from 'react';
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
import { TablePagination } from '@material-ui/core';
import OrderDetailsSubTable from './OrderDetailsSubTable';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function setStatus(status) {
  const currentStatus = status.lastIndexOf(true)
  switch(currentStatus) {
    case 0:
      return <Typography style={{color: 'goldenRod'}} variant="h6">Processed</Typography>
    case 1:
      return <Typography style={{color: 'darkSeaGreen'}} variant="h6">Sent For Delivery</Typography>
    case 2:
      return <Typography style={{color: 'green'}} variant="h6">Delivered</Typography>
    case 3:
      return <Typography style={{color: 'tomato'}} variant="h6">Rejected</Typography>
    default: return <Typography style={{color: 'goldenRod'}} variant="h6">Processed</Typography>
  }
}

function Row({order}) {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
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
        <TableCell align="center">{order.email}</TableCell>
        <TableCell align="center">{setStatus(order.status[0])}</TableCell>
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