export default function pageReducer(state, action) {
  if(state === undefined) return {
    page: 1,
    limit: 9,
  };
  switch (action.type) {
    case "SET_PAGE":
      return {
        ...state.page,
        page: action.payload,
      };
    case "SET_LIMIT":
      return {
        ...state.page,
        limit: action.payload
      };
    default:
      return state.page;
  }
}