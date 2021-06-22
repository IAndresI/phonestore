import './index.scss'
import {BrowserRouter as Router} from 'react-router-dom';
import AppRouter from './components/AppRouter'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useState, useEffect } from 'react';
import { check } from './http/userAPI';
import { onLogin } from './store/actions';
import {useDispatch} from 'react-redux';
import { CircularProgress } from '@material-ui/core';

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    check().then(data => {  
      dispatch(onLogin(data))
    }).finally(() => setLoading(false))
    
  }, [])

  if(loading) return <CircularProgress style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0}}/>
  return (

    <Router>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <AppRouter/>
      </MuiPickersUtilsProvider>
    </Router>
    
  );
}

export default App;
