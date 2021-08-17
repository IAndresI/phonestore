import React, {useEffect, useState} from 'react';
import { getAllOrders } from '../../../http/orderAPI';
import OrdersTable from '../components/OrderTable';
import {usePageDataLoad} from '../../../customHooks'
import Spinner from '../../Spinner'

const Orders = () => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
        }
      </div>
    </div>
  );
};

export default Orders;