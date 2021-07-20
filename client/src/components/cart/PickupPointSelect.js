import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { setPickupPoint } from '../../store/actions';
import { useDispatch } from 'react-redux';

export default function PickupPointSelect({setValue, pickupPoints, defaultPoint, field}) {

  const dispatch = useDispatch()

  const pickupPointsAddress = [];
  for(let i = 0;i<pickupPoints.length;i++) {
    pickupPointsAddress.push(pickupPoints[i]?.address)
  }
  
  const [inputValue, setInputValue] = useState(``);

  return (
    <div className="select-point">
      <Autocomplete
        value={defaultPoint?.address}
        inputValue={defaultPoint?.address || inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          const findingPoint = pickupPoints.find(el => el.address===newInputValue);
          findingPoint ? dispatch(setPickupPoint(findingPoint)) : dispatch(setPickupPoint(null))
          setValue('pickupPoint', newInputValue)
        }}
        inputProps={{form: {autocomplete: 'off'}}}
        id="controllable-states"
        options={pickupPointsAddress}
        renderInput={(params) => <TextField {...params} label="Select Pick-up Point" variant="outlined" {...field} />}
      />
    </div>
  );
}