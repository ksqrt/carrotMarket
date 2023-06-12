import { Card } from "react-bootstrap";
// import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { Link } from "react-router-dom";
import Moment from "react-moment";

function ProductCard({ params }) {
  const like = params.likes.length

  return (
    <Card>
      <Link to={`/categories/${params.category}/${params._id}/details`}>
        <Card.Img variant="top" src={params.image} />
        <Card.Body>
          <Card.Title>{params.title}</Card.Title>
          <Card.Text>{params.price.toFixed(2)}원</Card.Text>
        </Card.Body>
        {/* 조회수 추가 */}
      </Link>
      <Card.Footer>
        <small className="text-muted">
          <Moment format="d MMM YYYY (dddd) HH:mm">{params.addedAt}</Moment>-{" "}
          <strong>{params.city}</strong>
          {/* <Link to="" id="heartIcon"><BsHeart /></Link> */}
          <br></br>
          <a>관심 ♥{like}</a>
        </small>
      </Card.Footer>
    </Card>
  );
}

export default ProductCard;
