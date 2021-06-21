export default function phoneListReducer(state, action) {
  if(state === undefined) return {
    isAuth: false,
    user: {}
  };
  switch (action.type) {
    case "FETCH_USER_LOADING":
      return {
        phoneList: state.phoneList,
        loading: true,
        error: null
      };
    case "FETCH_USER_SUCCESS":
      return {
        phoneList: action.payload,
        loading: false,
        error: null
      };
    case "FETCH_USER_FAILURE":
      return {
        phoneList: state.phoneList,
        loading: false,
        error: action.payload
      };
    case "LOGIN":
      return {
        isAuth: true,
        user: action.payload
      };
    case "LOGOUT":
      return {
        isAuth: false,
        user: {}
      };
    default:
      return state.user;
  }
}