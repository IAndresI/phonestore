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
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TablePagination } from '@material-ui/core';
import DialogModal from './DialogModal';
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
  image: {
    width: 50,
    height: 50,
    margin: "0 auto",
    objectFit: "cover"
  },
});

function Row({phone, refreshPage}) {

  const [open, setOpen] = useState(false);

  const classes = useRowStyles();

  const imagePath=`http://localhost:5000/${phone?.image ? phone?.image : "phone.jpg"}`

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell align="center" component="th" scope="row">
          {phone.phone_id}
          
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          <img alt={phone.phone_name} src={imagePath} className={classes.image} />
        </TableCell>
        <TableCell align="center">{phone.phone_name}</TableCell>
        <TableCell align="center">{phone.price}</TableCell>
        <TableCell align="center">
          {phone.phone_colors.reduce((curr, acc) => curr+ +acc[3], 0)}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function PhonesTable({
  phones,
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
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {phones?.map((phone) => (
              <Row key={phone?.phone_id} makeAlert={makeAlert} phone={phone} refreshPage={refreshPage} />
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