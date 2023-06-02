import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CategoriesNav from "../components/Categories/CategoriesNav";
import ProductCard from "../components/ProductCard/ProductCard";
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

function Categories({ match }) {
  let currentCategory = match.params.category;
  const [products, setProduct] = useState([]);
  //  페이지 스테이트
  const [page, setPage] = useState(1);
  // 검색 스테이트
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("oldest");

  // 기존 루트 주소 접속시 페이지값을 1로 초기화
  useEffect(() => {
    setPage(1);
    setLoading(true);
    setQuery("");
    // getAll 함수는 ../services/productData 에 위치하며 쿼리문을 실행시킴
    getAll(1, currentCategory)
      .then((res) => {
        setProduct(res.products);
        setLoading(false);
        setPage((page) => page + 1);
        setQuery("");
      })
      .catch((err) => console.log(err));
  }, [currentCategory, setProduct]);

  // query와 currentCategory 의 값이 변화할때 실행
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
      {/* 검색기능 value 가 바뀌면 => handleSearch 실행 => setQuery 에 value 값을 넣으면 query 값이 변경되며 useEffect 실행 => getAll 실행 */}
      <div id="sider">
        <input
          className="col-lg-6"
          type="text"
          placeholder="검색..."
          name="search"
          value={query}
          onChange={handleSearch}
        />
      </div>
      {/* 검색끝 */}

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

        {/* InfiniteScroll 컴포넌트를 사용하여 상품 목록을 무한으로 스크롤합니다 */}
        {/* products 배열의 길이가 변할 때마다 데이터 길이를 업데이트합니다. */}
        {/* query 값이 없을 경우에만 다음 페이지의 데이터를 가져옵니다. */}
        {/* className 속성을 사용하여 스타일링을 적용합니다. */}

        {!loading ? (
          <InfiniteScroll
            dataLength={products.length}
            next={() => {
              if (query === "") {
                /* 현재 페이지와 현재 카테고리를 사용하여 모든 상품 데이터를 가져옵니다. */
                getAll(page, currentCategory).then((res) => {
                  /* 기존 상품 목록에 새로운 상품 데이터를 추가합니다. */
                  setProduct([...products, ...res.products]);
                  /* 페이지 번호를 증가시킵니다. */
                  setPage(page + 1);
                });
              }
            }}
            hasMore={() => {
              /* 상품 목록이 비어있지 않으면 더 많은 데이터가 있음을 반환합니다. */
              if (products.length > 0) {
                return true;
              }
              return false;
            }}
            className="row"
          >
            {/* products 배열을 정렬합니다. */}
            {/* sort 상태에 따라 다른 정렬 기준을 사용합니다. */}
            {products
              .sort((a, b) => {
                if (sort === "oldest") {
                  /* 오래된 순으로 정렬합니다. */
                  return a.addedAt.localeCompare(b.addedAt);
                }
                if (sort === "newest") {
                  /* 최신 순으로 정렬합니다. */
                  return b.addedAt.localeCompare(a.addedAt);
                }
                if (sort === "lowerPrice") {
                  /* 가격이 낮은 순으로 정렬합니다. */
                  return b.price - a.price;
                }
                if (sort === "biggerPrice") {
                  /* 가격이 높은 순으로 정렬합니다. */
                  return a.price - b.price;
                }
              })
              /* 정렬후 각 상품에 대해 컴포넌트를 생성합니다. */
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
