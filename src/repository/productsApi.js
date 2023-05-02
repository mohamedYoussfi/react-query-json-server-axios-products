import axios from "axios";
const productsApi = axios.create({
  baseURL: "http://localhost:9000",
});

export const getProducts = () => {
  return productsApi.get("/products");
};
export const searchProducts = (pageNumber, keyword) => {
  return productsApi.get(
    `/products?_limit=3&_page=${pageNumber}&name_like=${keyword}`
  );
};
export const addProduct = (product) => {
  return productsApi.post("/products", product);
};

export const updateProduct = (product) => {
  return productsApi.patch(`/products/${product.id}`, product);
};

export const deleteProduct = ({ id }) => {
  return productsApi.delete(`/products/${id}`);
};

export const checkProduct = (product) => {
  return productsApi.patch(`/products/${product.id}`, product);
};

export default productsApi;
