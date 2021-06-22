export default function cartReducer(state, action) {
  if(state === undefined) return {
    cartList: [],
    totalPrice: 0
  };
  switch (action.type) {
    case "ADD_CART_ITEM":
      return updateCart(action.payload, state, 1);
    case "DELETE_CART_ITEM":
      return updateCart(action.payload, state, -1);
    case "DELETE_ALL_CART_ITEM":
      const cart = [...state.cart.cartList];
      const bookIsInCartIndex = cart.findIndex(e => e.id === action.payload);
      const newCart = [
        ...cart.slice(0, bookIsInCartIndex),
        ...cart.slice(bookIsInCartIndex + 1)
      ];
      return {
        cartList: newCart,
        totalPrice: newCart.reduce((acc, book) => acc += book.total,0)
      };
    default:
      return state.cart;
  }
}

function updateCart(id, state, action) {
  const book = [...state.books.booksList].find(book => book.id === id);
  const bookInCart = [...state.cart.cartList].find(book => book.id === id);
  if(bookInCart) {
    const cartList = [...state.cart.cartList];
    const bookIsInCartIndex = cartList.findIndex(e => e.id === id);
    cartList[bookIsInCartIndex] = {...bookInCart, count: bookInCart.count + action, total: (bookInCart.count + action)*book.price};
    console.log(cartList[bookIsInCartIndex].count <= 0);
    if(cartList[bookIsInCartIndex].count <= 0) return {
      cartList: [
        ...cartList.slice(0, bookIsInCartIndex),
        ...cartList.slice(bookIsInCartIndex + 1)
      ],
      totalPrice: cartList.reduce((acc, book) => acc += +book.total,0)
    };
    
    return {
      cartList: cartList,
      totalPrice: cartList.reduce((acc, book) => acc += +book.total,0)
    };
  }
  const newItem = {id: book.id,name: book.name, count: 1, total: book.price};
  const newCartList = [...state.cart.cartList, newItem];
  return {
    cartList: newCartList,
    totalPrice: newCartList.reduce((acc, book) => acc += +book.total,0)
  };
}