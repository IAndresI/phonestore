import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
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
    <section>
      {JSON.stringify(profile)}
    </section>
  );
};

export default Profile;