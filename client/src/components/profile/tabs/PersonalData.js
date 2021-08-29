import { Button, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, {useState} from 'react';
import Title from '../components/Title';

const PersonalData = ({profile: {email,first_name,last_name, date_of_birth, gender}, onSubmit}) => {

  const [loading, setLoading] = useState(false)

  const [userImage, setUserImage] = useState("")
  const [formData, setFormData] = useState({
    last_name,
    first_name,
    date_of_birth,
    image: null,
    email,
    gender
  })

  const handleDateChange = (date) => {
    const mydate = new Date(date);

    const month = mydate.getUTCMonth() + 1;
    const day = mydate.getUTCDate();
    const year = mydate.getUTCFullYear();
    
    const newdate = year + "/" + month + "/" + day;
    setFormData({...formData, date_of_birth: newdate})
  };

  const setPreviewIamge = (e) => {
    setUserImage(e.target.files[0])
    setFormData({...formData, image: e.target.files[0]})
  }

  const inputOnChangeHandler = (value, type) => {
    switch (type) {
      case "first_name":
        setFormData(() => ({...formData, first_name: value}));
        break;
      case "last_name":
        setFormData(() => ({...formData, last_name: value}));
        break;
      case "email":
        setFormData(() => ({...formData, email: value}));
        break;
      case "gender":
        setFormData(() => ({...formData, gender: value}));
        break;
      default: 
        return;
    }
  }

  const formSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, setLoading);
  }

  const imagePath = userImage ? URL.createObjectURL(userImage) : null;

  return (
    <div className="profile__personal">
      <Title>Personal Data</Title>
      {
        formData.first_name.trim().length < 1 || formData.last_name.trim().length < 1 || formData.email.trim().length < 1
          ? 
          <Alert className="profile__personal-alert" severity="error">{(( 
            formData.first_name.trim().length < 1 && "First name required!") 
            || (formData.last_name.trim().length < 1 && "Last name required!") 
            || (formData.email.trim().length < 1 && "Email required!"))}
          </Alert> 
          : 
          null
      }
      <form className="profile__personal-form" noValidate onSubmit={formSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="first_name"
          label="First Name"
          name="first_name"
          autoComplete="text"
          onChange={(e) => inputOnChangeHandler(e.target.value, "first_name")}
          value={formData.first_name}
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
          onChange={(e) => inputOnChangeHandler(e.target.value, "last_name")}
          value={formData.last_name}
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
          onChange={(e) => inputOnChangeHandler(e.target.value, "email")}
          value={formData.email}
        />
        <KeyboardDatePicker
          className="profile__input"
          margin="normal"
          id="dob"
          maxDate="2007"
          minDate="1931"
          label="Date Of Birth"
          format="dd-MM-yyy"
          value={formData.date_of_birth}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Gender
        </InputLabel>
        <Select
          className="profile__input"
          labelId="demo-simple-select-placeholder-label-label"
          id="demo-simple-select"
          onChange={(e) => inputOnChangeHandler(e.target.value, "gender")}
          value={formData.gender}
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
        <Button
          variant="contained"
          component="label"
          className="profile__button" 
          color={userImage ? 'primary' : "default"}
        >
          Change Avatar
          <input
            className="profile__file-upload"
            type="file"
            onChange={setPreviewIamge}
          />
        </Button>

        {
          userImage ?
          (
            <div className="profile__image-preview-container">
              <span className="profile__image-title">Iamge Preview</span>
              <div className="profile__image-container">
                <img className="profile__image-preview" alt={userImage.name} src={imagePath}/>
              </div>
            </div>
          )
          :
          null
        }
        
        <Button
          variant="contained"
          type='submit'
          color={loading ? 'default' : "primary"}
          className="profile__submit"
          disabled={loading}>
          Save
        </Button>
      </form>
    </div>
  );
};

export default PersonalData;