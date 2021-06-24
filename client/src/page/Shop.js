import { Grid, InputLabel, makeStyles, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Filter from '../components/Filter';
import { useDispatch, useSelector } from 'react-redux';
import Phone from '../components/Phone';
import { fetchingManufacturer, fetchingPhones, onPageSet } from '../store/actions';
import { getAllPhones } from '../http/phoneAPI';
import { getAllManufacturer } from '../http/manufacturerAPI';
import Pagination from '@material-ui/lab/Pagination';
import Spinner from '../components/Spinner';

const Shop = () => {
  const phone = useSelector(state => state.phone.phoneList);
  const manufacturer = useSelector(state => state.phone.manufacturer);
  const totalCount = useSelector(state => state.phone.totalCount)
  const limit = useSelector(state => state.page.limit)
  const page = useSelector(state => state.page.page)
  const pickedColor = useSelector(state => state.filter.color)
  const pickedManufacturer = useSelector(state => state.filter.manufacturer)
  const pickedPrice = useSelector(state => state.filter.price)

  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true)
  const [paginationCount, setPaginationCount] = useState(1)

  const dispatch = useDispatch();

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  const paginationChange = (event, value) => {
    dispatch(onPageSet(value))
  }

  useEffect(() => {
    const pageCount = Math.ceil(totalCount/limit);
    setPaginationCount(pageCount)
  }, [totalCount])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(async () => {
      await getAllManufacturer().then(data => {
        dispatch(fetchingManufacturer(data))
      });
      await getAllPhones(page, limit, sort, pickedColor, pickedManufacturer, pickedPrice).then(data => {
        dispatch(fetchingPhones(data));
      });
      setLoading(false)
    }, 500);
    return () => clearTimeout(timer);
  }, [page, sort, pickedColor, pickedManufacturer, pickedPrice])

  const useStyles = makeStyles(() => ({
    sort: {
      width: 200,
      marginTop: 10
    },
    sortLabel: {
      fontSize: 20,
      color: 'black',
      marginRight: 15
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 30,
      width: '100%'
    }
  }));
  const classes = useStyles();

  return (
    <section>
      <h1>Shop</h1>
      <Grid style={{flexWrap: "nowrap"}} container spacing={1}>
        <Grid style={{marginRight: 30}} container md={3}>
          <Filter manufacturer={manufacturer}/>
        </Grid>
        <Grid style={{flexDirection: "column"}} container md={9}>
          <Grid style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{marginTop: 30}}>Found {loading ? "-" : totalCount} phones</h2>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 20}}>
              <InputLabel className={classes.sortLabel} htmlFor="outlined-age-native-simple">Sort By</InputLabel>
                  <Select
                className={classes.sort}
                native
                value={sort}
                onChange={handleChange}
                label="sort"
              >
                <option value="">No sort</option>
                <option value="ASC">Price: low to high</option>
                <option value="DESC">Price: high to low</option>
              </Select>
            </div>
          </Grid>
          <Grid container>
            {
              !loading ? 
              (
                <>
                  {
                    phone.map(e => <Phone key={e.id} phone={{...e, manufacturer: manufacturer.find(el => el.manufacturer_id===e.manufacturer_id)?.name}}/>)
                  }
                  <div className={classes.pagination}>
                    <Pagination style={{display: paginationCount === 1 ? 'none' : 'block',}} page={page} onChange={paginationChange} defaultPage={page} count={paginationCount} variant="outlined" color="primary" />
                  </div>
                </>
              )
              : <Spinner/>
            }
            
          </Grid>
        </Grid>
      </Grid>
    </section>
  );
};

export default Shop;