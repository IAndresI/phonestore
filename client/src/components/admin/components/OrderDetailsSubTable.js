import React from 'react'
import { makeStyles, Table,TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Spinner from '../../Spinner';
import { usePageDataLoad } from '../../../customHooks';
import { getOrderDetails } from '../../../http/orderAPI';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  textLink: {
    textDecoration: "none",
    color: "inherit",
    fontSize: 20,
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
    justifyContent: "center",
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

const OrderDetailsSubTable = ({orderId}) => {

  const [details, setDetails, loading, error] = usePageDataLoad(() => getOrderDetails(orderId));

  const classes = useStyles();

  if(loading) return <Spinner />

  if(error) return <h3>Some Error</h3>
  
  return (
    <Table className={classes.root} aria-label="purchases">
      <TableHead>
        <TableRow>
          <TableCell align="center">Phone ID</TableCell>
          <TableCell align="center">Phone Name</TableCell>
          <TableCell align="center">Image</TableCell>
          <TableCell align="center">Price</TableCell>
          <TableCell align="center">Count</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {details.map((detailsRow) => (
          <TableRow key={detailsRow.phone_id}>
            <TableCell align="center" component="th" scope="row">
              {detailsRow.phone_id}
            </TableCell>
            <TableCell align="center" component="th" scope="row">
              <Link className={classes.textLink} to={`/phone/${detailsRow.phone_id}`}>
                {detailsRow.name}
              </Link>
            </TableCell>
            <TableCell align="center">
              <Link className={classes.imageLink} to={`/phone/${detailsRow.phone_id}`}>
                <img width={100} height={100} style={{objectFit: "contain"}} src={`${process.env.REACT_APP_API_URL}/${detailsRow.image ? detailsRow.image : "phone.jpg"}`} alt="Phone"/>
              </Link>
            </TableCell>
            <TableCell align="center">{detailsRow.price}</TableCell>
            <TableCell align="center">
              {detailsRow.count}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
            
  );
};

export default OrderDetailsSubTable;