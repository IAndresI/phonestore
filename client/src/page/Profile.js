import { Container, makeStyles, Snackbar } from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { getProfile, putProfile } from '../http/userAPI';
import Spinner from '../components/Spinner';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PersonalData from '../components/profile/tabs/PersonalData';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  aside: {
    width: '30%',
    marginRight: 30,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    height: '100%'
  },
  content: {
    width: '70%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  userImageContainer: {
    width: 250,
    height: 250,
    overflow: 'hidden',
    borderRadius: '50%',
    marginBottom: 10
  },
  userImage: {
    width: 250,
    height: 250,
    objectFit: "cover",
    display: "block"
  },
  userName: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 30
  },
  root: {
    display: 'flex',
    width: '100%'
  },
  tab: {
    width: '100%',
    maxWidth: '100%',
    textTransform: 'none',
    fontSize: 18
  },
  indicator: {
    right: 'auto',
    left: 0,
    backgroundColor: '#3f51b5'
  },
}));

const Profile = () => {

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const client_id = useSelector(state => state.user.user.id);
  
  const classes = useStyles();

  useEffect(() => {
    setLoading(true)
    getProfile(client_id).then(data => {
      setProfile(data);
      setLoading(false)
    })
  }, []);

  // Form handlers

  const onPersonalDataSubmit = async ({
    date_of_birth,
    email,
    first_name,
    gender,
    image,
    last_name
    }, setLoad) => {
    try {
      setLoad(true)
      handleClose();
      const formData = new FormData();

      formData.append('date_of_birth', `${date_of_birth}`)
      formData.append('email',`${email}` )
      formData.append('first_name',`${first_name}` )
      formData.append('last_name',`${last_name}` )
      formData.append('gender',`${gender}` )
      formData.append('client_id',`${client_id}` )
      if(image) formData.append('image', image)
      formData.append('image', null)
      const put = await putProfile(client_id, formData).then(data => {
        handleClick();
        getProfile(client_id).then(data => {
          setProfile(data);
          setLoad(false)
        })
      });
      return put;
    }
    catch(e) {
      alert(e.response?.data?.message?.detail || e.response?.data?.message || e.message)
    }
  }

  // Tabs

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Alert

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  
  if(loading) return <Spinner />

  const imagePath = `${process.env.REACT_APP_API_URL}/${profile.image ? profile.image : "user.png"}`
  return (
    <section className="profile">
      <h1 className="title">Profile</h1>
      <Container className={classes.container}>
        <div className={classes.aside}>
          <div className={classes.userInfo}>
            <div className={classes.userImageContainer}>
              <img className={classes.userImage} alt={profile.name} src={imagePath}/>
            </div>
            <span className={classes.userName}>{profile.first_name} {profile.last_name}</span>
            <div className={classes.root}>
              <Tabs
                orientation="vertical"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs"
                classes={{root: classes.tab, indicator: classes.indicator}}
              >
                <Tab classes={{root: classes.tab}} label="Personal Data" {...a11yProps(0)} />
                <Tab classes={{root: classes.tab}} label="Change Password" {...a11yProps(1)} />
                <Tab classes={{root: classes.tab}} label="Orders" {...a11yProps(2)} />
              </Tabs>
            </div>
          </div>
        </div>
        <div className={classes.content}>
          <TabPanel value={value} index={0}>
            <PersonalData profile={profile} onSubmit={onPersonalDataSubmit}/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            Change Password
          </TabPanel>
          <TabPanel value={value} index={2}>
            Orders
          </TabPanel>
        </div>
      </Container>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Success!
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Profile;