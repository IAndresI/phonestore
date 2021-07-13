export default function cartReducer(state, action) {
  if(state === undefined) return {
    cartId: null,
    cartList: [],
    totalPrice: 0,
    pickupPoint: null,
    deliveryAddress: null
  };
  switch (action.type) {
    case "SET_CART":
      return {
        ...state.cart,
        cartList: action.payload,
        totalPrice: getTotalPrice(action.payload) 
      }
    case "ADD_CART_ITEM":
      return updateCart(action.payload, state);
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
    case "ADD_CART_TOTAL":
      return {
        ...state.cart,
        totalPrice: state.cart.totalPrice+action.payload 
      }
    case "SET_PICKUP_POINT":
      return {
        ...state.cart,
        deliveryAddress: null,
        pickupPoint: action.payload 
      }
    case "SET_DELIVERY_ADDRESS":
      return {
        ...state.cart,
        pickupPoint: null,
        deliveryAddress: action.payload 
      }
    default:
      return state.cart;
  }
}

function getTotalPrice(cart) {
  return cart.reduce((acc, curr) => acc+parseFloat(curr.price.slice(1, curr.price.length).replace(",",""))*curr.count,0)
}

function updateCart(payload, state) {

  const stateCartList = state.cart.cartList;
  const phoneInCart = stateCartList.find(e => e.phone_id === payload.phone_id);

  if(phoneInCart) {
    const oldCartItem = {...phoneInCart, count: payload.count || phoneInCart.count};
    const oldIndex = stateCartList.findIndex(e => e.phone_id===oldCartItem.phone_id)
    const newCartList = [...stateCartList.slice(0,oldIndex),oldCartItem,...stateCartList.slice(oldIndex+1,stateCartList.length+1)]
    if(oldCartItem.count < 1) {
      const cart = [...newCartList];
      cart.splice(oldIndex, 1);
      localStorage.setItem("cart", JSON.stringify(cart))
      return {
        ...state.cart,
        cartList: cart,
        totalPrice: getTotalPrice(cart) 
      }
    }
    else {
      localStorage.setItem("cart", JSON.stringify(newCartList))
      return {
        ...state.cart,
        cartList: newCartList,
        totalPrice: getTotalPrice(newCartList) 
      }
    }
  }
  else {
    const newCartItem = {...payload, count: 1};
    const newCart = [...state.cart.cartList, newCartItem];
    localStorage.setItem("cart", JSON.stringify(newCart))
    return {
      ...state.cart,
      cartList: newCart,
      totalPrice: getTotalPrice(newCart) 
    }
  }
}