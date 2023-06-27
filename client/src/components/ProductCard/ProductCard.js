import React from 'react';
import { Card } from "react-bootstrap";
// import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { Link } from "react-router-dom";
import Moment from "react-moment";
import 'moment/locale/ko'; // 한국어 로케일을 불러옵니다.



function ProductCard({ params }) {
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


  console.log('ProductCard' + params.category);


  return (
    <Card style={{ border: 'none' }}>
    <Link to={`/categories/${params.category}/${params._id}/details`} style={{ textDecoration: 'none' }}>
      <Card.Img variant="top" style={{ borderRadius: '10px' }} src={ firstImage } />
      <Card.Body>
        <Card.Title style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
          {params.title.length > 10 ? `${params.title.substring(0, 15)}...` : params.title}
          <br />
          <a style={{ color: '#808080', fontSize: '12px' }}>{params.city}</a>
        </Card.Title>
        {/* <Card.Text style={{ color: '#555', fontSize: '14px', marginBottom: '12px' }}>
          {params.description}
        </Card.Text> */}
        {/* 조회수 추가 */}
      </Card.Body>
    <Card.Footer style={{ backgroundColor: '#f8f9fa', border: 'none' , borderRadius: '10px'  }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ color: '#FF7E36', fontSize: '18px' }}>{params.price.toLocaleString()} 원 </strong>
          <br />
          <small className="text-muted">
            {formattedDate && <span>{formattedDate}</span>}
            {!isToday && !isYesterday && !formattedDate && (
              <Moment locale="ko" format="YYYY년 MM월 DD일 HH:mm">
                {params.addedAt}
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
    </Link>
  </Card>
  
  );
}

export default ProductCard;
