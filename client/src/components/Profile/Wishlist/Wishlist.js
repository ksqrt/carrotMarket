import { useEffect, useState } from 'react';
import ProductCard from '../../ProductCard/ProductCard';
import { Col, Row, Spinner } from 'react-bootstrap';
import { getUserWishlist } from '../../../services/userData';

import './Wishlist.css';

function Wishlist() {
    const [products, setProduct] = useState([])
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        //페이지 맨 위로 스크롤
        window.scrollTo(0, 0);
        getUserWishlist()
            .then(res => {
                // Wishlist 배열에서 각 항목을 x라는 변수로 순회하면서 x.active가 true인지 확인
                // 만약 x.active가 true라면 해당 항목을 유지하고, 그렇지 않으면 제거
                setProduct(res.wishlist.filter(x => x.active === true));
                setLoading(false);
            })
            //에러를 콘솔로 출력
            .catch(err => console.log(err))
    }, [setProduct, setLoading])

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
                            {/* 상품이 없으면 Noting to show 라는 메시지 표시 */}
                        </Row>
                    ) : (
                            <p className="nothing-to-show">Nothing to show</p>
                        )}

                </>) :
                <Spinner animation="border" />}

        </>
    )
}

export default Wishlist;