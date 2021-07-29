import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSeveralPhones } from '../http/phoneAPI';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Spinner from '../components/Spinner'
import { Link } from 'react-router-dom';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Button } from '@material-ui/core';
import { removeCompareItem } from '../store/actions';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  root: {
    minWidth: 200,
    borderRight: '1px solid black',
  },
  body: {
    fontSize: 20,
    fontWeight: 600,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    }
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: 10,
    minWidth: 180,
    height: 180,
  },
  image: {
    width: 180,
    height: 180,
    objectFit: "contain"
  },
  name: {
    fontSize: 18,
    width: "100%",
    color: 'black'
  },
  imageCell: {
    minWidth: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: 'center',
    position: "relative"
  },
  link: {
    width: '100%',
    height: '100%',
    textAlign: "center",
    textDecoration: "none",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    "&:focus": {
      transform: "scale(1.08)"
    },
    "&:hover": {
      transform: "scale(1.08)",
    }
  },
  removeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    borderRadius: "0 10px 0 0",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    "&:hover, &:focus": {
      color: "red",
    },
    "&:active": {
      color: "black",
    }
  },
  emptyAlert: {
    textAlign: "center",
  }
});

const Compare = ({setPageLoading}) => {

  const dispatch = useDispatch()

  const storedId = useSelector(state => state.compare.items)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const classes = useStyles();

  useEffect(() => {
    setLoading(true)
    getSeveralPhones(storedId)
      .then(data => {
        setItems(data)
        setLoading(false)
      })
      .finally(err => setLoading(false))
    return () => setPageLoading(true)
  }, [storedId])

  if(loading) return <Spinner />

  return (
    <section className="section">
      <h1 className="title">Compare</h1>
      <div>
        {
          items.length ?
          (
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Phone</StyledTableCell>
                    <StyledTableCell align="center">Price</StyledTableCell>
                    <StyledTableCell align="center">Manufacturer</StyledTableCell>
                    <StyledTableCell align="center">RAM</StyledTableCell>
                    <StyledTableCell align="center">ROM</StyledTableCell>
                    <StyledTableCell align="center">Diagonal</StyledTableCell>
                    <StyledTableCell align="center">Camera</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((phone) => (
                    <StyledTableRow key={phone.phone_id}>
                      <StyledTableCell className={classes.imageCell} component="th" scope="phone">
                        <Link className={classes.link} to={`/phone/${phone.phone_id}`}>
                          <div className={classes.imageContainer}>
                            <img className={classes.image} src={`${process.env.REACT_APP_API_URL}/${phone.image ? phone.image : "phone.jpg"}`} alt={phone.phone_name}/>
                          </div>
                          <h4 className={classes.name}>{phone.phone_name}</h4>
                        </Link>
                        <Button 
                          onClick={() => dispatch(removeCompareItem(phone.phone_id))}
                          className={classes.removeButton}>
                          <HighlightOffIcon />
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell align="center">{phone.price}</StyledTableCell>
                      <StyledTableCell align="center">{phone.manufacturer_name}</StyledTableCell>
                      <StyledTableCell align="center">{phone.ram}</StyledTableCell>
                      <StyledTableCell align="center">{phone.memory}</StyledTableCell>
                      <StyledTableCell align="center">{phone.diagonal}</StyledTableCell>
                      <StyledTableCell align="center">{phone.camera.join("x")}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
          :
          <h2 className={classes.emptyAlert}>Add Compare Items</h2>
        }
      </div>
    </section>
  );
};

export default Compare;