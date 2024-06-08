const { default: axios } = require("axios");
const { API_URL } = require("../config");

const axiosClient = axios.create({
  baseURL: `${API_URL}`,
});

// Gọi API
// Api Auth
const login = async (userData) => {
  try {
    const response = await axiosClient.post("/api/login", userData);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const register = async (userData) => {
  try {
    const response = await axiosClient.post("/api/register", userData);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Api user
const updateProfileUser = async (userId, data) => {
  try {
    const response = await axiosClient.put(
      "/api/user/" + userId + "/updateProfile",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Api Category
const getCategoryList = async () => {
  try {
    const response = await axiosClient.get("/api/category");
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Api Product
const getProductList = async () => {
  try {
    const response = await axiosClient.get("/api/product");
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getAllProducts = async (page, limit) => {
  try {
    const response = await axiosClient.get(
      "/api/product?page=" + page + "&limit=" + limit
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getProductBestSellers = async () => {
  try {
    const response = await axiosClient.get("/api/product?bestsellers=true");
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getProductByCategory = async (categoryId) => {
  try {
    const response = await axiosClient.get("/api/product/" + categoryId);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getProductBestSellerByCategory = async (categoryId) => {
  try {
    const response = await axiosClient.get(
      "/api/product/" + categoryId + "/?bestsellers=true"
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const searchProductList = async (searchKey) => {
  try {
    const response = await axiosClient.get(
      "/api/product/search?name=" + searchKey
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Api Cart
const addToCart = async (data) => {
  try {
    const response = await axiosClient.post("/api/cart/addToCart", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getCart = async (userId) => {
  try {
    const response = await axiosClient.get("/api/cart/" + userId);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const updateCartItemQuantity = async (data) => {
  try {
    const response = await axiosClient.put("/api/cart/update", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const deleteCartItem = async (userId, itemId) => {
  try {
    const response = await axiosClient.delete(
      "/api/cart/delete/" + userId + "/" + itemId
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Api order
const createOrder = async (data) => {
  try {
    const response = await axiosClient.post("/api/order", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
const getOrderListByStatus = async (userId, status) => {
  try {
    const response = await axiosClient.get(
      "/api/order/" + userId + "/?status=" + status
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
const getTotalOrders = async (userId) => {
  try {
    const response = await axiosClient.get("/api/order/totalOrder/" + userId);
    return response;
  } catch (error) {
    throw error;
  }
};
export default {
  login,
  register,
  updateProfileUser,
  getProductList,
  getCategoryList,
  getProductBestSellers,
  getProductByCategory,
  searchProductList,
  getProductBestSellerByCategory,
  getCart,
  updateCartItemQuantity,
  deleteCartItem,
  addToCart,
  createOrder,
  getOrderListByStatus,
  getTotalOrders,
  getAllProducts,
};
