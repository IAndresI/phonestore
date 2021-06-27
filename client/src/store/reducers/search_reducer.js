export default function searchReducer(state, action) {
  if(state === undefined) return {
    text: ""
  };
  switch (action.type) {
    case "SEARCH":
      return {
        ...state.search,
        text: action.payload
      };
    default:
      return state.search;
  }
}