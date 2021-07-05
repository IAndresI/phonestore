import { Container, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from '../components/Slider';
import { getNewestPhones } from '../http/phoneAPI';

const useStyles = makeStyles(() => ({
  title: {
    textAlign: 'center'
  },
  link: {
    textDecoration: 'none',
    color: '#ffffff',
    display: 'block',
    margin: '0 auto 30px',
    padding: '20px 40px',
    backgroundColor: '#3f51b5',
    width: 'fit-content',
    borderRadius: 10,
    fontSize: 20,
    transition: 'all .5s',
    border: '1px solid #3f51b5',
    '&:hover': {
      color: '#3f51b5',
      backgroundColor: '#ffffff',
    }
  }
}));

const Home = () => {

  const [newestPhones, setNewestPhones] = useState([])
  const [loading, setLoading] = useState(true)

  const classes = useStyles();

  useEffect(() => {
    getNewestPhones().then(data => {
      setNewestPhones(data)
      setLoading(false)
    })
  }, [])

  return (
    <section>
      <h1 className="title">PhoneStore</h1>
      <Container>
        <Link className={classes.link} to="/shop">Let's shop!</Link>
        <h2 className={classes.title}>Newest phones</h2>
        {
          loading ? null : <Slider phones={newestPhones}/>
        }
      </Container>
    </section>
  );
};

export default Home;