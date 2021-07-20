import { $host } from './index'

export const createUnregistredUserOrder = async (orderDeatils, clientDeatils) => {

  const {data: clientData} = await $host.post('api/user/registration/empty', clientDeatils);

  const {data: order} = await $host.post('api/order/', {clientId: clientData.client_id, ...orderDeatils});

  return {client: clientData.client_id, order};
}

export const createRegistredUserOrder = async (orderDeatils) => {
  const {order} = await $host.post('api/order/', orderDeatils);
  return order;
}