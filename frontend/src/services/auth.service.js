import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

//register dental office admin
const registerAdmin = (name, email, password) => {
  return axios.post(API_URL + "signup", {
    name,
    email,
    password,
    roles: ['dental-office-admin']
  });
};

const registerPatient = (name, email, birthday, address, password) => {
  return axios.post(API_URL + "signup", {
    name,
    email,
    birthday,
    address,
    password,
    roles: ['patient']
  });
};

const registerDoctor = (name, email, password) => {
  return axios.post(API_URL + "signup", {
    name,
    email,
    password,
    roles: ['dentist']
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  registerAdmin,
  registerPatient,
  registerDoctor,
  login,
  logout,
};