import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { setDeliveryAddress } from '../../store/actions';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Controller } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  deliveryInfo: {
    display: "flex",
    justifyContent: "space-between",
  },
  deliveryInfoItem: {
    margin: "0 10px",
    "&:first-child": {
      marginLeft: 0
    },
    "&:last-child": {
      marginRight: 0
    }
  },
  delivery: {
    width: '100%'
  },
}))

export default function LocationSearchInput({defaultAddress, setValue, control}) {

  const [address, setAddress] = useState('')

  const dispatch = useDispatch()

  const classes= useStyles()

  const handleChange = (address) => {
    setAddress(address);
  };
 
  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then(results => {
        setAddress(results[0].formatted_address);
        dispatch(setDeliveryAddress(results[0].formatted_address))
        return getLatLng(results[0])
      });
  };

  const defaultBounds = {
    north: 60.736076,
    south: 59.487377,
    east: 31.504418,
    west: 27.937290,
  };

  const searchOptions = {
    bounds: defaultBounds,
    strictBounds: true,
    componentRestrictions: { country: ["ru"] },
    fields: ["address_components", "geometry"],
    types: ["address"],
   };

  return (
    <div className={classes.delivery}>
      <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
      searchOptions={searchOptions}
      >
        {
          ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <Autocomplete
              className="select-point"
              value={defaultAddress}
              inputValue={defaultAddress || address}
              onInputChange={(event, newInputValue) => {
                setAddress(newInputValue);
                dispatch(setDeliveryAddress(suggestions.some(el => el.description === newInputValue) ? newInputValue : null))
                setValue("delivery-avenue",newInputValue)
              }}
              id="controllable-states"
              options={suggestions.map(suggestion => suggestion.description).filter(el => el.toLocaleLowerCase().match('санкт') || el.toLocaleLowerCase().match('ленин'))}
              renderInput={
                (params) => <TextField 
                  {...getInputProps({
                    placeholder: 'Search Places...',
                    className: 'location-search-input ',
                  })} 
                  {...params} 
                  label="Select Delivery Address" 
                  variant="outlined" 
                />
              }
            />
          )
        }
      </PlacesAutocomplete>
      <div className={classes.deliveryInfo}>
        <Controller
          name="room"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <TextField
            className={classes.deliveryInfoItem}
            id="outlined-required"
            label="Room"
            placeholder="Enter Room"
            variant="outlined"
            {...field }
          />}
        />
        <Controller
          name="entrance"
          control={control}
          render={({ field }) => <TextField
            className={classes.deliveryInfoItem}
            id="outlined-required"
            label="Entrance"
            placeholder="Enter Entrance"
            variant="outlined"
            {...field }
          />}
        />
        <Controller
          name="floor"
          control={control}
          render={({ field }) => <TextField
            className={classes.deliveryInfoItem}
            id="outlined-required"
            label="Floor"
            placeholder="Enter Floor"
            variant="outlined"
            {...field }
          />}
        />
      </div>
    </div>
  );
}