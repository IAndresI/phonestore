import { Grid, Input, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import Filter from '../components/Filter';
import { useDispatch, useSelector } from 'react-redux';
import Phone from '../components/Phone';
import { fetchingManufacturer, fetchingPhones } from '../store/actions';
import { getAllPhones } from '../http/phoneAPI';
import { getAllManufacturer } from '../http/manufacturerAPI';

const Shop = () => {
  const phone = useSelector(state => state.phone.phoneList);
  const manufacturer = useSelector(state => state.phone.manufacturer);
  const dispatch = useDispatch();

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
  }));
  const classes = useStyles();

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  useEffect(() => {
    getAllManufacturer().then(data => {
      dispatch(fetchingManufacturer(data))
    });
    getAllPhones().then(data => {
      dispatch(fetchingPhones(data))
    });
  }, [])

  const [sort, setSort] = React.useState("desc");


  return (
    <Layout>
      <h1>Shop</h1>
      <Grid style={{flexWrap: "nowrap"}} container spacing={1}>
        <Grid style={{marginRight: 30}} container md={3}>
          <Filter manufacturer={manufacturer}/>
        </Grid>
        <Grid style={{flexDirection: "column"}} container md={9}>
          <Grid style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{marginTop: 30}}>Found {phone.length} phones</h2>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 20}}>
              <InputLabel className={classes.sortLabel} htmlFor="outlined-age-native-simple">Sort By</InputLabel>
                  <Select
                className={classes.sort}
                native
                value={sort}
                onChange={handleChange}
                label="Age"
                inputProps={{
                  name: 'age',
                  id: 'outlined-age-native-simple',
                }}
              >
                <option value="Price: low to high">Price: low to high</option>
                <option value="Price: high to low">Price: high to low</option>
              </Select>
            </div>
          </Grid>
          <Grid container>
            {
              phone.map(e => <Phone key={e.id} phone={{...e, manufacturer: manufacturer.find(el => el.manufacturer_id===e.manufacturer_id)?.name}}/>)
            }
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Shop;