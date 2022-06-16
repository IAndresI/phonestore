export default function cartReducer(state, action) {
  if(state === undefined) return {
    cartId: null,
    cartList: [],
    totalPrice: 0,
    pickupPoint: null,
    deliveryAddress: null,
    paymentMethod: null
  };
  switch (action.type) {
    case "SET_CART":
      return {
        ...state.cart,
        cartList: action.payload,
        totalPrice: getTotalPrice(action.payload) 
      }
    case "CHANGE_CART":
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
    case "SET_PAYMENT_METHOD":
      return {
        ...state.cart,
        paymentMethod: action.payload 
      }
    default:
      return state.cart;
  }
}

function getTotalPrice(cart) {
  return cart.reduce((acc, curr) => acc+parseFloat(curr.price.slice(1, curr.price.length).replace(",",""))*curr.count,0)
}

function setLocalStorageCart(newCart) {
  localStorage.setItem("cart", JSON.stringify(newCart))
}

function updateCart(payload, state) {

  console.log(payload);

  const stateCartList = state.cart.cartList;
  const phoneInCart = stateCartList.find(e => e.phone_id === payload.phone_id && (payload.selectedColor?.id ? payload.selectedColor.id === e.selectedColor.id : true));
  let newCart;

  if(phoneInCart) {
    const oldCartItem = {...phoneInCart, count: payload.count || phoneInCart.count};
    const oldIndex = stateCartList.findIndex(e => e.phone_id===oldCartItem.phone_id && (oldCartItem.selectedColor.id ? oldCartItem.selectedColor.id === e.selectedColor.id : true))
    newCart = [...stateCartList.slice(0,oldIndex),oldCartItem,...stateCartList.slice(oldIndex+1,stateCartList.length+1)]
    if(oldCartItem.count < 1) {
      newCart.splice(oldIndex, 1);
      if(!state.user.isAuth) setLocalStorageCart(newCart)
      return {
        ...state.cart,
        cartList: newCart,
        totalPrice: getTotalPrice(newCart) 
      }
    }
    else {
      if(!state.user.isAuth) setLocalStorageCart(newCart)
      return {
        ...state.cart,
        cartList: newCart,
        totalPrice: getTotalPrice(newCart) 
      }
    }
  }
  else {
    const newCartItem = {...payload, count: 1};
    newCart = [...stateCartList, newCartItem];
    if(!state.user.isAuth) setLocalStorageCart(newCart)
    return {
      ...state.cart,
      cartList: newCart,
      totalPrice: getTotalPrice(newCart) 
    }
  }
}