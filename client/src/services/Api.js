import axios from "axios";

const endpoint = 'http://localhost:3000/api'

export const API = axios.create({
  baseURL: endpoint
});

export default () => {
  return axios.create({
    baseURL: endpoint
  })
}