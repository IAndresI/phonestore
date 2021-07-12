const onAddedToCart = (phone) => {
  return {
    type: "ADD_CART_ITEM",
    payload: phone
  };
};

const setCart = (cart) => {
  return {
    type: "SET_CART",
    payload: cart
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

const onAddCartTotal = (added) => {
  return {
    type: "ADD_CART_TOTAL",
    payload: added
  };
};

const onPriceChange = (price) => {
  return {
    type: "SET_PRICE",
    payload: price
  };
};

const onDiagonalChange = (diagonal) => {
  return {
    type: "SET_DIAGONAL",
    payload: diagonal
  };
}

const onManufacturerChange = (manufacturer) => {
  return {
    type: "SET_MANUFACTURER",
    payload: manufacturer
  };
};

const onColorChange = (color) => {
  return {
    type: "SET_COLORS",
    payload: color
  };
};

const onCameraCountChange = (camera) => {
  return {
    type: "SET_CAMERA_COUNT",
    payload: camera
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
  localStorage.removeItem("cart");
  return {
    type: "LOGOUT",
  };
};

const fetchingPhones = (data) => {
  return {
    type: "FETCH_ALL_PHONE",
    payload: data
  }
};

const fetchingManufacturer = (manufacturer) => {
  return {
    type: "FETCH_ALL_MANUFACTURER",
    payload: manufacturer
  }
};

const fetchingCart = (cartItems) => {
  return {
    type: "FETCH_ALL_CART",
    payload: cartItems
  }
};

const fetchingColor = (colorList) => {
  return {
    type: "FETCH_ALL_COLORS",
    payload: colorList
  }
}

const onPageSet = (page) => {
  return {
    type: "SET_PAGE",
    payload: page
  }
}

const onLimitSet = (limit) => {
  return {
    type: "SET_LIMIT",
    payload: limit
  }
}

const onRamChange = (ram) => {
  return {
    type: "SET_RAM",
    payload: ram
  }
}

const onRomChange = (rom) => {
  return {
    type: "SET_ROM",
    payload: rom
  }
}

const onSearch = (text) => {
  return {
    type: "SEARCH",
    payload: text
  }
}

const setPickupPoint = (id) => {
  return {
    type: "SET_PICKUP_POINT",
    payload: id
  }
}

export {
  onAddedToCart,
  onRemoveItemFromCart,
  onRemoveItemAllFromCart,
  onManufacturerChange,
  onColorChange,
  onPriceChange,
  onLogin,
  onLogout,
  fetchingPhones,
  fetchingManufacturer,
  fetchingCart,
  fetchingColor,
  onPageSet,
  onLimitSet,
  onDiagonalChange,
  onCameraCountChange,
  onRamChange,
  onRomChange,
  onSearch,
  setCart,
  onAddCartTotal,
  setPickupPoint
};