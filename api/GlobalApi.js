const { default: axios } = require("axios");
const { API_URL } = require("../config");

const axiosClient = axios.create({
  baseURL: `${API_URL}`,
});

// Gọi API

// Api Category
const getCategoryList = () => axiosClient.get("/api/category");

// Api Product
const getProductBestSellers = () =>
  axiosClient.get("/api/product/best-sellers");

export default {
  getCategoryList,
  getProductBestSellers,
};
