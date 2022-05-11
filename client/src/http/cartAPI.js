import {
  $authHost,
  $host
} from './index'

export const getCart = async (id) => {
  const {data} = await $authHost.get('api/cart/'+id);
  return data;
}

export const changeCart = async (id, cartDetails) => {
  switch(cartDetails.actionType) {
    case "add_item":
      return await $authHost.post('api/cart/'+id, {...cartDetails});
    case "remove_item":
      return await $authHost.delete('api/cart/'+id, {data: {...cartDetails}});
    case "change_item":
      return await $authHost.put('api/cart/'+id, {...cartDetails});
    default: return;
  }
}

export const getLocations = async () => {
  const {data} = await $host.get('api/cart/locations');
  return data;
}

export const getPaymentMethod = async () => {
  const {data} = await $host.get('api/cart/payment_method');
  return data;
}

export const addPayPal = async () => {
  const {data} = await $host.get('api/paypal/config');
  return data;
}
