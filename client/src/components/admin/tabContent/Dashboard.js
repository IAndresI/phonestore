import React from 'react';
import { getDashboardCounts } from '../../../http/adminAPI';
import {usePageDataLoad} from '../../../customHooks';
import Spinner from '../../Spinner'

const Dashboard = () => {

  const [dashboardCounts, setDashboardCounts, loading, error] = usePageDataLoad(getDashboardCounts, null)  

  if(loading) return <Spinner />
  
  return (
    <div className="admin">
      <h1 className="admin__title">Dashboard</h1>
      <div className="admin__tab-panel">
        <ul className="admin__dashboard-counts-list">
          <li className="admin__dashboard-counts-item">
            <h4 className="admin__dashboard-counts-title">Orders</h4>
            <span className="admin__dashboard-counts-number">{dashboardCounts.orders_count}</span>
          </li>
          <li className="admin__dashboard-counts-item">
            <h4 className="admin__dashboard-counts-title">Users</h4>
            <span className="admin__dashboard-counts-number">{dashboardCounts.clients_count}</span>
          </li>
          <li className="admin__dashboard-counts-item">
            <h4 className="admin__dashboard-counts-title">Phones</h4>
            <span className="admin__dashboard-counts-number">{dashboardCounts.phones_count}</span>
          </li>
          <li className="admin__dashboard-counts-item">
            <h4 className="admin__dashboard-counts-title">Sales</h4>
            <span className="admin__dashboard-counts-number">{dashboardCounts.sales}</span>
          </li>
          <li className="admin__dashboard-counts-item">
            <h4 className="admin__dashboard-counts-title">Reviews</h4>
            <span className="admin__dashboard-counts-number">{dashboardCounts.reviews_count}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;