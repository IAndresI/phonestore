import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Link} from 'react-router-dom';

const useStyles = makeStyles({
  row: {
    fontSize: 20,
    fontWeight: 600
  },
  textLink: {
    textDecoration: "none",
    color: "inherit",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    "&:hover": {
      color: "#3f51b5"
    },
    "&:focus": {
      color: "#3f51b5",
      outline: "transparent"
    },
    "&:active": {
      color: "inherit",
    }
  },
  imageLink: {
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    display: "flex",
    "&:hover": {
      transform: "scale(1.2)"
    },
    "&:focus": {
      transform: "scale(1.1)",
      outline: "transparent"
    },
    "&:active": {
      transform: "scale(1)"
    }
  }
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const OrdersTable = ({orders}) => {

  const classes = useStyles();

  const columns = [
    { id: 'phone_id', label: 'Phone ID', minWidth: 70, align: 'center' },
    { 
      id: 'image', 
      label: 'Image', 
      minWidth: 70, 
      align: 'center',
      format: (value) => {
        return (
          <div>
            <Link className={classes.imageLink} to={`/phone/${orders.find(el => el.image === value).phone_id}`}>
              <img width={100} height={100} style={{objectFit: "contain"}} src={`${process.env.REACT_APP_API_URL}/${value ? value : "phone.jpg"}`} alt="Phone"/>
            </Link>
          </div>
        )
      }
    },
    { 
      id: 'name', 
      label: 'Phone Name',
      align: 'center',
      minWidth: 170,
      format: (value) => <Link className={classes.textLink} to={`/phone/${orders.find(el => el.name === value).phone_id}`}>{value}</Link>,
    },
    {
      id: 'price',
      label: 'Price',
      minWidth: 100,
      align: 'center',
    },
    {
      id: 'count',
      label: 'Count',
      minWidth: 150,
      align: 'center',
      format: (value) => `x${value}`,
    }
  ];

  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {
                columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </StyledTableCell>
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
                        <TableCell className={classes.row} key={column.id} align={column.align}>
                          {
                            column.format ? column.format(value) : value
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
    </Paper>
  );
}

export default OrdersTable;