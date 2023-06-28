import { useState, useEffect, useContext } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { GrEdit } from 'react-icons/gr';
import { MdArchive } from 'react-icons/md'
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { Col, Row, Spinner, Tabs, Tab, Image, OverlayTrigger, Tooltip, Modal, Form, Button } from 'react-bootstrap';
import { getAll, archiveSell, wishProduct, archiveSoldout, deleteProduct,declareProduct } from '../../../services/productData';
import ProductCard from "../../../components/ProductCard/ProductCard";
import aImage from '../../Profile/profile_images/a.png'; // 이미지 파일 경로
import bImage from '../../Profile/profile_images/b.png'; // 이미지 파일 경로
import cImage from '../../Profile/profile_images/c.png'; // 이미지 파일 경로
import dImage from '../../Profile/profile_images/d.png'; // 이미지 파일 경로
import eImage from '../../Profile/profile_images/e.png'; // 이미지 파일 경로
import { startChat, initializeSocket } from '../../../services/messagesData'; // startChat 함수와 socket 객체를 import합니다.
import { RiMessage3Fill } from 'react-icons/ri';
import { Context } from '../../../ContextStore'; // Context import
import { Link, useHistory } from 'react-router-dom';
import './ProductInfo.css';
import { Carousel } from 'react-bootstrap'

function ProductInfo({ params }) {

  const declareHandler = (e) =>{
    const declareproduct = e.target.value;
    console.log('ProductInfo'+declareproduct);
    declareProduct(declareproduct);
  }

  const [products, setProducts] = useState([]);
  const [wish, setWish] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMsg, setShowMdg] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showArchive2, setShowArchive2] = useState(false);
  const images = params && params.image ? params.image : [];
  
  const history = useHistory();

  const handleClose = () => setShowMdg(false);
  const handleShow = () => setShowMdg(true);

  const handleCloseArchive = () => setShowArchive(false);
  const handleShowArchive = () => setShowArchive(true);
  
  const handleCloseArchive2 = () => setShowArchive2(false);
  const handleShowArchive2 = () => setShowArchive2(true);

  const handleSubmit = (e) => {
    console.log('handleSubmit called')
      e.preventDefault();
      console.log('handleSubmit called2')
      archiveSell(params._id)
          .then(res => {
            console.log('handleSubmit called3')
              setShowArchive(false);
              history.push(`/profile/${params.seller}`);
          })
          .catch(err => console.log(err))
  }

  const handleSubmit2 = (e) => {
    console.log('handleSubmit2 called')
      e.preventDefault();
      console.log('handleSubmit2 called2')
      archiveSoldout(params._id)
          .then(res => {
            console.log('handleSubmit called3')
              setShowArchive2(false);
              history.push(`/profile/${params.seller}`);
          })
          .catch(err => console.log(err))
  }

  useEffect(() => {
    setWish(params.isWished === true);
  }, [params.isWished]);

  const onHearthClick = () => {
    if (wish === false) {
      wishProduct(params._id)
        .then(res => {
          setWish(true);
        })
        .catch(err => console.log(err))
    } else {
      wishProduct(params._id)
        .then(res => {
          setWish(false);
        })
        .catch(err => console.log(err))
    }
  }

  const fetchMoreData = () => {
    getAll(page)
      .then(res => {
        setProducts(prevProducts => [...prevProducts, ...res.products]);
        setPage(prevPage => prevPage + 1);
      })
      .catch(err => console.log(err));
  };

  //상품 삭제
  const handleDelPro = () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      deleteProduct(params._id)
        .then(res => {
          alert('상품이 삭제되었습니다.');
          history.push('/'); // '/'로 이동
        })
        .catch(error => {
          alert('상품 삭제에 실패하였습니다. 다시 시도해주세요.');
        });
    }
  };

  //매너온도
  const getMannerTemperatureStyle = (temperature) => {
    const width = temperature + "%";
    return {
      width: width,
      backgroundColor: getBackgroundColor(temperature)
    };
  };

  const getBackgroundColor = (temperature) => {
    // 여기에서 매너온도에 따른 배경색을 결정하는 로직을 작성하면 됩니다.
    // 예시로 몇 가지 범위에 따른 배경색을 지정합니다.
    if (temperature >= 0 && temperature < 21) {
      return "black";
    } else if (temperature >= 21 && temperature < 36.5) {
      return "darkblue";
    } else if (temperature >= 36.5 && temperature < 40) {
      return "royalblue";
    } else if (temperature >= 40 && temperature < 50) {
      return "green";
    } else if (temperature >= 50 && temperature < 60) {
      return "#f9bc28";
    } else {
      return "#ff6f31";
    }
  };

  const getMannerTemperatureImage = (temperature) => {
    if (temperature >= 0 && temperature < 21) {
      return "https://kr.object.ncloudstorage.com/ncp3/ncp3/2.png";
    } else if (temperature >= 21 && temperature < 36.5) {
      return "https://kr.object.ncloudstorage.com/ncp3/ncp3/3.png";
    } else if (temperature >= 36.5 && temperature < 40) {
      return "https://kr.object.ncloudstorage.com/ncp3/ncp3/4.png";
    } else if (temperature >= 40 && temperature < 50) {
      return "https://kr.object.ncloudstorage.com/ncp3/ncp3/5.png";
    } else if (temperature >= 50 && temperature < 60) {
      return "https://kr.object.ncloudstorage.com/ncp3/ncp3/5.png";
    } else {
      return null;
    }
  };

  const getFontColor = (temperature) => {
    if (temperature >= 0 && temperature < 21) {
      return "black";
    } else if (temperature >= 21 && temperature < 36.5) {
      return "darkblue";
    } else if (temperature >= 36.5 && temperature < 40) {
      return "royalblue";
    } else if (temperature >= 40 && temperature < 50) {
      return "green";
    } else if (temperature >= 50 && temperature < 60) {
      return "#f9bc28";
    } else {
      return "#ff6f31";
    }
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

    //업로드 시간이 60초 미만이라면 방금 전.
    if (seconds < 60) {
      return "방금 전";
      //업로드 시간이 60분 미만이라면 몇 분 전.
    } else if (minutes < 60) {
      return `${Math.floor(minutes)}분 전`;
      //업로드 시간이 24시간 미만이라면 몇 시간 전.
    } else if (hours < 24) {
      return `${Math.floor(hours)}시간 전`;
      //업로드 날짜가 30일 미만이라면 몇 일 전.
    } else if (days < 30) {
      return `${Math.floor(days)}일 전`;
      //업로드 날짜가 1년 미만이라면 몇 달 전.
    } else if (months < 12) {
      return `${Math.floor(months)}달 전`;
      //나머지는 몇 년 전으로...
    } else {
      return `${Math.floor(years)}년 전`;
    }
  };

  // startchat 이벤트 실행
  // const history = useHistory();
  const { userData } = useContext(Context);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const initSocket = async () => {
      const socket = await initializeSocket();
      setSocket(socket);
  
      socket.on('startChat', ({ chatId }) => {
        history.push(`/messages/${chatId}`);
      });
    };
  
    initSocket();
  }, []);

  
  const onChatStart = async (e) => {
    e.preventDefault();
    if (!socket) return;
    startChat(socket, { buyerId: userData._id, sellerId: params.sellerId, productId: params._id });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);


  //{params.title}: 상품 제목
  //{params.addedAt}: 업로드 날짜
  //{params.description}: 상품 설명
  //{params.createdSells}: 물품 갯수


  function sendLinkCustom() {
    
    if (window.Kakao) {
      window.Kakao.Link.sendCustom({
        templateId: 94886
      });
    }
  }

  function sendLinkDefault() {
    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: params && params.title ? params.title : '호랑이',
          description: params.description,
          imageUrl: params.image,
          link: {
            mobileWebUrl: 'https://developers.kakao.com',
            webUrl: `http://localhost:3000/categories/auto/${params._id}/details`,
          },
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: 'https://developers.kakao.com',
              webUrl: `http://localhost:3000/categories/auto/${params._id}/details`,
            },
          },
        ],
      });
    }
  }//수정

  return (
    <div className="d-flex flex-column align-items-center">
    <Carousel style={{ transition: 'transform 0.5s ease-in-out' }}>
      {images.map((img, index) => (
        <Carousel.Item key={index}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            className="d-block"
            style={{
              objectFit: "cover",
              maxWidth: "700px", // Set the desired maximum width
              maxHeight: "500px", // Set the desired maximum height
            }}
            src={img}
            alt={`Slide ${index + 1}`}
            />
          </div>
        </Carousel.Item>
      ))}
    </Carousel>

      <section id="profile">
        <div id="space-between">
          <div style={{ display: 'flex' }}>
            <Link to={ `/profile/${params.sellerId}` }>
              <div id='profile_image'>
                <img id="avatar" src={ params.avatar } alt="user-avatar" />
              </div>
            </Link>
            <div id="profile_left">
              <Link to={ `/profile/${params.sellerId}` }>
                <div id="nickname">{ params.name }</div>
              </Link>
              <div id="profile_address">{ params.city }</div>
              <div id="content_UpDel">
                { params.isSeller && (
                  <>
                    <OverlayTrigger placement="top" overlay={<Tooltip>상품 보관함 이동</Tooltip>}>
                    <button className="sell_box" onClick={handleShowArchive}>
                      <Link to={<MdArchive />}>보관함</Link>
                    </button>
                    </OverlayTrigger>
                    <span className="link-spacing"></span>
                    <OverlayTrigger placement="top" overlay={<Tooltip>판매 완료</Tooltip>} >
                      <button className="sell_box" onClick={ handleShowArchive2 }>
                        <Link to={<MdArchive />}>판매 완료</Link>
                          {/* <Link to="/archived-sells">
                            &nbsp;&nbsp;판매완료
                          </Link> */}
                      </button>
                    </OverlayTrigger>
                    <span className="link-spacing"></span>
                    <OverlayTrigger placement="top" overlay={<Tooltip>상품 수정하기</Tooltip>}>
                    <button className="sell_box">
                      <Link to={`/categories/${params.category}/${params._id}/edit`}>게시글 수정하기</Link>
                    </button>
                  </OverlayTrigger>
                  <span className="link-spacing"></span>
                  <OverlayTrigger placement="top" overlay={<Tooltip>상품 삭제하기</Tooltip>}>
                    <button className="sell_delete">
                      <Link to="#" onClick={ handleDelPro }>게시글 삭제하기</Link>
                    </button>
                  </OverlayTrigger>
                  </>
                )}
                
                <Modal show={ showArchive } onHide={ handleCloseArchive }>
                <Modal.Header closeButton>
                    <Modal.Title>보관함으로 이동하시겠습니까???</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   보관함에 넣어두어도 언제든 다시 재판매 가능합니다!!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseArchive}>
                        닫기
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                        보관함에 보관
                    </Button>
                </Modal.Footer>
              </Modal>


              <Modal show={ showArchive2 } onHide={ handleCloseArchive2 }>
                <Modal.Header closeButton>
                    <Modal.Title>판매완료 되었습니까???</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    정말 판매가 완료된 상품인지 확인하시오
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseArchive2}>
                        닫기
                    </Button>
                    <Button variant="success" onClick={handleSubmit2}>
                        판매 완료
                    </Button>
                </Modal.Footer>
              </Modal>

              </div>
            </div>
          </div>

          <div id="profile_right">
            <div id="tem_total">
              <p id="tem_total_txt">매너온도</p>
              <div className='meters'>
                <p id="tem_total_cnt" style={{ marginBottom: '-1px', float: 'right', color: getFontColor(36.5) }}>
                  {36.5}°C
                </p>
                {/* <p id="tem_total_img">
                  <img
                    src={getMannerTemperatureImage(36.5)}
                    alt="이미지 사진"
                    style={{ width: '25px', height: '25px' }}
                  />
                </p> */}
              </div>
              <div className="manner-thermometer" style={{ width: '100%' }}>
                <div className="manner-thermometer-fill" style={getMannerTemperatureStyle(36.5)}></div>
              </div>
            </div>
          </div>

        {/* <dl id="manner_temper">
          <dt>매너온도</dt>
          <dd className="text-color">75<span>°C</span></dd>
        </dl>
        <div className="meters">
          <div id="bar" className="bar-color-06" style={{ width: '75%' }}></div>
          <div id="face" className="face-06">페이스</div>
        </div> */}
        </div>
      </section>

      <section id='content'>
        <h1 id='content_title'>{ params.title }</h1>
        <p id='content_category'>{ params.category } · <time>{displayCreateAt(params.addedAt)}</time></p>
        <p id='content_price'>{params.price ? params.price.toLocaleString() : ''}원</p>
        <p id='content_main'>{ params.description }</p>
        <p id='content_cnt'> 관심 ♥ { params.likes } · 채팅 갯수 · 조회 수 { params.views } </p>
        <div id='content_button'>
          {params.isAuth ? (
            <>
              {!params.isSeller && (
                <Button variant="primary" style={{ backgroundColor: '#FF7E36', borderColor: 'orange', color: 'white' }} className="col-lg-9" id="btnContact" onClick={ onChatStart }>
                  <RiMessage3Fill />채팅하기
                </Button>
              )}
            </>
          ) : (
            <p id="guest-msg">
              판매자와 연락하기 위해 지금!<Link to="/auth/login">로그인</Link>하세요!
            </p>
          )}
          <span>
            <a id="kakaotalk-sharing-btn" href="javascript:;" onClick={sendLinkDefault}>
              <img
                  src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                  style={{ width: "50px", height: "50px", marginLeft: '15px', marginBottom: '45px' }}
                  alt="카카오톡 공유 보내기 버튼"
                />
            </a>
          </span>
          {!params.isSeller && (
            <span id="heartIconDetails" className="col-lg-1 col-sm-1" onClick={onHearthClick}>
              {params.isAuth && (
                <>
                  {!wish ? (
                    <OverlayTrigger placement="top" overlay={<Tooltip>관심 목록에 추가</Tooltip>}>
                      <BsHeart />
                    </OverlayTrigger>
                  ) : (
                    <OverlayTrigger placement="top" overlay={<Tooltip>관심 목록에서 제거</Tooltip>}>
                      <BsHeartFill />
                    </OverlayTrigger>
                  )}
                </>
              )}
            </span>
          )}


           <div>
            {/* <button onClick={sendLinkCustom}>Send Custom Link</button> */}
                <button className="kakao-button" onClick = {sendLinkDefault}>카카오 공유하기</button>
                <button className='declare-button' value={params._id} onClick={declareHandler} >신고하기</button>
            </div>
          </div>
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
            hasMore= {true }
            className="row"
          >
            <Row>
              {products.map(product => (
                <Col md={8} lg={4} key={product._id}>
                  <div className="product-card">
                    <ProductCard params={product} />
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