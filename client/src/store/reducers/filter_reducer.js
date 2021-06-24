export default function phoneListReducer(state, action) {
  if(state === undefined) return {
    manufacturer: [],
    color: [],
    price: []
  };
  switch (action.type) {
    case "SET_MANUFACTURER":
      return {
        ...state.filter,
        manufacturer: action.payload,
      };
    case "SET_PRICE":
      return {
        ...state.filter,
        price: action.payload
      };
    case "SET_COLORS":
      return {
        ...state.filter,
        color: action.payload
      };
    default:
      return state.filter;
  }
}