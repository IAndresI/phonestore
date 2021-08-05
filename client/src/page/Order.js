import { Accordion, AccordionDetails, AccordionSummary, Container } from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { getOrderHistory, getUserOrder } from '../http/orderAPI';
import {makeStyles} from '@material-ui/core'
import OrderTable from '../components/order/OrderTable';
import {useSelector} from 'react-redux'
import usePageDataLoad from '../customHooks/usePageDataLoad';
import HistoryTable from '../components/order/HistoryTable'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles({
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20
  },
  infoName: {
    marginRight: 20,
    fontSize: 20
  },
  infoData: {
    margin: 0
  },
  button: {
    display: 'flex',
    width: 'fit-content',
    margin: "30px auto",
    backgroundColor: "#3f51b5",
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 500,
    padding: '15px 30px',
    color: "#ffffff",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    textDecoration: 'none',
    textTransform: "none",
    cursor: "pointer",
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
  },
  accordionDetails: {
    width: "100%"
  },
  accordionDetailsContainer: {
    padding: 0
  },
  information: {
    fontSize: 20,
    textAlign: "center"
  }
})

const Order = () => {

  const clientId = useSelector(state => state.user.user.clientId)

  const {id} = useParams();

  const classes = useStyles();

  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const [orderDetailsInfo, setOrderDetailsInfo] = useState(null)
  const [orderInfo, setOrderInfo] = useState(null)
  const [orderHistory, setOrderHistory] = useState(null)

  const [data, setData, loading, error] = usePageDataLoad(() => getUserOrder(id), null, id)

  useEffect(() => {
    if(data) {
      setOrderDetailsInfo(data.orderDetailsInfo)
      setOrderInfo(data.orderInfo)
    }
    
  }, [data])

  useEffect(() => {
    if(showOrderHistory && !orderHistory) {
      getOrderHistory(id)
        .then(data => setOrderHistory(data))
    }
  }, [showOrderHistory, id])

  const formatStatus = (status) => {
    const statusesArray = status.filter(el => el);
    const statusCode = statusesArray ? statusesArray.length : 0;
    switch(statusCode) {
      case 0: return "Expectation"
      case 1: return "Processed"
      case 2: return "Courier sent"
      case 3: return "Delivered"
      default: return "In consideration"
    }
  }

  const accordionStatusChange = (event, isExpanded) => setShowOrderHistory(isExpanded)

  // Loading & Error Indicator

  if(loading) return <Spinner />

  if(error) return <h3>Some Error {error.message}</h3>

  return (
    <section className="page">
      <h1 className="title">Order № {orderInfo.order_id}</h1>
      <Container>
        <div className={classes.infoRow}>
          <span className={classes.infoName}>Status:</span>
          <h3 className={classes.infoData}>
            {formatStatus(orderInfo.status)}
          </h3>
        </div>
        <div className={classes.infoRow}>
          <span className={classes.infoName}>Paid:</span>
          <h3 className={classes.infoData}>
            {orderInfo.date_order_paid ? orderInfo.date_order_paid : "No"}
          </h3>
        </div>
        <div className={classes.infoRow}>
          <span className={classes.infoName}>Date Order Placed:</span>
          <h3 className={classes.infoData}>
            {new Date(orderInfo.date_order_placed).toLocaleString().replace(',', " ")}
          </h3>
        </div>
        <div className={classes.infoRow}>
          <span className={classes.infoName}>Payment Method:</span>
          <h3 className={classes.infoData}>
            {orderInfo.name}
          </h3>
        </div>
        {
          orderInfo.delivery_address ?
          (
            <div className={classes.infoRow}>
              <span className={classes.infoName}>Delivery Address:</span>
              <h3 className={classes.infoData}>
                {orderInfo.delivery_address}
              </h3>
            </div>
          )
          :
          (
            <div className={classes.infoRow}>
              <span className={classes.infoName}>Pick-Up Point Address:</span>
              <h3 className={classes.infoData}>
                {orderInfo.address}
              </h3>
            </div>
          )
        }
        <div className={classes.infoRow}>
          <span className={classes.infoName}>Client Name:</span>
          <h3 className={classes.infoData}>
            {orderInfo.client_name}
          </h3>
        </div>
        <div className={classes.infoRow}>
          <span className={classes.infoName}>Client Email:</span>
          <h3 className={classes.infoData}>
            {orderInfo.email}
          </h3>
        </div>
        <div className={classes.infoRow}>
          <span className={classes.infoName}>Client Phone:</span>
          <h3 className={classes.infoData}>
            {orderInfo.phone}
          </h3>
        </div>
        <div className={classes.infoRow}>
          <span className={classes.infoName}>Total:</span>
          <h3 className={classes.infoData}>
            {orderInfo.total}
          </h3>
        </div>
        <div className={classes.history}>
          <Accordion onChange={accordionStatusChange}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <h3 className={classes.heading}>Order History</h3>
            </AccordionSummary>
            <AccordionDetails classes={{root: classes.accordionDetailsContainer}}>
              <div className={classes.accordionDetails}>
                {
                  orderHistory ?
                    orderHistory.length <= 0 ? <h4 className={classes.information}>No Information</h4> : <HistoryTable history={orderHistory}/>
                  :
                  <Spinner />
                }
              </div>
            </AccordionDetails>
          </Accordion>
          
        </div>
        <h2>Order Details</h2>
        <OrderTable orders={orderDetailsInfo}/>
        <Link to={`/profile/${clientId}`} className={classes.button}>
          Back To Profile
        </Link>
      </Container>
    </section>
  );
};

export default Order;