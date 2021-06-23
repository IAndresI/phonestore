export default function phoneListReducer(state, action) {
  if(state === undefined) return {
    manufacturer: null,
    price: 0
  };
  switch (action.type) {
    case "SET_MANUFACTURER":
      return {
        manufacturer: action.payload,
        price: state.filter.price
      };
    case "SET_PRICE":
      return {
        manufacturer: state.filter.manufacturer,
        price: action.payload
      };
    default:
      return state.filter;
  }
}