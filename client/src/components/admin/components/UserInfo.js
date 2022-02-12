import React, {useState} from 'react'
import { makeStyles, Table,TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Spinner from '../../Spinner';
import { usePageDataLoad } from '../../../customHooks';
import { deleteOrder, getOrderDetails } from '../../../http/orderAPI';
import DialogModal from './DialogModal';
import { deleteUser, getProfile } from '../../../http/userAPI';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  textLink: {
    textDecoration: "none",
    color: "inherit",
    fontSize: 20,
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    "&:hover": {
      color: "#3f51b5"
    },
    "&:focus": {
      color: "#3f51b5",
      outline: "transparent"
    },
    "&:active": {
      color: "inherit",
    }
  },
  imageLink: {
    transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    display: "flex",
    justifyContent: "center",
    "&:hover": {
      transform: "scale(1.2)"
    },
    "&:focus": {
      transform: "scale(1.1)",
      outline: "transparent"
    },
    "&:active": {
      transform: "scale(1)"
    }
  },
  button: {
    margin: "20px 0",
  },
  cardBody: {
    padding: "1rem"
  }
});

const UserInfo = ({clientId, makeAlert, refreshPage}) => {

  const [user, setUser, loading, error] = usePageDataLoad(() => getProfile(clientId))

  const [modalOpen, setModalOpen] = useState(false);

  const classes = useStyles();

  const fetchDeleteOrder = async () => {
    makeAlert({type: 'loading'})
    try {
      await deleteUser(clientId);
      refreshPage();
      makeAlert({type: 'success', message: 'Success!'})
    }catch(err) {
      makeAlert({type: 'error', message: err.message})
    }
    
  }

  if(loading) return <Spinner />

  if(error) return <h3>Some Error</h3>

  const dateRegistred = new Date(user.date_registred).toLocaleString().replace(',', " ")
  const dateOfBirth = new Date(user.date_of_birth).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(',', " ")
  
  return (
    <div>
      <div>
        <div>
          <div>
            <h4>ID</h4>
          </div>
          <div>
            {user.client_id}
          </div>
        </div>
        <hr />
        <div>
          <div>
            <h4>Full Name</h4>
          </div>
          <div>
            {`${user.first_name} ${user.last_name}`}
          </div>
        </div>
        <hr />
        <div>
          <div>
            <h4>Email</h4>
          </div>
          <div> 
            {user.email}
          </div>
        </div>
        <hr />
        <div>
          <div>
            <h4>Date Of Birth</h4>
          </div>
          <div> 
            {dateOfBirth}
          </div>
        </div>
        <hr />
        <div>
          <div>
            <h4>Gneder</h4>
          </div>
          <div> 
            {user.gender.toUpperCase()}
          </div>
        </div>
        <hr />
        <div>
          <div>
            <h4>Phone</h4>
          </div>
          <div> 
            {user.phone || "N/A"}
          </div>
        </div>
        <hr />
        <div>
          <div>
            <h4>Date Registred</h4>
          </div>
          <div> 
            {dateRegistred}
          </div>
        </div>
        <hr />
      </div>
      <button
        id={clientId}
        className={`${classes.button} button button--danger`}
        onClick={() => setModalOpen(true)}
      >
        Delete This Account
      </button>
      <DialogModal
        open={modalOpen}
        setOpen={setModalOpen}
        title="Delete account?"
        text="Are you sure you want to delete this account?"
        onYes={fetchDeleteOrder}
      />
    </div>
  );
};

export default UserInfo;