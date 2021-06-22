import phoneListReducer from './phone_reducer';
import cartReducer from './cart_reducer';
import userReducer from './user_reducer';
import filterReducer from './filter_reducer'

const reducer = (state, action) => {
  return {
    phone: phoneListReducer(state, action),
    cart: cartReducer(state, action),
    user: userReducer(state, action),
    filter: filterReducer(state, action)
  };
};

export default reducer;