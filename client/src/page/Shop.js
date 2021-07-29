import { Container, Grid, InputLabel, makeStyles, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Filter from '../components/Filter';
import { useDispatch, useSelector } from 'react-redux';
import Phone from '../components/Phone';
import { fetchingPhones, onPageSet } from '../store/actions';
import { getAllPhones } from '../http/phoneAPI';
import Pagination from '@material-ui/lab/Pagination';
import Spinner from '../components/Spinner';

const Shop = ({setPageLoading}) => {

  // store

  const dispatch = useDispatch();

  // all phones
  
  const phone = useSelector(state => state.phone.phoneList);

  // pagination

  const totalCount = useSelector(state => state.phone.totalCount)
  const limit = useSelector(state => state.page.limit)
  const page = useSelector(state => state.page.page)
  const [paginationCount, setPaginationCount] = useState(1)

  // filter

  const pickedColor = useSelector(state => state.filter.color)
  const pickedManufacturer = useSelector(state => state.filter.manufacturer)
  const pickedPrice = useSelector(state => state.filter.price)
  const pickedRam = useSelector(state => state.filter.ram)
  const pickedRom = useSelector(state => state.filter.rom)
  const pickedCamera = useSelector(state => state.filter.camera)
  const pickedDiagonal = useSelector(state => state.filter.diagonal)

  // sort

  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(true)

  // on filter change and componentDidMount

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  const paginationChange = (event, value) => {
    dispatch(onPageSet(value))
  }

  useEffect(() => {
    setPageLoading(true)
  }, [])

  useEffect(() => {
    const pageCount = Math.ceil(totalCount/limit);
    setPaginationCount(pageCount)
  }, [totalCount])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(async () => {
      await getAllPhones(page, limit, sort, pickedColor, pickedManufacturer, pickedPrice,pickedRam,pickedRom,pickedCamera,pickedDiagonal).then(data => {
        dispatch(fetchingPhones(data));
      });
      setLoading(false)
    }, 500);
    return () => clearTimeout(timer);
  }, [page, sort, pickedColor, pickedManufacturer, pickedPrice,pickedRam,pickedRom,pickedCamera,pickedDiagonal, dispatch, limit])

  // styles

  const useStyles = makeStyles(() => ({
    sort: {
      width: 200
    },
    sortLabel: {
      fontSize: 20,
      color: 'black',
      marginRight: 15,
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 30,
      width: '100%'
    },
    shopInner: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    shopHeader: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }));

  const classes = useStyles();

  return (
    <section className="section">
      <h1 className="title">Shop</h1>
      <Container>
        <Grid className={classes.shopInner}>
          <Grid className={classes.shopHeader}>
            <h2 style={{marginTop: 30}}>Found {loading ? "-" : totalCount} phones</h2>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 20}}>
              <InputLabel className={classes.sortLabel} htmlFor="outlined-age-native-simple">Sort By</InputLabel>
                <Select
                className={classes.sort}
                native
                value={sort}
                onChange={handleChange}
                label="sort">
                  <option value="">No sort</option>
                  <option value="price ASC">Price: low to high</option>
                  <option value="price DESC">Price: high to low</option>
                  <option value="name ASC">Name: A-Z</option>
                  <option value="name DESC">Name: Z-A</option>
              </Select>
            </div>
          </Grid>
          <div style={{display: 'flex'}}>
            <Grid style={{marginRight: 30, marginTop: 15}}>
              <Filter/>
            </Grid>
            {
              !loading ? 
              (
                <Grid style={{display: 'flex', flexWrap: 'wrap', height: "100%", width:"100%",}}>
                  {
                    phone.map(e => <Phone key={e.phone_id} phone={e}/>)
                  }
                  <div className={classes.pagination}>
                    <Pagination style={{display: paginationCount === 1 ? 'none' : 'block',}} page={page} onChange={paginationChange} defaultPage={page} count={paginationCount} variant="outlined" color="primary" />
                  </div>
                </Grid>
              )
              : <Spinner/>
            }
          </div>
        </Grid>
      </Container>
    </section>
  );
};

export default Shop;