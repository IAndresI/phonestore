import { Grid } from '@material-ui/core';
import React from 'react';
import Layout from '../components/Layout';
import Filter from '../components/Filter';
import { useSelector } from 'react-redux';
import Phone from '../components/Phone';

const Shop = () => {
  const phone = useSelector(state => state.phone.phoneList)
  const manufacturer = useSelector(state => state.phone.manufacturer)
  console.log();
  return (
    <Layout>
      <h1>Shop</h1>
      <Grid container spacing={1}>
        <Grid container item md={3}>
          <Filter/>
        </Grid>
        <Grid container item md={9}>
          {
            phone.map(e => <Phone key={e.id} phone={{...e, manufacturer: manufacturer.find(el => el.id===e.manufacturer_id).name}}/>)
          }
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Shop;