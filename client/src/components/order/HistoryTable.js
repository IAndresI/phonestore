import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  row: {
    fontSize: 20,
    fontWeight: 600
  },
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

const OrdersTable = ({history}) => {

  const classes = useStyles();

  const columns = [
    { 
      id: 'date_up', 
      label: 'Date Up', 
      minWidth: 70, 
      align: 'center',
      format: (value) => new Date(value).toLocaleString().replace(',', " ")
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 150,
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
                    style={{ minWidth: column.minWidth, fontSize: 20 }}
                  >
                    {column.label}
                  </StyledTableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              history.map((row) => {
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