import React from 'react';
import { Card } from "react-bootstrap";
// import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { Link } from "react-router-dom";
import Moment from "react-moment";

function ProductCard({ params }) {
  const like = params.likes.length
  const view = params.views.length

  return (
    <Card>
      <Link to={`/categories/${params.category}/${params._id}/details`}>
        <Card.Img variant="top " style={{ borderRadius: '10px' }} src={params.image} />
        <Card.Body>
          <Card.Title>{params.title.length > 10 ? `${params.title.substring(0, 10)}...` : params.title}</Card.Title>
        </Card.Body>
        {/* 조회수 추가 */}
      </Link>
      {/* <Card.Footer style={{ backgroundColor : "white"}}>  */}
      <Card.Footer> 
        <strong style={{ color: '#FF7E36', fontSize: '20px' }}>{params.price.toLocaleString()} 원 </strong>
        <br></br>
        <small className="text-muted">
          <Moment format="YYYY년 MM월 d일HH:mm">{params.addedAt}</Moment>{" "}
          {params.city}
          {/* <Link to="" id="heartIcon"><BsHeart /></Link> */}
          

          <br></br>
          <a>관심 <span style={{ color: '#FF7E36'}}> ♥</span> {like}</a>
          <br></br>
          <a>조회수 {view}</a>
        </small>
      </Card.Footer>
    </Card>
  );
}

export default ProductCard;
