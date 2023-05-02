import { useQuery } from "react-query";
import { getProducts } from "../repository/productsApi";

export const useProducts = () => {
  return useQuery("products", getProducts, {
    select: (data) => data.sort((a, b) => b.id - a.id),
    enabled: false,
    onSuccess: (data) => {
      console.log("loading products sucess");
      console.group(data);
    },
    onError: (error) => {
      console.log("loading products Error");
      console.log(error);
    },
  });
};
