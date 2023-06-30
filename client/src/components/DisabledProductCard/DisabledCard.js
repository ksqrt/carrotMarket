import React from 'react';
import { useState, useContext } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import { RiDeviceRecoverFill } from 'react-icons/ri';
import { activateSell } from '../../services/productData';
import Moment from "react-moment";
import 'moment/locale/ko'; // 한국어 로케일을 불러옵니다.
import { Context } from '../../ContextStore';
import { useParams } from 'react-router-dom';

function DisabledCard({ params, history }) {
    const { userData } = useContext(Context);
    const [show, setShow] = useState(false);
    const { id } = useParams();

    const isCurrentUserSeller = userData && id === userData._id;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSubmit = (e) => {
        e.preventDefault();
        activateSell(params._id)
            .then(res => {
                history.push(`/categories/${params.category}/${params._id}/details`)
                setShow(false);
            })
            .catch(err => console.log(err))
    }

    const like = params.likes.length
    const view = params.views.length
    const currentDate = new Date(); // 현재 날짜와 시간을 가져옵니다.
    const addedDate = new Date(params.addedAt); // params.addedAt 값을 Date 객체로 변환합니다.
    const isToday = currentDate.toDateString() === addedDate.toDateString();
    const isYesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1).toDateString() === addedDate.toDateString();
    const firstImage = params && params.image && params.image.length > 0 ? params.image[0] : '';
  
    let formattedDate;
  
    if (isToday) {
      formattedDate = '오늘';
    } else if (isYesterday) {
      formattedDate = '어제';
    } else {
      const timeDiff = Math.abs(currentDate - addedDate);
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 일 수 차이 계산
      formattedDate = `${daysDiff}일 전`;
    }  

    console.log(params.isSeller)

    return (
        <div className="disabled-card">
            <Card>
                <Card.Img variant="top" src={ firstImage } />
                { userData && isCurrentUserSeller && (
                    <span id="enableIcon" onClick={handleShow}>
                        <RiDeviceRecoverFill />
                    </span>
                )}
                <Card.Body>
                    <Card.Title style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                        { params.title.length > 10 ? `${ params.title.substring(0, 15) }...` : params.title }
                        <br />
                        <a style={{ color: '#808080', fontSize: '12px' }}>{ params.city }</a>
                    </Card.Title>
                    {/* <Card.Text>{params.price}</Card.Text> */}
                </Card.Body>
                <Card.Footer style={{ filter: 'grayscale(100%)', border: 'none' , borderRadius: '10px'  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                        <strong style={{ color: '#FF7E36', fontSize: '18px' }}>{params.price.toLocaleString()} 원 </strong>
                        <br />
                        <small className="text-muted">
                            { formattedDate && <span>{ formattedDate }</span>}
                            {!isToday && !isYesterday && !formattedDate && (
                            <Moment locale="ko" format="YYYY년 MM월 DD일 HH:mm">
                                { params.addedAt }
                            </Moment>
                            )}
                            {/* <br />
                            {params.city} */}
                            {/* <Link to="" id="heartIcon"><BsHeart /></Link> */}
                        </small>
                        </div>
                        <div>
                        <a style={{ color: '#FF7E36', fontWeight: 'bold', textDecoration: 'none' }}>
                            <span style={{ color: '#FF7E36' }}>♥</span> {like}
                        </a>
                        <br />
                            <a style={{ color: '#555', fontSize: '12px' }}>조회 {view}</a>
                        </div>
                    </div>
                </Card.Footer>
            </Card>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>물품 활성화?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    정말로 <strong>물품 활성화</strong>를 하겠습니까?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                        활성화
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DisabledCard;