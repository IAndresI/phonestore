import phoneListReducer from './phone_reducer';
import cartReducer from './cart_reducer';
import userReducer from './user_reducer';
import filterReducer from './filter_reducer'
import pageReducer from './page_reducer';
import searchReducer from './search_reducer';
import compareReducer from './compare_reducer';

const reducer = (state, action) => {
  return {
    phone: phoneListReducer(state, action),
    cart: cartReducer(state, action),
    user: userReducer(state, action),
    filter: filterReducer(state, action),
    page: pageReducer(state, action),
    search: searchReducer(state, action),
    compare: compareReducer(state, action)
  };
};

export default reducer;