import React, {useEffect, useState} from 'react';
import { getAllOrders } from '../../../http/orderAPI';
import OrdersTable from '../components/OrdersTable';
import {usePageDataLoad} from '../../../customHooks'
import Spinner from '../../Spinner'

const Orders = ({makeAlert}) => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const refreshPage = async () => {
    const orders = await getAllOrders(rowsPerPage, page);
    setOrders(orders)
  }

  const [orders, setOrders, loading, error] = usePageDataLoad(() => getAllOrders(rowsPerPage, page));

  useEffect(() => {
    getAllOrders(rowsPerPage, page)
      .then(data => setOrders(data)) 
  }, [page, rowsPerPage])

  return (
    <div className="admin">
      <h1 className="admin__title">Orders</h1>
      <div className="admin__tab-panel">
        {
          error ? <h3>Some Error</h3> :
            loading ? <Spinner /> : 
              <OrdersTable 
                orders={orders.data}
                count={orders.count}
                page={page}
                refreshPage={refreshPage}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                makeAlert={makeAlert}
              />
        }
      </div>
    </div>
  );
};

export default Orders;