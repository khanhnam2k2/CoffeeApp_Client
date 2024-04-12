const { default: axios } = require("axios");
const { API_URL } = require("../config");

const axiosClient = axios.create({
  baseURL: `${API_URL}`,
});

// Gọi API
// Api Auth
const login = (userData) => axiosClient.post("/api/login", userData);

const register = (userData) => axiosClient.post("/api/register", userData);

// Api Category
const getCategoryList = () => axiosClient.get("/api/category");

// Api Product
const getProductList = () => axiosClient.get("/api/product");

const getProductBestSellers = () =>
  axiosClient.get("/api/product?bestsellers=true");

const getProductByCategory = (categoryId) =>
  axiosClient.get("/api/product/" + categoryId);

const getProductBestSellerByCategory = (categoryId) =>
  axiosClient.get("/api/product/" + categoryId + "/?bestsellers=true");

const searchProductList = (searchKey) =>
  axiosClient.get("/api/product/search?name=" + searchKey);

export default {
  login,
  register,
  getProductList,
  getCategoryList,
  getProductBestSellers,
  getProductByCategory,
  searchProductList,
  getProductBestSellerByCategory,
};
