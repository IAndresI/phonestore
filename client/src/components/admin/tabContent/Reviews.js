import React, {useEffect, useState} from 'react';
import ReviewsTable from '../components/ReviewsTable';
import {usePageDataLoad} from '../../../customHooks'
import Spinner from '../../Spinner'
import { getAllUsers } from '../../../http/userAPI';

const Reviews = ({makeAlert}) => {

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
    const users = await getAllUsers(rowsPerPage, page);
    setUsers(users)
  }

  const [users, setUsers, loading, error] = usePageDataLoad(() => getAllUsers(rowsPerPage, page));

  useEffect(() => {
    getAllUsers(rowsPerPage, page)
      .then(data => setUsers(data)) 
  }, [page, rowsPerPage])

  return (
    <div className="admin">
      <h1 className="admin__title">Reviews</h1>
      <div className="admin__tab-panel">
        {
          error ? <h3>Some Error</h3> :
            loading ? <Spinner /> : 
              <ReviewsTable 
                users={users?.data}
                count={users?.count}
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

export default Reviews;