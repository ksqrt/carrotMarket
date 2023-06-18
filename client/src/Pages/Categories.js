import React from 'react';
import { useEffect, useState, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CategoriesNav from "../components/Categories/CategoriesNav";
import ProductCard from "../components/ProductCard/ProductCard";
import SearchBar from "../components/Categories/SearchBar";
import { Col, Spinner, Dropdown } from "react-bootstrap";
import { getAll } from "../services/productData";
import {
  BiSortDown,
  BiSort,
  BiDownArrowAlt,
  BiUpArrowAlt,
  BiSortUp,
} from "react-icons/bi";
import "../components/Siders/SearchSider.css";
import "../components/Categories/Categories.css";
import "../components/ProductCard/ProductCard.css";
import { SearchContext } from '../ContextAPI/SearchContext';
import { Context } from "../ContextStore.js";

function Categories({ match }) {
  let currentCategory = match.params.category;
  // const { query,setQuery } = useContext(SearchContext);
  const { query, setQuery } = useContext(Context);
  const [products, setProduct] = useState([]);
  const [page, setPage] = useState(1);
  // const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("oldest");
  
  useEffect(() => {
    setPage(1);
    setLoading(true);
    setQuery("");
    getAll(1, currentCategory)
      .then((res) => {
        setProduct(res.products);
        setLoading(false);
        setPage((page) => page + 1);
        setQuery("");
      })
      .catch((err) => console.log(err));
  }, [currentCategory, setProduct]);

  useEffect(() => {
    setPage(1);
    setLoading(true);
    getAll(2, currentCategory, query)
      .then((res) => {
        if (query === "") {
          setProduct((products) => [...products, ...res.products]);
        } else {
          setProduct(res.products);
        }
        setLoading(false);
        setPage((page) => page + 1);
      })
      .catch((err) => console.log(err));
  }, [query, currentCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  return (
    <>
      {/* <SearchBar value={query} onChange={handleSearch} /> */}

      {/* 카테고리 네비게이션 */}
      <CategoriesNav />
      {/* 카테고리 네비게이션 끝 */}

      {/* 메인페이지 : 정렬기능과 본문 */}
      <div className="container">
        {/* 정렬기능 */}
        <Dropdown id="dropdown-sort">
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            정렬 <BiSort />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setSort("oldest");
              }}
            >
              오래된 순 <BiDownArrowAlt />
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setSort("newest");
              }}
            >
              최신 순 <BiUpArrowAlt />
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setSort("lowerPrice");
              }}
            >
              가격 낮은 순 <BiSortDown />
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setSort("biggerPrice");
              }}
            >
              가격 높은 순 <BiSortUp />{" "}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {!loading ? (
          <InfiniteScroll
            dataLength={products.length}
            next={() => {
              if (query === "") {
                getAll(page, currentCategory).then((res) => {
                  setProduct([...products, ...res.products]);
                  setPage(page + 1);
                });
              }
            }}
            hasMore={() => {
              if (products.length > 0) {
                return true;
              }
              return false;
            }}
            className="row"
          >
            {products
              .sort((a, b) => {
                if (sort === "oldest") {
                  return a.addedAt.localeCompare(b.addedAt);
                }
                if (sort === "newest") {
                  return b.addedAt.localeCompare(a.addedAt);
                }
                if (sort === "lowerPrice") {
                  return b.price - a.price;
                }
                if (sort === "biggerPrice") {
                  return a.price - b.price;
                }
              })
              .map((x) => (
                <Col xs={12} md={6} lg={3} key={x._id.toString()}>
                  <ProductCard params={x} />
                </Col>
              ))}
          </InfiniteScroll>
        ) : (
          <div className="spinner">
            <Spinner animation="border" />
          </div>
        )}
      </div>
    </>
  );
}

export default Categories;
