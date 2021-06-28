import { Container } from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { getProfile } from '../http/userAPI';

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const client_id = useSelector(state => state.user.user.id);
  useEffect(() => {
    getProfile(client_id).then(data => {
      setProfile(data);
    })
  }, []);
  return (
    <section className="section">
      <h1 className="title">Profile</h1>
      <Container>
        {JSON.stringify(profile)}
      </Container>
    </section>
  );
};

export default Profile;