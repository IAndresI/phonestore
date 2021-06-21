import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import { LOGIN_ROUTE } from '../utils/consts';
import {KeyboardDatePicker} from '@material-ui/pickers';
import { registration, login } from '../http/userAPI';
import { useForm } from "react-hook-form";
import Alert from '@material-ui/lab/Alert';
import {onLogin} from '../store/actions'
import { InputLabel, MenuItem, Select } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
  const { register, handleSubmit, formState: { errors } } = useForm();
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
      alert(e.response.data.message.detail)
    }
    
  }


  if (isAuth) return <Redirect to="/"/> 

  return (
    <Layout>
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
              errors.email || errors.password || errors.last_name || errors.first_name || errors.dob || errors.gender
                ? <Alert severity="error">{(errors.email && "Email required!") || (errors.password && "Password required!") || (errors.last_name && "Last name required!") || (errors.first_name && "Fast name required!") || (errors.dob && "Entre correct date of birthday!") || (errors.gender && "Gender required!") }</Alert> : null
            }
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              {...register("email", { required: true })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register("password", { required: true })}
            />
            {
              !isLogin ? (
                <>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="first_name"
                    label="Frist Name"
                    type="text"
                    id="first_name"
                    {...register("first_name", { required: true })}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="last_name"
                    label="Last Name"
                    type="text"
                    id="last_name"
                    {...register("last_name", { required: true })}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="tel"
                    label="Phone"
                    type="tel"
                    id="tel"
                    {...register("phone")}
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
                  <Select
                    style={{width: "100%"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    {...register("gender", { required: true })}
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
                  <TextField
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
            {
              isLogin ? (
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
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
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </Layout>
  );
})