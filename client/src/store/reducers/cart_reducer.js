export default function cartReducer(state, action) {
  if(state === undefined) return {
    cartId: null,
    cartList: [],
    totalPrice: 0
  };
  switch (action.type) {
    case "FETCH_ALL_CART":
      return {
        ...state.cart,
        cartList: action.payload
      }
    case "ADD_CART_ITEM":
      return updateCart(action.payload, state, 1);
    case "DELETE_CART_ITEM":
      return //updateCart(action.payload, state, -1);
    case "DELETE_ALL_CART_ITEM":
      const cart = [...state.cart.cartList];
      const phoneIsInCartIndex = cart.findIndex(e => e.phone_id === action.payload);
      const newCart = [
        ...cart.slice(0, phoneIsInCartIndex),
        ...cart.slice(phoneIsInCartIndex + 1)
      ];
      return {
        ...state.cart,
        cartList: newCart,
        totalPrice: newCart.reduce((acc, phone) => acc += phone.total,0)
      };
    default:
      return state.cart;
  }
}

function updateCart(payload, state, action) {

  const stateCartList = state.cart.cartList;
  const phoneInCart = stateCartList.find(e => e.phone_id === payload);

  if(phoneInCart) {
    const oldCartItem = {...phoneInCart, count: phoneInCart.count+action};
    const oldIndex = stateCartList.findIndex(e => e.phone_id===oldCartItem.phone_id)
    const newCartList = [...stateCartList.splice(0,oldIndex-1),oldCartItem,...stateCartList.splice(oldIndex,stateCartList.length-1)]
    if(oldCartItem.count < 1) {
      const cart = [...stateCartList];
      cart.slice(oldIndex, 1)
      return {
        ...state.cart,
        cartList: cart
      }
    }
    else {
      return {
        ...state.cart,
        cartList: newCartList
      }
    }
  }
  else {
    const newCartItem = {phone_id: payload, count: 1};
    return {
      ...state.cart,
      cartList: [...state.cart.cartList, newCartItem]
    }
  }
}