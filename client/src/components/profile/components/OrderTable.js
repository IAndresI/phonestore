import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'order_id', label: 'Order ID', minWidth: 70, align: 'center' },
  { 
    id: 'date_order_placed', 
    label: 'Date Order Placed',
    align: 'center',
    minWidth: 170,
    format: (value) => new Date(value).toLocaleString().replace(',', " "),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    align: 'center',
    format: (value) => {
      if(value) {
        const statusesArray = value.filter(el => el);
        const statusCode = statusesArray ? statusesArray.length : 0;
        switch(statusCode) {
          case 0: return "Expectation"
          case 1: return "Processed"
          case 2: return "Courier sent"
          case 3: return "Delivered"
          default: return ""
        }
      }
    }
  },
  {
    id: 'payment_method',
    label: 'Payment Method',
    minWidth: 150,
    align: 'center'
  },
  {
    id: 'total',
    label: 'Order Price',
    minWidth: 100,
    align: 'center'
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const OrderTable = ({count, orders, setPage, page, setRowsPerPage, rowsPerPage}) => {
  
  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row) => {
              return (
                <TableRow key={row.order_id} hover role="checkbox" tabIndex={-1}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'string' || typeof value === "object" ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[3, 5, 10]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default OrderTable;