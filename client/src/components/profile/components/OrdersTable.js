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
import {Link} from 'react-router-dom';

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
          default: return "In consideration"
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
  {
    id: 'link',
    label: 'See More Details',
    minWidth: 100,
    align: 'center'
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  link: {
    backgroundColor: "#3f51b5",
    width: '100%',
    borderRadius: 10,
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

const OrdersTable = ({count, orders, setPage, page, setRowsPerPage, rowsPerPage}) => {
  
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
              {
                columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              orders.map((row) => {
                return (
                  <TableRow key={row.order_id} hover role="checkbox" tabIndex={-1}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {
                            column.format && (typeof value === 'string' || typeof value === "object") ? column.format(value)
                            :
                            column.id==="link" ? <Link className={classes.link} to={`/order/${row.order_id}`}>Click</Link> : value
                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            }
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

export default OrdersTable;