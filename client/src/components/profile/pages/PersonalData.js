import { MenuItem, Select, TextField } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import Title from '../components/Title';

const PersonalData = ({profile: {email,first_name,last_name, date_of_birth, gender}}) => {
  const { register: dataChange, handleSubmit, formState: { errors } } = useForm()
  const onSubmit = data => console.log(data);
  const [selectedDate, setSelectedDate] = useState(new Date(date_of_birth));
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <Title>Personal Data</Title>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="first_name"
          label="First Name"
          name="first_name"
          autoComplete="text"
          defaultValue={first_name}
          {...dataChange("first_name", { required: true })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="last_name"
          label="Last Name"
          name="last_name"
          autoComplete="text"
          defaultValue={last_name}
          {...dataChange("last_name", { required: true })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          defaultValue={email}
          {...dataChange("email", { required: true })}
        />
        <KeyboardDatePicker
          margin="normal"
          id="dob"
          maxDate="2007"
          label="Date Of Birth"
          format="MM/dd/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <Select
          style={{width: "100%"}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={gender}
          {...dataChange("gender", { required: true })}
        >
          <MenuItem value="m">M</MenuItem>
          <MenuItem value="f">F</MenuItem>
          <MenuItem value="bi">BI</MenuItem>
          <MenuItem value="trans">TRANS</MenuItem>
          <MenuItem value="adg">ADG</MenuItem>
          <MenuItem value="neut">NEUT</MenuItem>
          <MenuItem value="fem">FEM</MenuItem>
          <MenuItem value="agen">AGEN</MenuItem>
        </Select>
      </form>
    </div>
  );
};

export default PersonalData;