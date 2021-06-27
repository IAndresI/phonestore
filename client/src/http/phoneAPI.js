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

export const getAllPhones = async (page=1, limit=9, sort=null, color, manufacturers, price,ram,rom,camera, diagonal) => {
  const {data} = await $host.get(`api/phone`, {params: {page, limit, sort, color, manufacturers, price, ram,rom,camera, diagonal}});
  return data;
}

export const getFilter = async () => {
  const {data} = await $host.get('api/phone/filter/');
  return data;
}

export const search = async (searchText) => {
  const {data} = await $host.get('api/phone/search/', {params: {searchText}});
  return data;
}