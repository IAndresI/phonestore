import React, { useState } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button} from '@material-ui/core';
import { withRouter, Link} from 'react-router-dom';
import { onLogout, setCart } from '../store/actions';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import { ADMIN_ROUTE, ROLE_ADMIN, SEARCH_ROUTE } from '../utils/consts';
import {onSearch} from '../store/actions'
import SideBar from './SideBar';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    textDecoration: 'none',
    color: 'white',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    marginLeft: 'auto'
  },
  sectionMobile: {
    display: 'flex',
    marginLeft: 'auto',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  icon: {
    overflow: 'visible',
    width: '40px',
    display: 'flex',
  },
  sticky: {
    boxShadow: "none"
  }
}));

export default withRouter(function PrimarySearchAppBar({history}) {

  const dispatch = useDispatch()
  const isAuth = useSelector((state) => state.user.isAuth, shallowEqual)
  const {cart_id, role} = useSelector((state) => state.user.user, shallowEqual)
  const cartItemsCount = useSelector((state) => state.cart.cartList, shallowEqual)

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {
        handleMenuClose();
        history.push("/profile");
      }}>Profile</MenuItem>
      <MenuItem onClick={() => {
        dispatch(onLogout());
        dispatch(setCart(JSON.parse(localStorage.getItem('cart') || "[]")))
        handleMenuClose();
        history.push("/");
      }}>Log Out</MenuItem>
    </Menu>

  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {
        isAuth ? (
          <div style={{marginLeft: "auto"}}>
            {
              role === ROLE_ADMIN ? 
              (
                <MenuItem onClick={() => history.push(ADMIN_ROUTE)}>
                  <Icon
                      className={classes.icon}
                      aria-label="account of current user"
                      aria-controls="primary-search-account-menu"
                      aria-haspopup="true"
                      color="inherit"
                    >
                      <AccountCircle />
                    </Icon>
                    <p>Admin Panel</p>
                </MenuItem>
              )
              :
              null
            }
            <MenuItem onClick={handleProfileMenuOpen}>
              <Icon
                className={classes.icon}
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </Icon>
              
              <p>Profile</p>
            </MenuItem>
            <MenuItem onClick={() => isAuth ? history.push("/cart/"+cart_id) : history.push("/cart")}>
              <Icon
                className={classes.icon}
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                aria-label="show" 
                color="inherit">
                <Badge badgeContent={cartItemsCount.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </Icon>
              <p>Cart</p>
            </MenuItem>
          </div>
        )
        :
        (
          <div>
            <MenuItem onClick={() => history.push("/login")}>
              <Icon
                className={classes.icon}
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                aria-label="show" 
                color="inherit">
                <AccountCircle />
              </Icon>
              <p>Login</p>
            </MenuItem>
            <MenuItem onClick={() => history.push("/registration")}>
              <Icon 
                className={classes.icon}
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                aria-label="show" 
                color="inherit">
                <PersonAddIcon />
              </Icon>
              <p>Register</p>
            </MenuItem>
            <MenuItem onClick={() => isAuth ? history.push("/cart/"+cart_id) : history.push("/cart")}>
              <Icon
                className={classes.icon}
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                aria-label="show" 
                color="inherit">
                <Badge badgeContent={cartItemsCount.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </Icon>
              <p>Cart</p>
            </MenuItem>
          </div>
        )
      }
      
    </Menu>
  );
  
  const [searchText, setSearchText] = useState("")

  const searchForm = (event) => {
    event.preventDefault();
    dispatch(onSearch(searchText.toLowerCase()))
    history.push(SEARCH_ROUTE)
  }

  return (
    <>
      <AppBar position="sticky" classes={{positionSticky: classes.sticky}}>
        <Toolbar>
          <SideBar cartItemsCount={cartItemsCount.length} isAuth={isAuth}/>
          <Link className={classes.title} to="/">
            <Typography variant="h6" noWrap>
              PhoneStore
            </Typography>
          </Link>
          <form onSubmit={searchForm} className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search???"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </form>
          <div className={classes.grow} />
          {
            isAuth ? (
              <>
                <div className={classes.sectionDesktop}>
                  {
                    role === ROLE_ADMIN ? 
                    (
                      <Link to={ADMIN_ROUTE} className="button button--reverse">
                        Admin Panel
                      </Link>
                    )
                    :
                    null
                  }
                  <IconButton onClick={() => history.push("/cart/"+cart_id)}  aria-label="show" color="inherit">
                    <Badge badgeContent={cartItemsCount.length} color="secondary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Badge color="secondary">
                      <AccountCircle />
                    </Badge>
                  </IconButton>
                </div>
                <div className={classes.sectionMobile}>
                  <IconButton
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                </div>
              </>
            )
            :
            (
              <>
                <div className={classes.sectionDesktop}>
                  <IconButton onClick={() => history.push("/cart")}  aria-label="show" color="inherit">
                    <Badge badgeContent={cartItemsCount.length} color="secondary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                  <Button color="inherit"
                    onClick={() => history.push("/login")}>Login</Button>
                  <Button 
                    onClick={() => history.push("/registration")}
                    color="inherit">
                    Register
                  </Button>
                </div>
                <div className={classes.sectionMobile}>
                  <IconButton
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                </div>
              </>
            )
          }
          
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
})