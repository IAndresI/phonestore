import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import RateReviewIcon from '@material-ui/icons/RateReview';
import Box from '@material-ui/core/Box';
import Characteristics from '../tabContent/Characteristics';
import Comments from '../tabContent/Comments';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
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
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  panel: {
    minHeight: 300
  }
}));

export default function ScrollableTabsButtonForce({characteristics}) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [commentPage, setCommentPage] = useState(1)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="phone tabs"
        >
          <Tab label="Characteristics" icon={<PhonelinkSetupIcon />} {...a11yProps(0)} />
          <Tab label="Reviews" icon={<RateReviewIcon />} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel className={classes.panel} value={value} index={0}>
        <Characteristics characteristics={characteristics}/>
      </TabPanel>
      <TabPanel className={classes.panel} value={value} index={1}>
        <Comments phoneId={characteristics?.phone?.phone_id} page={commentPage} setPage={setCommentPage}/>
      </TabPanel>
    </div>
  );
}