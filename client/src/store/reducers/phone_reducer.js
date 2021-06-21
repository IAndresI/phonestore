export default function phoneListReducer(state, action) {
  if(state === undefined) return {
    phoneList: [
      {id: 1, weight: 20, diagonal: 5, ram: 30, memory: 256, price: 1000, manufacturer_id: 1, name: "Iphone 12 Pro", color: "White", image: "7e8da54c-f815-42ba-b1f3-328c2fa24333.jpg"},
      {id: 2, weight: 30, diagonal: 4, ram: 20, memory: 456, price: 11000, manufacturer_id: 2, name: "Iphone 13 Pro", color: "Balck", image: "7e8da54c-f815-42ba-b1f3-328c2fa24333.jpg"},
      {id: 3, weight: 40, diagonal: 7, ram: 10, memory: 356, price: 12000, manufacturer_id: 2, name: "Iphone 14 Pro", color: "Yellow", image: "7e8da54c-f815-42ba-b1f3-328c2fa24333.jpg"},
      {id: 4, weight: 50, diagonal: 6, ram: 15, memory: 156, price: 9000, manufacturer_id: 3, name: "Iphone 15 Pro", color: "White", image: "7e8da54c-f815-42ba-b1f3-328c2fa24333.jpg"},
    ],
    manufacturer: [
      {id: 1, name: "Samsung"},
      {id: 2, name: "Apple"},
      {id: 3, name: "Huawei"}
    ],
    loading: true,
    error: null
  };
  switch (action.type) {
    case "FETCH_PHONE_LOADING":
      return {
        phoneList: state.phoneList,
        loading: true,
        error: null
      };
    case "FETCH_PHONE_SUCCESS":
      return {
        phoneList: action.payload,
        loading: false,
        error: null
      };
    case "FETCH_PHONE_FAILURE":
      return {
        phoneList: state.phoneList,
        loading: false,
        error: action.payload
      };
    default:
      return state.phone;
  }
}