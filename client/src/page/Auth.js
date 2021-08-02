import React, { useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useSelector, useDispatch } from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import { LOGIN_ROUTE } from '../utils/consts';
import {KeyboardDatePicker} from '@material-ui/pickers';
import { registration, login } from '../http/userAPI';
import { useForm, Controller  } from "react-hook-form";
import Alert from '@material-ui/lab/Alert';
import {onLogin, setCart} from '../store/actions'
import { InputLabel, MenuItem, Select } from '@material-ui/core';
import { getCart } from '../http/cartAPI';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  file: {
    padding: theme.spacing(2, 0)
  }
}));

export default withRouter(function SignIn({location, history}) {
  const [selectedDate, setSelectedDate] = useState(new Date('2006-08-18T21:11:54'));
  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch()
  const [image, setImage] = useState(null)

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const imageChange = (e) => {
    setImage(e.target.files[0])
  }


  const classes = useStyles();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const isAuth = useSelector(state => state.user.isAuth);

  const click = async (data) => {
    try {
      let user;
      if(isLogin) {
        user = await login(data.email, data.password);
        dispatch(onLogin(user))
        getCart(user.cart_id).then(data => dispatch(setCart(data)));
      }
      else {
        const month = selectedDate.getUTCMonth() + 1;
        const day = selectedDate.getUTCDate();
        const year = selectedDate.getUTCFullYear();

        const newdate = year + "/" + month + "/" + day;
        const formData = new FormData();
        formData.append('password', `${data.password}`)
        formData.append('date_of_birth', `${newdate}`)
        formData.append('email',`${data.email}` )
        formData.append('phone',`${data.phone}` )
        formData.append('first_name',`${data.first_name}` )
        formData.append('last_name',`${data.last_name}` )
        formData.append('gender',`${data.gender}` )
        formData.append('image', image)
        user = await registration(formData);
        history.push("/login")
      }
    }
    catch(e) {
      alert(e.response.data.message.detail || e.response.data.message)
    }
  }

  const errorsShow = (error) => {

    const errorType = Object.keys(error).length !== 0 ? Object.entries(error)[0][0] : null;
    let errorText = null;

    switch (errorType) {
      case 'email': 
        errorText = "Email is required!"
        break;
      case 'password': 
        errorText = "Password is required!"
        break;
      case 'first_name': 
        errorText = "First name is required!"
        break;
      case 'last_name': 
        errorText = "Last name is required!"
        break;
      case 'gender': 
        errorText = "Gender is required!"
        break;
      default: return null;
    }

    return <Alert severity="error">{errorText}</Alert>
  }

  if (isAuth) return <Redirect to="/"/> 
  return (
    <section className="section page">
      {
        isLogin ? <h1 className="title">Login</h1>
        :
        <h1 className="title">Registration</h1>
      }
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            {
              isLogin ? <LockOutlinedIcon /> : <PersonAddIcon />
            }
          </Avatar>
          <Typography component="h1" variant="h5">
            {
              isLogin ? "Sign in" : "Registration"
            }
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit(click)}>
            {
              errorsShow(errors)
            }
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              defaultValue=""
              render={({ field }) =><TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                {...field}
              />}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              defaultValue=""
              render={({ field }) =><TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...field}
              />}
            />
            {
              !isLogin ? (
                <>
                  <Controller
                    name="first_name"
                    rules={{ required: true }}
                    control={control}
                    defaultValue=""
                    render={({ field }) =><TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="first_name"
                      label="Frist Name"
                      type="text"
                      id="first_name"
                      {...field}
                    />}
                  />
                  <Controller
                    name="last_name"
                    rules={{ required: true }}
                    control={control}
                    defaultValue=""
                    render={({ field }) =><TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="last_name"
                      label="Last Name"
                      type="text"
                      id="last_name"
                      {...field}
                    />}
                  />
                  <Controller
                    name="tel"
                    control={control}
                    defaultValue=""
                    render={({ field }) =><TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      name="tel"
                      label="Phone"
                      type="tel"
                      id="tel"
                      {...field}
                    />}
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
                  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Select
                      style={{width: "100%"}}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...field}
                    >
                      <MenuItem value="m">M</MenuItem>
                      <MenuItem value="f">F</MenuItem>
                      <MenuItem value="bi">BI</MenuItem>
                      <MenuItem value="trans">TRANS</MenuItem>
                      <MenuItem value="adg">ADG</MenuItem>
                      <MenuItem value="neut">NEUT</MenuItem>
                      <MenuItem value="fem">FEM</MenuItem>
                      <MenuItem value="agen">AGEN</MenuItem>
                    </Select>}
                  />
                  <TextField
                    inputProps={{ accept: ".jpg,.jpeg,.png,.webp" }}
                    className={classes.file}
                    variant="outlined"
                    margin="normal"
                    onChange={imageChange}
                    fullWidth
                    name="image"
                    label="Image"
                    type="file"
                    id="image"
                  />
                </>
              ) : null
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
            <Grid container>
              {
                isLogin ? (
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                )
                :
                null
              }
              <Grid item>
                {
                  isLogin ? (
                  <Link href="#" onClick={() => history.push("/registration")} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                  )
                  :
                  (
                  <Link href="#" onClick={() => history.push("/login")} variant="body2">
                    {"Have an account? Sign In"}
                  </Link>
                  )
                }
                
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </section>
  );
})