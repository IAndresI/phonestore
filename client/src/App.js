import './index.scss'
import {BrowserRouter as Router} from 'react-router-dom';
import AppRouter from './components/AppRouter'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

function App() {
  return (

    <Router>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <AppRouter/>
      </MuiPickersUtilsProvider>
    </Router>
    
  );
}

export default App;
