import {
  $host,
  $authHost
} from './index'
import jwt_decode from 'jwt-decode'

export const registration = async (formData) => {
  const {data} = await $host.post('api/user/registration', formData);
  return data;
}

export const registrationEmpty = async (userData) => {
  const {data} = await $host.post('api/user/registration/empty', userData);
  return data;
}

export const login = async (email, password) => {
  const {data} = await $host.post('api/user/login', {email, password});
  localStorage.setItem("token", data.token)
  return jwt_decode(data.token);
}

export const check = async () => {
  const {data} = await $authHost.get('api/user/auth');
  localStorage.setItem("token", data.token)
  return jwt_decode(data.token);
}

export const getProfile = async (id) => {
  const {data} = await $authHost.get('api/user/profile/'+id);
  return data;
}

export const putProfile = async (id, formData) => {
  const {data} = await $authHost.put('api/user/profile/'+id, formData);
  return data;
}

export const isAlreadyRegistred = async (email) => {
  const {data} = await $host.get('api/user/is_already_registred', {params: {email}});
  return data;
}

export const checkPassword = async (clientId, password) => {
  const {data} = await $host.get('api/user/password_check', {params: {clientId, password}});
  return data;
}

export const changePassword = async (clientId, password) => {
  const {data} = await $authHost.put('api/user/password_change', {clientId, password});
  return data;
}