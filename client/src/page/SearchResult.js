import { Container, Grid, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { search } from '../http/phoneAPI';
import Phone from '../components/Phone';
import Spinner from '../components/Spinner';
import {useDispatch, useSelector} from 'react-redux'
import { onSearch } from '../store/actions';
import Pagination from '@material-ui/lab/Pagination';
import usePageDataLoad from '../customHooks/usePageDataLoad';

const useStyles = makeStyles(() => ({
  input: {
    width: '100%',
    borderColor: 'black'
  },
  searchResult: {
    marginTop: 30,
    display: 'flex',
    flexWrap: "wrap",
    justifyContent: 'center'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 30,
    width: '100%'
  },
}));
  
const SearchResult = () => {

  
  // Store

  const dispatch = useDispatch()
  const searchText = useSelector(state => state.search.text)

  // Pagination

  const limit = 8
  const [page, setPage] = useState(1)
  const [paginationCount, setPaginationCount] = useState(1)

  const paginationChange = (event, value) => {
    setPage(value)
  }

  // Phones
  
  const [findingPhone, setFindingPhone] = useState([])
  const [data, setData, loading, error] = usePageDataLoad(() => search(searchText?.toLowerCase(),limit, page), 500, searchText, page)


  const classes = useStyles();

  const getSearch = (e) => {
    dispatch(onSearch(e.target.value))
  }

  useEffect(() => {
    if(data) {
      if(!searchText) {
        setFindingPhone([])
        setPage(1)
      }
      else {
        setPage(1)
        setFindingPhone([1]);
        setFindingPhone(data.phones);
        setPaginationCount(Math.ceil(data.count/limit))
      }
    }
    
  }, [data])
  
  // Error Indicator

  if(error) return <h3>Some Error {error.message}</h3>

  return (
    <section className="section page">
      <h1 className="title">Search</h1>
      <Container>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField value={searchText} onChange={getSearch} className={classes.input} id="outlined-basic" label="Search..." variant="outlined" />
        </form>
        <div className={classes.searchResult}>
          {
            loading ? <Spinner />
            : 
            (
              <Grid style={{display: 'flex', flexWrap: 'wrap', height: "100%", width:"100%",justifyContent: 'center'}}>
                {
                  (() => {
                    if(!searchText) return <h2>Start Searching!</h2>
                    else if (findingPhone.length <= 0) return <h2>Nothing Found!</h2>
                    else return(
                      <>
                        {findingPhone.map(e => <Phone key={e.phone_id} phone={e}/>)}
                        <div className={classes.pagination}>
                          <Pagination style={{display: paginationCount === 1 ? 'none' : 'block',}} page={page} onChange={paginationChange} defaultPage={page} count={paginationCount} variant="outlined" color="primary" />
                        </div>
                      </>
                    )
                  })()
                }
              </Grid>
            )
          }
        </div>
      </Container>
    </section>
    
  );
};

export default SearchResult;