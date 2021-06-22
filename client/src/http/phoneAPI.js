import {
  $host
} from './index'

export const createPhone = async (formData) => {
  const {data} = await $host.post('api/phone/', formData);
  return data;
}

export const getOnePhones = async (id) => {
  const {data} = await $host.get('api/phone/'+id);
  return data;
}

export const getAllPhones = async () => {
  const {data} = await $host.get('api/phone/');
  return data;
}

export const getMaximumPrice = async () => {
  const {data} = await $host.get('api/phone/maximum_price');
  return data;
}