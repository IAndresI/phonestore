import {
  $authHost,
  $host
} from './index'

export const getCart = async (id) => {
  const {data} = await $authHost.get('api/cart/'+id);
  return data;
}

export const changeCart = async (id) => {
  const {data} = await $authHost.post('api/cart/'+id);
  return data;
}

export const changeCartItem = async (id, changed) => {
  const {data} = await $authHost.put('api/cart/'+id, {changed});
  return data;
}

export const getLocations = async () => {
  const {data} = await $host.get('api/cart/locations');
  return data;
}

export const getPaymentMethod = async () => {
  const {data} = await $host.get('api/cart/payment_method');
  return data;
}
