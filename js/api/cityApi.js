import axiosClient from './axiosClient';

export function getAllCities(params) {
  const url = '/cities';
  return axiosClient.get(url, { params });
}
const cityApi = {
  getAll(params) {
    const url = '/cities';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `./cities/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/cities';
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `./cities/${data.id}`;
    return axiosClient.post(url, data);
  },

  remove(id) {
    const url = `./cities/${id}`;
    return axiosClient.delete(url);
  },
};
export default cityApi;
