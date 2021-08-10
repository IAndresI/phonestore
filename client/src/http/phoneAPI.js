import {
  $host
} from './index'


export const getSeveralPhones = async (id) => {
  const {data} = await $host.get('api/phone/get_several', {params: {id: id}});
  return data;
}

export const createPhone = async (formData) => {
  const {data} = await $host.post('api/phone/', formData);
  return data;
}

export const getOnePhones = async (id) => {
  const {data} = await $host.get('api/phone/'+id);
  return data;
}

export const getReviews = async (id, limit = 5, page = 1) => {
  const {data} = await $host.get('api/phone/reviews/'+id, {params: {limit, page}});
  return data;
}

export const createReview = async (id, details) => {
  const {data} = await $host.post('api/phone/reviews/'+id, details);
  return data;
}

export const editReview = async (id, details) => {
  const {data} = await $host.put('api/phone/reviews/'+id, details);
  return data;
}

export const getAllPhones = async (page=1, limit=9, sort=null, color, manufacturers, price,ram,rom,camera, diagonal) => {
  const {data} = await $host.get(`api/phone`, {params: {page, limit, sort, color, manufacturers, price, ram,rom,camera, diagonal}});
  return data;
}

export const getNewestPhones = async () => {
  const {data} = await $host.get(`api/phone/newest`);
  return data;
}

export const getFilter = async () => {
  const {data} = await $host.get('api/phone/filter/');
  return data;
}

export const search = async (searchText, limit=6, page=1) => {
  const {data} = await $host.get('api/phone/search/', {params: {searchText, limit, page}});
  return data;
}