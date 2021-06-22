export default function phoneListReducer(state, action) {
  if(state === undefined) return {
    phoneList: [],
    manufacturer: [],
    loading: true,
    error: null
  };
  switch (action.type) {
    case "FETCH_PHONE_LOADING":
      return {
        phoneList: state.phoneList,
        loading: true,
        manufacturer: state.phone.manufacturer,
        error: null
      };
    case "FETCH_PHONE_SUCCESS":
      return {
        phoneList: action.payload,
        loading: false,
        manufacturer: state.phone.manufacturer,
        error: null
      };
    case "FETCH_PHONE_FAILURE":
      return {
        phoneList: state.phoneList,
        loading: false,
        manufacturer: state.phone.manufacturer,
        error: action.payload
      };
    case "FETCH_ALL_PHONE":
      return {
        phoneList: action.payload,
        loading: false,
        manufacturer: state.phone.manufacturer,
        error: null
      };
    case "FETCH_ALL_MANUFACTURER":
      return {
        phoneList: state.phone.phoneList,
        loading: false,
        manufacturer: action.payload,
        error: null
      };
    default:
      return state.phone;
  }
}