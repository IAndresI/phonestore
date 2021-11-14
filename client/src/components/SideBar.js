import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { Badge, Typography } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import CompareIcon from '@material-ui/icons/Compare';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { Link } from 'react-router-dom';
import {CART_ROUTE, SHOP_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, PROFILE_ROUTE, SEARCH_ROUTE, HOME_ROUTE} from '../utils/consts'
import { useDispatch, useSelector } from 'react-redux';
import { onLogout, setCart } from '../store/actions';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles({
  list: {
    width: 320,
  },
  fullList: {
    width: 'auto',
  },
  title: {
    textAlign: 'center',
    padding: "6px 0 2px",
    fontWeight: '700',
    backgroundColor: "#3f51b5",
    background: "linear-gradient(to bottom, #3f51b5 0.1%, #fafafa 90%, #fafafa 99%)"
  },
  link: {
    color: "inherit",
    textDecoration: "none"
  }
});

export default function SideBar({isAuth, cartItemsCount}) {
  const classes = useStyles();
  const [state, setState] = React.useState(false);
  const user = useSelector(state => state.user.user)
  const compare = useSelector(state => state.compare.items)
  const dispatch = useDispatch()

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState(open);
  };

  const list = (isAuth) => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Typography className={classes.title} variant="h3">
        PhoneStore
      </Typography>
      <List>
        {[['Home', HOME_ROUTE], ['Shop', SHOP_ROUTE], ['Compare', "/compare"], ['Search', SEARCH_ROUTE], ['Cart', isAuth ? `${CART_ROUTE}/${user.cart_id}` : CART_ROUTE]].map((item, index) => (
          <Link to={item[1]} key={item[0]} className={classes.link}>
            <ListItem button>
              <ListItemIcon>
                {
                  (() => {
                    switch(item[0]) {
                      case 'Home': return <HomeIcon />
                      case 'Shop': return <ShoppingBasketIcon />
                      case 'Compare': return (
                        <Badge badgeContent={compare.length} color="secondary">
                          <CompareIcon />
                        </Badge>
                      )
                      case 'Cart': return (
                        <Badge badgeContent={cartItemsCount} color="secondary">
                          <ShoppingCartIcon />
                        </Badge>
                      )
                      case 'Search': return <SearchIcon />
                      default: return <HomeIcon />
                    }
                  })()
                }
              </ListItemIcon>
              <ListItemText primary={item[0]} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        {
          isAuth ?
          (
            <>
              {
                [['Profile', `${PROFILE_ROUTE}`]].map((item, index) => (
                  <Link to={item[1]} key={item[0]} className={classes.link}>
                    <ListItem button>
                      <ListItemIcon>
                      {
                        (() => {
                          switch(item[0]) {
                            case 'Profile': return <AccountCircleIcon />
                            default: return <HomeIcon />
                          }
                        })()
                      }
                      </ListItemIcon>
                      <ListItemText primary={item[0]} />
                    </ListItem>
                  </Link>
                ))
              }
              <Link to="/" className={classes.link}>
                <ListItem onClick={() => {
                  dispatch(onLogout())
                  dispatch(setCart(JSON.parse(localStorage.getItem('cart') || [])))
                }} button>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </Link>
            </>
            
          )
          :
          (
            [['Login', LOGIN_ROUTE], ['Register', REGISTRATION_ROUTE]].map((item, index) => (
              <Link to={item[1]} key={item[0]} className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                  {
                    (() => {
                      switch(item[0]) {
                        case 'Register': return <PersonAddIcon />
                        case 'Login': return <LockOpenIcon />
                        default: return <HomeIcon />
                      }
                    })()
                  }
                  </ListItemIcon>
                  <ListItemText primary={item[0]} />
                </ListItem>
              </Link>
            ))
          )
        }
      </List>
    </div>
  );

  return (
    <div>
      <IconButton
        edge="start"
        className={classes.menuButton}
        onClick={toggleDrawer(true)}
        color="inherit"
        aria-label="open drawer"
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={state} onClose={toggleDrawer(false)}>
        {list(isAuth)}
      </Drawer>
    </div>
  );
}