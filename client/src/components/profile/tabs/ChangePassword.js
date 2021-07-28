import React, {useState} from 'react';
import Title from '../components/Title';
import { Button, TextField } from '@material-ui/core';
import {Controller, useForm} from 'react-hook-form'
import Spinner from '../../Spinner';
import Alert from '@material-ui/lab/Alert';

const ChangePassword = ({onSubmit}) => {

  const {control, handleSubmit, formState: {errors}} = useForm()

  const [apiErrors, setApiErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const getErrorText = (err) => {

    const errorType = Object.keys(err).length !== 0 ? Object.entries(err)[0][0] : null;

    switch (errorType) {
      case "current_password":
        return "Enter correct current password!"
      case "current_not_match": 
        return "You entered wrong current password!";
      case "new_password":
        switch(err[errorType].type){
          case "minLength": return "New password is too short! (Minimum 3 characters)";
          default: return "Enter correct new password!"
        }
      case "confirm_password":
        return "Enter correct confirm password!"
      case "new_not_match":
        return "New and Confirm passwords do not match!"
      default: return "";
    }
  }

  if(loading) return <Spinner />

  return (
    <div>
      <Title>Change Password</Title>
      {
        Object.keys({...errors, ...apiErrors}).length !== 0
          ? 
          <Alert className="profile__personal-alert" severity="error">
            {getErrorText({...errors, ...apiErrors})}
          </Alert> 
          : 
          null
      }
      <form onSubmit={handleSubmit(data => onSubmit(data, setLoading, setApiErrors))}>
        <Controller
          name="current_password"
          control={control}
          rules={{ required: true}}
          defaultValue=""
          render={({ field }) =><TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="current_password"
            label="Enter Current Password"
            name="current_password"
            type="password"
            {...field}
          />}
        />
       
        <Controller
          name="new_password"
          control={control}
          rules={{ required: true, minLength: { value: 3, message: 'too short'}  }}
          defaultValue=""
          render={({ field }) =><TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="new_password"
            label="Enter New Password"
            name="new_password"
            type="password"
            {...field}
          />}
        />
         <Controller
          name="confirm_password"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) =><TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="confirm_password"
            label="Confirm New Password"
            name="confirm_password"
            type="password"
            {...field}
          />}
        />
        <Button
          variant="contained"
          type='submit'
          color={loading ? 'default' : "primary"}
          className="profile__submit"
          disabled={loading}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;