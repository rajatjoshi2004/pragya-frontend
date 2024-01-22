import { APICore } from "./apiCore";
const api = new APICore();

const registerUser = (params) => {
  const baseURL = "familyRegister";
  return api.create(`${baseURL}`, params);
};

const getUserData = (params) => {
  const baseURL = "getUserData";
  return api.create(`${baseURL}`, params);
};

const totalUsers = (params) => {
  const baseURL = "totalUsers";
  return api.get(`${baseURL}`, params);
};

const listUsers = (params) => {
  const baseURL = "listUsers";
  return api.get(`${baseURL}`, params);
};

const validateAdmin = (params) => {
  const baseURL = "validateAdmin";
  return api.create(`${baseURL}`, params);
};

const searchFilter = (params) => {
  const baseURL = "searchFilter";
  return api.get(`${baseURL}`, params);
};

const userImageUpload = (params) => {
  const baseURL = "userImageUpload";
  return api.uploadFile(`${baseURL}`, params);
};
const downloadExcel = (params) => {
  const baseURL = "downloadExcel";
  return api.get(`${baseURL}`, params);
};

export {
  registerUser,
  userImageUpload,
  getUserData,
  totalUsers,
  listUsers,
  validateAdmin,
  searchFilter,
  downloadExcel
};
