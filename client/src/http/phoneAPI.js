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

export const getAllPhones = async (page=1, limit=9, sort=null, color, manufacturers, price) => {
  const {data} = await $host.get(`api/phone`, {params: {page, limit, sort, color, manufacturers, price}});
  return data;
}

export const getAllColor = async () => {
  const {data} = await $host.get('api/phone/color/');
  return data;
}

export const getMinMaxPirce = async () => {
  const {data} = await $host.get('api/phone/min_max_price');
  return data;
}