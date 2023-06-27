import React from 'react';
import { useEffect, useState ,useContext} from 'react';
import ProductCard from '../../ProductCard/ProductCard';
import { Col, Row, Spinner, Button } from 'react-bootstrap';
import { getUserWishlist } from '../../../services/userData';
import { useHistory } from 'react-router-dom';
import { Context } from '../../../ContextStore'; // Context import
import './Wishlist.css';

function Wishlist() {
    const [products, setProduct] = useState([]);
    const { userData } = useContext(Context);
    let [loading, setLoading] = useState(true);
    const history = useHistory();

    let userId = null;
    if (userData != null) {
        if (typeof userData._id !== 'undefined') {
            userId = userData._id;
        } else {
            // userData가 null이지만 _id 속성이 없는 경우에 대한 처리
            // 예: 기본값 할당 또는 에러 처리 등
        }
    } else {
        // userData가 null인 경우에 대한 처리
        // 예: 기본값 할당 또는 에러 처리 등
    }
    useEffect(() => {
        //페이지 맨 위로 스크롤
        window.scrollTo(0, 0);
        getUserWishlist(userId)
            .then(res => {
                // Wishlist 배열에서 각 항목을 x라는 변수로 순회하면서 x.active가 true인지 확인
                // 만약 x.active가 true라면 해당 항목을 유지하고, 그렇지 않으면 제거
                setProduct(res.wishlist.filter(x => x.active === true));
                setLoading(false);
            })
            //에러를 콘솔로 출력
            .catch(err => console.log(err))
    }, [])

    return (
        <>
            {!loading ?
                (<>
                    <h1 className="heading">Wishlist</h1>
                    {/* 찜 목록에서 상품이 있는지 확인한다. */}
                    {products.length > 0 ? (
                        <Row>
                            {/* 상품이 있으면 products.map()을 사용하여 각 상품에 대해 반복하면서 ProductCard 컴포넌트를 생성한다. */}
                            {products
                                .map(x =>
                                    <Col xs={12} md={6} lg={4} key={x._id.toString()}>
                                        <ProductCard params={x} />
                                    </Col>
                                )
                            }
                        </Row>
                    ) : (
                            <div className="nothing-to-show-container">
                                <p className="nothing-to-show">관심 목록이 없습니다</p>
                                <Button variant="primary" onClick={() => history.push('/')} className="search-button">
                                    물건 검색
                                </Button>
                            </div>
                        )}
                </>) :
                <Spinner animation="border" />}
        </>
    );
}

export default Wishlist;
