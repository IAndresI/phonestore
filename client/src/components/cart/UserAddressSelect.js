import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { setDeliveryAddress } from '../../store/actions';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { useDispatch } from 'react-redux';


export default function LocationSearchInput({defaultAddress}) {

  const [address, setAddress] = useState('')

  const dispatch = useDispatch()

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
  );
}