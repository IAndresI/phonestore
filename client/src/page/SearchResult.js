import { Container, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { search } from '../http/phoneAPI';
import Phone from '../components/Phone';
import Spinner from '../components/Spinner';
import {useDispatch, useSelector} from 'react-redux'
import { onSearch } from '../store/actions';


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
  }
}));
  
const SearchResult = () => {
  
  const [findingPhone, setFindingPhone] = useState([])
  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()
  const searchText = useSelector(state => state.search.text)

  const classes = useStyles();

  const getSearch = (e) => {
    dispatch(onSearch(e.target.value))
  }

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(async () => {
      search(searchText.toLowerCase()).then((data) => {
        setFindingPhone(data);
      })
      setLoading(false)
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText])

  return (
    <section className="section">
      <h1 className="title">Search</h1>
      <Container>
        <form>
          <TextField value={searchText} onChange={getSearch} className={classes.input} id="outlined-basic" label="Search..." variant="outlined" />
        </form>
        <div className={classes.searchResult}>
          {
            loading ? <Spinner />
            : findingPhone.map(e => <Phone key={e.phone_id} phone={e}/>)
          }
        </div>
      </Container>
    </section>
    
  );
};

export default SearchResult;