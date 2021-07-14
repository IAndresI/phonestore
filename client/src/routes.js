import Admin from './page/Admin';
import Cart from './page/Cart';
import Phone from './page/Phone';
import Shop from './page/Shop';
import Auth from './page/Auth';
import Profile from './page/Profile';
import {ADMIN_ROUTE, CART_ROUTE, PHONE_ROUTE, SHOP_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, PROFILE_ROUTE, SEARCH_ROUTE, HOME_ROUTE, CHECKOUT_ROUTE} from './utils/consts'
import SearchResult from './page/SearchResult';
import Home from './page/Home';
import Checkout from './page/Checkout';


export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: Admin
  },
  {
    path: PROFILE_ROUTE+"/:id",
    Component: Profile
  },
  {
    path: CART_ROUTE+"/:id",
    Component: Cart
  },
];
export const publicRoutes = [
  {
    path: CART_ROUTE,
    Component: Cart
  },
  {
    path: PHONE_ROUTE+"/:id",
    Component: Phone
  },
  {
    path: SEARCH_ROUTE,
    Component: SearchResult
  },
  {
    path: SHOP_ROUTE,
    Component: Shop
  },
  {
    path: LOGIN_ROUTE,
    Component: Auth
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Auth
  },
  {
    path: HOME_ROUTE,
    Component: Home
  },
  {
    path: CHECKOUT_ROUTE,
    Component: Checkout
  },
];