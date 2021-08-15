import { $authHost } from ".";

export const getDashboardCounts = async () => {
  const {data} = await $authHost.get('api/admin/dashboard/counts');
  return data;
}