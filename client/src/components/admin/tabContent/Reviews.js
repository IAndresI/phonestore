import React, {useEffect, useState} from 'react';
import ReviewsTable from '../components/ReviewsTable';
import {usePageDataLoad} from '../../../customHooks'
import Spinner from '../../Spinner'
import { getAllReviews } from '../../../http/phoneAPI';

const Reviews = () => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [reviews, setReviews, loading, error] = usePageDataLoad(() => getAllReviews(rowsPerPage, page+1), null, page)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const refreshPage = async () => {
    const users = await getAllReviews(rowsPerPage, page+1);
    setReviews(users)
  }

  useEffect(() => {
    getAllReviews(rowsPerPage, page+1)
      .then(data => {
        setReviews(data);
        console.log(data);
      }) 
  }, [page, rowsPerPage])

  return (
    <div className="admin">
      <h1 className="admin__title">Reviews</h1>
      <div className="admin__tab-panel">
        {
          error ? <h3>Some Error</h3> :
            loading ? <Spinner /> : 
              <ReviewsTable 
                reviews={reviews?.reviews}
                count={reviews?.count}
                page={page}
                refreshPage={refreshPage}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
        }
      </div>
    </div>
  );
};

export default Reviews;