import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  checkProduct,
  searchProducts,
} from "../repository/productsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPenSquare,
  faRectangleList,
  faSearch,
  faSquare,
  faSquareArrowUpRight,
  faSquareEnvelope,
  faSquareFull,
  faSquareRootAlt,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useProducts } from "../hooks/useProducts";
function ProductsList() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totaPages, setTotalPages] = useState(1);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [keyword, setKeyword] = useState("");
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  const productsQuery = useQuery(
    ["products", pageNumber, keyword],
    () => searchProducts(pageNumber, keyword),
    {
      //select: (resp) => resp.data.sort((a, b) => b.id - a.id),
      enabled: true,
      onSuccess: (data) => {
        let totalElements = data.headers["x-total-count"];
        let pages = Math.floor(totalElements / pageSize);
        if (pages % pageSize != 0) pages = pages + 1;
        setTotalPages(pages);
      },
      onError: (error) => {
        console.log("loading products Error");
        console.log(error);
      },
    }
  );

  const addProductMutation = useMutation(addProduct, {
    onSuccess: () => {
      // Invalidate cache and refresh
      //queryClient.invalidateQueries("products");
      productsQuery.refetch();
    },
  });

  const deleteProductMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      // Invalidate cache and refresh
      queryClient.invalidateQueries("products");
      //productsQuery.refetch();
    },
  });

  const updateProductMutation = useMutation(updateProduct, {
    onSuccess: () => {
      // Invalidate cache and refresh
      //queryClient.invalidateQueries("products");
      productsQuery.refetch();
    },
  });
  const checkProductMutation = useMutation(checkProduct, {
    onSuccess: () => {
      // Invalidate cache and refresh
      //queryClient.invalidateQueries("products");
      productsQuery.refetch();
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    addProductMutation.mutate({
      name: productName,
      price: productPrice,
      checked: false,
    });
    setProductName("");
    setProductPrice(0);
  };
  const handleSearch = (event) => {
    event.preventDefault();
    setKeyword(query);
    setQuery("");
  };

  const handleNextPage = (increment) => {
    setPageNumber(pageNumber + increment);
    setQuery(`?name_like=${keyword}&_page=${pageNumber}&_limit=${pageSize}`);
  };

  const searchProductsForm = (
    <form onSubmit={handleSearch} className="border border-info">
      <input
        className="p-1 m-1"
        type="text"
        placeholder="keyword"
        onChange={(e) => setQuery(e.target.value)}
      ></input>
      {keyword}
      <button className="btn  btn-outline-info m-1">
        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
      </button>
    </form>
  );
  const newProductForm = (
    <form onSubmit={handleSubmit} className="border border-info">
      <input
        className="p-1 m-1"
        type="text"
        id="name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product Name"
      ></input>
      <input
        className="p-1 m-1"
        type="text"
        id="price"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        placeholder="Product Name"
      ></input>
      <button className="btn btn-outline-info">
        <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
      </button>
    </form>
  );
  let content;
  if (productsQuery.isLoading | productsQuery.isFetching) {
    content = <p>Loading ...</p>;
  } else if (productsQuery.isError) {
    content = <p>{productsQuery.error.message}</p>;
  } else {
    content = (
      <>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    productsQuery.data.data.forEach((p) => {
                      checkProductMutation.mutate({
                        ...p,
                        checked: !p.checked,
                      });
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                </button>
              </th>
              <th>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    productsQuery.data.data.forEach((p) => {
                      if (p.checked) deleteProductMutation.mutate(p);
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {productsQuery.data.data?.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>
                  <button
                    onClick={() =>
                      checkProductMutation.mutate({ ...p, checked: !p.checked })
                    }
                    className="btn btn-outline-success"
                  >
                    <FontAwesomeIcon
                      className="text-sucess"
                      icon={p.checked ? faCheck : faRectangleList}
                    ></FontAwesomeIcon>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => deleteProductMutation.mutate(p)}
                  >
                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="nav nav-pills">
          {new Array(totaPages).fill(0).map((v, index) => (
            <li key={"p" + index}>
              <button
                onClick={() => {
                  setPageNumber(index + 1);
                }}
                className={
                  pageNumber == index + 1
                    ? "btn btn-info m-1"
                    : "btn btn-outline-info m-1"
                }
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <main>
      <h1>Products List</h1>
      {searchProductsForm}
      {newProductForm}
      {content}
    </main>
  );
}

export default ProductsList;
