import {
  $host
} from './index'

export const createManufacturer = async (formData) => {
  const {data} = await $host.post('api/manufacturer/', formData);
  return data;
}

export const getOneManufacturer = async (id) => {
  const {data} = await $host.get('api/manufacturer/:id', {id});
  return data;
}

export const getAllManufacturer = async () => {
  const {data} = await $host.get('api/manufacturer/');
  return data;
}