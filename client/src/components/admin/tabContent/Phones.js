import React, {useEffect, useState} from 'react';
import PhonesTable from '../components/PhonesTable';
import {usePageDataLoad} from '../../../customHooks'
import Spinner from '../../Spinner'
import { getAllPhones } from '../../../http/phoneAPI';

const Phones = ({makeAlert}) => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [phones, setPhones, loading, error] = usePageDataLoad(
    () => getAllPhones(page+1, rowsPerPage, null, null, null, null, null, null, null, null),
    500,
    page+1, rowsPerPage
  )

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const refreshPage = async () => {
    const phone = await getAllPhones(rowsPerPage, page, null, null, null, null, null, null, null, null);
    setPhones(phone)
  }

  return (
    <div className="admin">
      <h1 className="admin__title">Phones</h1>
      <div className="admin__tab-panel">
        {
          error ? <h3>Some Error</h3> :
            loading ? <Spinner /> : 
              <PhonesTable 
                phones={phones?.phones}
                count={phones?.count}
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

export default Phones;