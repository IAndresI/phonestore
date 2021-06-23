import {
  $authHost
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
