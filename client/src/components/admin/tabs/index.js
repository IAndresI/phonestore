import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  Dashboard,
  Manufacturers,
  Orders,
  Phones,
  Users 
} from '../tabContent';
import SnackBar from '../components/SnackBar';

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
      {value === index && children}
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
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: "100%",
    border: "1px solid rgba(0, 0, 0, 0.12)"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: "20%"
  },
  flexContainer: {
    alignItems: "center",
  },
  tab: {
    fontSize: 16,
    width: "100%",
    letterSpacing: 2,
    fontWeight: 700,
  },
  tabPanel: {
    width: "100%",
  }
}));

export default function AdminTabs() {
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarState, setSnackBarState] = useState("success")
  const [snackBarText, setSnackBarText] = useState("")

  const handleSnackBarClick = ({message, type}) => {
    setOpenSnackBar(true);
    setOpenSnackBar(true);
    switch(type) {
      case "success":
        setSnackBarState("success");
        setSnackBarText(message || "Success");
        break;
      case "error":
        setSnackBarState("error");
        setSnackBarText(message || "Error");
        break;
      case "loading":
        setSnackBarState("warning");
        setSnackBarText("Loading");
        break;
      default: 
        setSnackBarState("info");
        setSnackBarText(message || "Unhandled State!");
        break;
    }
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  const tabHandleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tab}
        onChange={tabHandleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        classes={{flexContainer: classes.flexContainer}}
      >
        <Tab className={classes.tab} label="Dashboard" {...a11yProps(1)} />
        <Tab className={classes.tab} label="Users" {...a11yProps(1)} />
        <Tab className={classes.tab} label="Orders" {...a11yProps(2)} />
        <Tab className={classes.tab} label="Phones" {...a11yProps(3)} />
        <Tab className={classes.tab} label="Manufacturers" {...a11yProps(4)} />
      </Tabs>
      <TabPanel  className={classes.tabPanel} value={tab} index={0}>
        <Dashboard />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={tab} index={1}>
        <Users makeAlert={handleSnackBarClick} />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={tab} index={2}>
        <Orders makeAlert={handleSnackBarClick} />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={tab} index={3}>
        <Phones />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={tab} index={4}>
        <Manufacturers />
      </TabPanel>
      <SnackBar 
        open={openSnackBar} 
        handleClose={handleSnackBarClose}
        handleClick={handleSnackBarClick} 
        snackBarState={snackBarState}
        text={snackBarText}
      />
    </div>
  );
}