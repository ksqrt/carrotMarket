import { useState, useEffect, useContext } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { GrEdit } from 'react-icons/gr';
import { MdArchive } from 'react-icons/md'
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { Col, Row, Spinner, Tabs, Tab, Image, OverlayTrigger, Tooltip, Modal, Form, Button } from 'react-bootstrap';
import { getAll, archiveSell, wishProduct } from '../../../services/productData';
import ProductCard from "../../../components/ProductCard/ProductCard";
import Messages from '../../../Pages/Messages';
import aImage from '../../Profile/profile_images/a.png'; // 이미지 파일 경로
import bImage from '../../Profile/profile_images/b.png'; // 이미지 파일 경로
import cImage from '../../Profile/profile_images/c.png'; // 이미지 파일 경로
import dImage from '../../Profile/profile_images/d.png'; // 이미지 파일 경로
import eImage from '../../Profile/profile_images/e.png'; // 이미지 파일 경로
import { startChat, initializeSocket, getUserConversations } from '../../../services/messagesData'; // startChat 함수와 socket 객체를 import합니다.
import { RiMessage3Fill } from 'react-icons/ri';
import { Context } from '../../../ContextStore'; // Context import
import { Link, useHistory } from 'react-router-dom';

function ProductInfo({ params }) {
  const [products, setProducts] = useState([]);
  const [wish, setWish] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMsg, setShowMdg] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const history = useHistory();
  const handleClose = () => setShowMdg(false);
  const handleShow = () => setShowMdg(true);

  const handleCloseArchive = () => setShowArchive(false);
  const handleShowArchive = () => setShowArchive(true);

  console.log(params)

  const handleSubmit = (e) => {
      e.preventDefault();
      archiveSell(params._id)
          .then(res => {
              setShowArchive(false);
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
      return aImage;
    } else if (temperature >= 21 && temperature < 36.5) {
      return bImage;
    } else if (temperature >= 36.5 && temperature < 40) {
      return cImage;
    } else if (temperature >= 40 && temperature < 50) {
      return dImage;
    } else if (temperature >= 50 && temperature < 60) {
      return eImage;
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
    startChat(socket, { buyerId: userData._id, sellerId: params.sellerId });
  };

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
          title:params && params.title ? params.title : '호랑이',
          description: params.description,
          imageUrl: params.image,
          link: {
            mobileWebUrl: 'https://developers.kakao.com',
            webUrl: 'https://developers.kakao.com',
          },
        },
        social: {
          likeCount: 286,
          commentCount: 45,
          sharedCount: 845,
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
      <section id='images'>
        <Image className="col-lg-12" src={ params.image } rounded />
      </section>

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
                    <OverlayTrigger placement="top" overlay={ <Tooltip>상품 보관함 이동</Tooltip>} >
                      <span id="archive-icon" onClick={handleShowArchive}>
                        <Link to={<MdArchive />}>보관함으로 이동</Link>
                      </span>
                    </OverlayTrigger>
                    <span className="link-spacing"></span>
                    <OverlayTrigger placement="top" overlay={ <Tooltip>상품 수정하기</Tooltip>} >
                      <Link to={`/categories/${params.category}/${params._id}/edit`}>게시글 수정하기</Link>
                    </OverlayTrigger> 
                    <span className="link-spacing"></span>
                    <OverlayTrigger placement="top" overlay={ <Tooltip>상품 삭제하기</Tooltip>} >
                      <Link to={`/categories/${params.category}/${params._id}/delete`}>게시글 삭제하기</Link>
                    </OverlayTrigger>
                  </>
                ) }
                <Modal show={ showArchive } onHide={ handleCloseArchive }>
                <Modal.Header closeButton>
                    <Modal.Title>보관함으로 이동하시겠습니까???</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        By clicking <strong>Archive</strong>, this sell will change
                    it's status to <strong>Archived</strong>,
                    which means that no one but you will be able see it.
                    You may want to change the status to <strong>Actived</strong> if you have
                    sold the item or you don't want to sell it anymore.
                    </p>

                    Don't worry, you can unarchive it at any time from Profile - Sells!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseArchive}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                        Archive
                    </Button>
                </Modal.Footer>
              </Modal>
                {/* <OverlayTrigger placement="top" overlay={ <Tooltip>상품 활성화하기</Tooltip>} >
                  <span id="archive-icon" onClick={ handleShowArchive }>
                    <Link to={<MdArchive />}></Link>
                  </span>
                </OverlayTrigger> */}
              </div>
            </div>
          </div>

          <div id="profile_right">
            <div id="tem_total">
              <p style={{ float: 'left', fontWeight: 'bold', textDecoration: 'underline' }}>매너온도</p>
              <p style={{ marginBottom: '-1px', float: 'right', color: getFontColor(36.5) }}>{36.5}°C
                <img
                  src={getMannerTemperatureImage(36.5)}
                  alt="이미지 사진"
                  style={{ width: '50px', height: '50px' }}
                />
              </p>
              <div className="manner-thermometer" style={{ marginBottom: '10px' }}>
                <div className="manner-thermometer-fill" style={getMannerTemperatureStyle(36.5)}></div>
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
        </div>
      </section>

      <section id='content'>
        <h1 id='content_title'>{ params.title }</h1>
        <p id='content_category'>{ params.category } · <time>{displayCreateAt(params.addedAt)}</time></p>
        <p id='content_price'>{params.price ? params.price.toLocaleString() : ''}원</p>
        <p id='content_main'>{ params.description }</p>
        <p id='content_cnt'> 관심 ♥ · 채팅 갯수 · 조회 수 </p>
        <div id='content_button'>
          { params.isAuth ? (
            <>
              { !params.isSeller && (
                <Button variant="dark" className="col-lg-10" id="btnContact" onClick={onChatStart}>
                  <RiMessage3Fill />채팅으로 거래하기
                </Button>
              )}
            </>
          ) : (
            <p id="guest-msg">
              <Link to="/auth/login">Sign In</Link> now to contact the seller!
            </p>
          )}
          { !params.isSeller && (
            <span id="heartIconDetails" className="col-lg-1 col-sm-1" onClick={ onHearthClick }>
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
                <button onClick = {sendLinkDefault}>카카오 공유하기</button>
                 

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