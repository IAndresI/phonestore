import { Container, Grid, InputLabel, makeStyles, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Filter from '../components/Filter';
import { useDispatch, useSelector } from 'react-redux';
import Phone from '../components/Phone';
import { fetchingPhones, onPageSet } from '../store/actions';
import { getAllPhones, getFilter } from '../http/phoneAPI';
import Pagination from '@material-ui/lab/Pagination';
import Spinner from '../components/Spinner';
import { usePageDataLoad } from '../customHooks';

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
  },
  nothingsFound: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 30,
    marginTop: 40
  },
  button: {
    backgroundColor: "#3f51b5",
    borderRadius: 10,
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 500,
    padding: '15px 30px',
    color: "#ffffff",
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    textDecoration: 'none',
    textTransform: "none",
    border: '1px solid #3f51b5',
    "&:hover, &:focus": {
      outline: "transparent",
      color: "#3f51b5",
      backgroundColor: "#ffffff",
    },
    "&:active": {
      color: "#ffffff",
      backgroundColor: "#3f51b5",
    }
  }
}));

const Shop = () => {

  // store

  const dispatch = useDispatch();

  // Styles

  const classes = useStyles();

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

  // On filter change

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  const paginationChange = (event, value) => {
    dispatch(onPageSet(value))
  }

  // Data reciev

  const [phones, setData, loading, error] = usePageDataLoad(
    () => getAllPhones(page, limit, sort, pickedColor, pickedManufacturer, pickedPrice, pickedRam, pickedRom, pickedCamera, pickedDiagonal),
    500,
    page, limit, sort, pickedColor, pickedManufacturer, pickedRam, pickedRom, pickedCamera, pickedDiagonal, pickedPrice
  )

  const [filtres, setFiltres, filtresLoading, filtresError] = usePageDataLoad(
    getFilter,
    null,
    dispatch
  )

  useEffect(() => {
    const pageCount = Math.ceil(totalCount/limit);
    setPaginationCount(pageCount)
  }, [totalCount])

  useEffect(() => {
    if (phones) dispatch(fetchingPhones(phones));
  }, [phones])

  // loading && error

  if (error) return <h3>Theres an error: {error.message}</h3>

  return (
    <section className="section page">
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
                  <option value="phone_name ASC">Name: A-Z</option>
                  <option value="phone_name DESC">Name: Z-A</option>
              </Select>
            </div>
          </Grid>
          <div style={{display: 'flex'}}>
            <Grid style={{marginRight: 30, marginTop: 15}}>
              {
                filtresLoading ? <Spinner /> : <Filter {...filtres}/>
              }
            </Grid>
            {
              loading ? <Spinner/>
              : 
              phone.length > 0 ? 
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
                :
                <span className={classes.nothingsFound}>Nothings Found</span>
            }
          </div>
        </Grid>
      </Container>
    </section>
  );
};

export default Shop;