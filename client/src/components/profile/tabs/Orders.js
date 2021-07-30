import React, {useEffect, useState} from 'react';
import { getUserOrders } from '../../../http/orderAPI';
import Spinner from '../../Spinner';
import OrdersTable from '../components/OrdersTable';
import Title from '../components/Title';

const Orders = ({clientId}) => {

  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getUserOrders(clientId, page, rowsPerPage)
      .then(data => setOrders(data))
      .finally(() => setLoading(false))
  }, [page, rowsPerPage, clientId])

  if(loading) return <Spinner/>

  return (
    <div>
      <Title>Your Orders</Title>
      {
        orders.count === 0 ?
        (
          <h2>You Рave Тo Щrders</h2>
        )
        :
        (
          <>
            <h2>Order Count: {orders.count}</h2>
            <OrdersTable 
              count={+orders.count} 
              orders={orders.orders} 
              rowsPerPage={rowsPerPage} 
              setRowsPerPage={setRowsPerPage} 
              setPage={setPage} 
              page={page}
            />
          </>
        )
      }
      
    </div>
  );
};

export default Orders;