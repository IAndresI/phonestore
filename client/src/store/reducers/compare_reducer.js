export default function compareReducer(state, action) {
  if(state === undefined) return {
    items: localStorage.getItem('compare')?.split(',') || [],
  };

  switch (action.type) {
    case "ADD_COMPARE_ITEM":
      const newAddedItems = [...state.compare.items, action.payload]
      localStorage.setItem("compare", newAddedItems)
      return {
        items: newAddedItems
      };
    case "REMOVE_COMPARE_ITEM":
      const newRemovedItems = state.compare.items.filter(el => +el !== action.payload);
      if(newRemovedItems.length > 0) {
        localStorage.setItem("compare", newRemovedItems)
      }
      else {
        localStorage.removeItem("compare")
      }
      return {
        items: newRemovedItems
      };
    default:
      return state.compare;
  }
}