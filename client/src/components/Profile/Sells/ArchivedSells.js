import { useEffect, useState } from 'react';
import DisabledCard from '../../DisabledProductCard/DisabledCard';
import { Col, Row, Spinner } from 'react-bootstrap';
import { getUserArchivedSells } from '../../../services/userData';

import './Sells.css';
import '../../DisabledProductCard/DisabledCard.css'

//판매 이력을 가져와서 표시하는 기능을 가지고 있는 걸로 추정

function ArchivedSells({ history }) {
    //useState를 빈 배열로 설정
    const [products, setProduct] = useState([])
    //useState를 써서 로딩의 변수 초기값을 참으로 설정
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        //처음 로드 도리 때 스크롤을 페이지 상단으로 이동시키는 역할
        window.scrollTo(0, 0);
        //사용자의 판매 이력을 가져오는 비동기 함수
        getUserArchivedSells()
            .then(res => {
                //products 상태를 업데이트를 하고 loding을 false로 설정
                setProduct(res.sells);
                setLoading(false)
            })
            //비동기 작업이 실패하면 콘솔로 에러 메시지 출력
            .catch(err => console.log(err))
            //setProduct, setLoading이 바뀔 때마다 useEffect가 실행
    }, [setProduct, setLoading])

    return (
        <>
            {!loading ?
                (<>
                    <h1 className="heading">Archive</h1>
                    {/* products 값이 존재 할 경우... */}
                    {/* 만약 값이 없으면 상품이 없다는 것. Nothing to show */}
                    {/* 로딩 중 상태를 나타내기 위해 spnner 컴포넌트를 사용.*/}
                    {products.length > 0 ?  (
                        <Row>
                            {/* map 함수를 사용하여, 배열의 각 항목에 대해 ProductCard 컴포넌트를 생성 */}
                            {/* Col xs={12} md={6} lg={4} key={x._id.toString()} -> 반응형 그리드 시스템 설정 */}
                            {products
                                .filter(x => x.active === true || x.soldout === false)
                                .map(x =>
                                    <Col xs={12} md={6} lg={4} key={x._id.toString()}>
                                        <DisabledCard params={x} history={history} />
                                    </Col>
                                )
                            }


                        </Row>
                    ) : (
                            <p className="nothing-to-show">보관함 목록이 없습니다.</p>
                        )
                    }
                </>) :
                <Spinner animation="border" />}
        </>
    )
}

export default ArchivedSells;