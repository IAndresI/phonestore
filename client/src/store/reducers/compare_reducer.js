export default function compareReducer(state, action) {
  if(state === undefined) return {
    items: [1,2,3],
  };
  switch (action.type) {
    case "ADD_COMPARE_ITEM":
      return {
        items: [...state.compare.items, action.payload]
      };
    case "REMOVE_COMPARE_ITEM":
      return {
        items: state.compare.items.filter(el => el.phone_id !== action.payload)
      };
    default:
      return state.compare;
  }
}