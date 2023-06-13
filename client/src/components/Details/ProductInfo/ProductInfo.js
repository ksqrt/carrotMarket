import { useState, useEffect } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { Col, Row, Spinner, Tabs, Tab, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { wishProduct } from '../../../services/productData';
import ProductCard from "../../../components/ProductCard/ProductCard";
import { getAll } from "../../../services/productData";

function ProductInfo({ params }) {
  const [products, setProducts] = useState([]);
  const [wish, setWish] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWish(params.isWished === true);
  }, [params.isWished]);

  const onHeartClick = () => {
    const toggleWish = !wish;
    wishProduct(params._id)
      .then(res => {
        setWish(toggleWish);
      })
      .catch(err => console.log(err));
  };

  const fetchMoreData = () => {
    getAll(page)
      .then(res => {
        setProducts(prevProducts => [...prevProducts, ...res.products]);
        setPage(prevPage => prevPage + 1);
      })
      .catch(err => console.log(err));
  };

  //글 작성시간 계산 함수
  const displayCreateAt = (createdAt) => {
    const date = new Date(createdAt);
    const now = Date.now();
    const milliSeconds = now - date;

    const seconds = milliSeconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const months = days / 30;
    const years = months / 12;

    //업로드 시간이 60초 미만이라면 방금 전
    if (seconds < 60) {
      return "방금 전";
    //업로드 시간이 60분 미만이라면 몇 분 전
    } else if (minutes < 60) {
      return `${Math.floor(minutes)}분 전`;
    //업로드 시간이 24시간 미만이라면 몇 시간 전
    } else if (hours < 24) {
      return `${Math.floor(hours)}시간 전`;
    //업로드 날짜가 30일 미만이라면 몇 일 전
    } else if (days < 30) {
      return `${Math.floor(days)}일 전`;
    //업로드 날짜가 1년 미만이라면 몇 달 전
    } else if (months < 12) {
      return `${Math.floor(months)}달 전`;
    //나머지는 몇 년 전으로...
    } else {
      return `${Math.floor(years)}년 전`;
    }
  };

  //{params.title}: 상품 제목
  //{params.addedAt}: 업로드 날짜
  //{params.description}: 상품 설명
  //{params.createdSells}: 물품 갯수

  return (
    <div className="d-flex flex-column align-items-center">
        <section id='images'>
            <Image className="col-lg-12" src={params.image} rounded />
        </section>

        <section id="profile">
            <a id="profile_link" href=''>
                <div id="space-between">
                    <div style={{ display: 'flex' }}>
                        <div id='profile_image'>
                            <img id="avatar" src={params.avatar} alt="user-avatar" />
                        </div>
                        <div id="profile_left">
                            <div id="nickname">{params.name}</div>
                            <div id="profile_address">안산시 단원구 선부동</div>
                        </div>
                    </div>

                    <div id="profile_right">
                        <dl id="manner_temper">
                            <dt>매너온도</dt>
                            <dd className="text-color">75<span>°C</span></dd>
                        </dl>
                        <div className="meters">
                            <div id="bar" className="bar-color-06" style={{ width: '75%' }}></div>
                            <div id="face" className="face-06">페이스</div>
                        </div>
                    </div>
                </div>
            </a>
        </section>

        <section id='content'>
            <h1 id='content_title'>{ params.title }</h1>
            <p id='content_category'>{ params.category } · <time>{displayCreateAt(params.addedAt)}</time></p>
            <p id='content_price'>{ params.price }원</p>
            <p id='content_main'>{ params.description }</p>
            <p id='content_cnt'> 관심 갯수 · 채팅 갯수 · 조회수 </p>
        </section>

        <section id="product_more">
          <h3>당근마켓 인기중고</h3> 
            <div id='more_link'>
              <a href=''>더 구경하기</a>
            </div>
            <div id='container'>
              <InfiniteScroll
                  dataLength={ products.length }
                  next={ fetchMoreData }
                  hasMore={ true }
                  className="row"
                >
                <Row>
                  {products.map(product => (
                    <Col md={ 8 } lg={ 4 } key={ product._id }>
                      <div className="product-card">
                        <ProductCard params={ product } />
                      </div>
                    </Col>
                  ))}
                </Row>
              </InfiniteScroll>
            </div>
        </section>
    </div>
  );
}

export default ProductInfo;