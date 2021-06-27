export default function phoneListReducer(state, action) {
  if(state === undefined) return {
    manufacturer: [],
    color: [],
    price: [],
    state: [],
    camera: [],
    ram: [],
    rom: []
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
    case "SET_DIAGONAL":
      return {
        ...state.filter,
        diagonal: action.payload
      };
    case "SET_COLORS":
      return {
        ...state.filter,
        color: action.payload
      };
    case "SET_CAMERA_COUNT":
      return {
        ...state.filter,
        camera: action.payload
      };
    case "SET_RAM":
      return {
        ...state.filter,
        ram: action.payload
      };
    case "SET_ROM":
      return {
        ...state.filter,
        rom: action.payload
      };
    default:
      return state.filter;
  }
}