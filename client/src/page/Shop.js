import { Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import Filter from '../components/Filter';
import { useDispatch, useSelector } from 'react-redux';
import Phone from '../components/Phone';
import { fetchingManufacturer, fetchingPhones } from '../store/actions';
import { getAllPhones } from '../http/phoneAPI';
import { getAllManufacturer } from '../http/manufacturerAPI';

const Shop = () => {
  const phone = useSelector(state => state.phone.phoneList)
  const manufacturer = useSelector(state => state.phone.manufacturer)
  const dispatch = useDispatch();

  useEffect(() => {
    getAllManufacturer().then(data => {
      dispatch(fetchingManufacturer(data))
    });
    getAllPhones().then(data => {
      dispatch(fetchingPhones(data))
    });
  }, [])

  return (
    <Layout>
      <h1>Shop</h1>
      <Grid style={{flexWrap: "nowrap"}} container spacing={1}>
        <Grid style={{marginRight: 30}} container item md={3}>
          <Filter manufacturer={manufacturer}/>
        </Grid>
        <Grid container item md={9}>
          {
            phone.map(e => <Phone key={e.id} phone={{...e, manufacturer: manufacturer.find(el => el.manufacturer_id===e.manufacturer_id)?.name}}/>)
          }
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Shop;