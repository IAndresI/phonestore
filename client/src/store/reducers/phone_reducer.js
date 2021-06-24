export default function phoneListReducer(state, action) {
  if(state === undefined) return {
    phoneList: [],
    manufacturer: [],
    colorList: [],
    totalCount: 0
  };
  switch (action.type) {
    case "FETCH_ALL_PHONE":
      return {
        ...state.phone,
        phoneList: action.payload.phones,
        totalCount: action.payload.count
      };
    case "FETCH_ALL_MANUFACTURER":
      return {
        ...state.phone,
        manufacturer: action.payload,
      };
    case "FETCH_ALL_COLORS":
      return {
        ...state.phone,
        colorList: action.payload,
      };
    default:
      return state.phone;
  }
}