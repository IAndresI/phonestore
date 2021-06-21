const booksLoaded = (books) => {
  return {
    type: "FETCH_BOOK_SUCCESS",
    payload: books
  };
};

const booksFailure = (error) => {
  return {
    type: "FETCH_BOOK_FAILURE",
    payload: error
  };
};

const booksLoading = () => {
  return {
    type: "FETCH_BOOK_LOADING",
  };
};

const fetchingBooks  = (bookStoreService) => () => (dispatch) => {
  dispatch(booksLoading());
  bookStoreService.getBooks()
    .then(data => dispatch(booksLoaded(data)))
    .catch(error => dispatch(booksFailure(error)));
};

const onAddedToCart = (id) => {
  return {
    type: "ADD_CART_ITEM",
    payload: id
  };
};

const onRemoveItemFromCart = (id) => {
  return {
    type: "DELETE_CART_ITEM",
    payload: id
  };
};

const onRemoveItemAllFromCart = (id) => {
  return {
    type: "DELETE_ALL_CART_ITEM",
    payload: id
  };
};

const onPriceChange = (price) => {
  return {
    type: "SET_PRICE",
    payload: price
  };
};

const onManufacturerChange = (manufacturer) => {
  return {
    type: "SET_MANUFACTURER",
    payload: manufacturer
  };
};

const onLogin = (user) => {
  return {
    type: "LOGIN",
    payload: user
  };
};

const onLogout = () => {
  localStorage.removeItem("token");
  return {
    type: "LOGOUT",
  };
};

const fetchingPhones = (phones) => {
  return {
    type: "FETCH_ALL_PHONE",
    payload: phones
  }
};

const fetchingManufacturer = (manufacturer) => {
  return {
    type: "FETCH_ALL_MANUFACTURER",
    payload: manufacturer
  }
};

export {
  fetchingBooks,
  onAddedToCart,
  onRemoveItemFromCart,
  onRemoveItemAllFromCart,
  onManufacturerChange,
  onPriceChange,
  onLogin,
  onLogout,
  fetchingPhones,
  fetchingManufacturer
};