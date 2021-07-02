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
      return updateCart(action.payload, state);
    // case "DELETE_CART_ITEM":
    //   return updateCart(action.payload, state, -1);
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
  const phoneInCart = stateCartList.find(e => e.phone_id === payload.phone_id);

  if(phoneInCart) {
    const oldCartItem = {...phoneInCart, count: payload.count};
    const oldIndex = stateCartList.findIndex(e => e.phone_id===oldCartItem.phone_id)
    const newCartList = [...stateCartList.splice(0,oldIndex),oldCartItem,...stateCartList.splice(oldIndex+1,stateCartList.length-1)]
    if(oldCartItem.count < 1) {
      const cart = [...newCartList];
      console.log(cart);
      cart.splice(oldIndex, 1)
      console.log(cart);
      return {
        ...state.cart,
        cartList: cart,
        totalPrice: cart.reduce((acc, curr) => acc+parseFloat(curr.price.slice(1, curr.price.length).replace(",",""))*curr.count,0)
      }
    }
    else {
      return {
        ...state.cart,
        cartList: newCartList,
        totalPrice: newCartList.reduce((acc, curr) => acc+parseFloat(curr.price.slice(1, curr.price.length).replace(",",""))*curr.count,0)
      }
    }
  }
  else {
    const newCartItem = {...payload, count: 1};
    const newCart = [...state.cart.cartList, newCartItem];
    return {
      ...state.cart,
      cartList: newCart,
      totalPrice: newCart.reduce((acc, curr) => acc+parseFloat(curr.price.slice(1, curr.price.length).replace(",",""))*curr.count,0)
    }
  }
}