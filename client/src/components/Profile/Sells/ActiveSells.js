import { useEffect, useState } from 'react';
import ProductCard from '../../ProductCard/ProductCard';
import { Col, Row, Spinner } from 'react-bootstrap';
import { getUserActiveSells } from '../../../services/userData';

import './Sells.css';
function ActiveSells({ params, history }) {
    //useState(): 컴포넌트에서 바뀌는 값을 관리하는 함수.
    //const[<상태 값 저장 변수>, <상태 값 갱신 함수>] = useState(<상태 초기값>);
    //useState 상태 초기값을 빈 배열로 생성.
    //const 변수는 업데이트와 재선언 둘 다 불가능하다.
    const [products, setProduct] = useState([])

    //let 함수는 const 변수와 다르게 업데이트는 할 수 있지만, 재선언을 할 수 없다.
    //useState 상태 초기값을 참으로 선언.
    let [loading, setLoading] = useState(true);

    //useEffect: 렌더링 될 때마다 특정 작업(Sied effect)을 실행할 수 있도록 하는 리액트 Hook.
    useEffect(() => {
        //window.scrollTo를 사용하여 브라우저 창을 페이지의 맨 위로 스크롤한다.
        //window.scrollTo(x좌표, y좌표) 
        window.scrollTo(0, 0);

        //id가 존재할 때...
        if (params._id) {
            //userData에 있는 getUserActiveSells 함수를 호출하여 params._id를 인자로 전달하고
            //액티브 판매 상품을 가져오는 비동기 작업을 수행한다.
            getUserActiveSells(params._id)

                //응답 객체 res을 받아와서 sells 값을 products 상태로 설정하고
                //loding 상태를 false로 변경
                .then(res => {
                    setProduct(res.sells);
                    setLoading(false)
                })
                //에러가 발생하면 console.log로 err 출력
                .catch(err => console.log(err))
        }
    //params._id의 값이 변경될 때마다 useEffect의 콜백 함수가 실행.
    }, [params._id])

    return (
        <>
            {/* loding값이 true가 아니라면... */}
            {!loading ?
                (<>
                    <h1 className="heading">Active Sells</h1>
                    {/* products 값이 존재 할 경우... */}
                    {/* 만약 값이 없으면 장바구니에 상품이 없다는 것. Nothing to show */}
                    {/* 로딩 중 상태를 나타내기 위해 spnner 컴포넌트를 사용.*/}
                    {products ? (
                        <Row>
                            {/* map 함수를 사용하여, 배열의 각 항목에 대해 ProductCard 컴포넌트를 생성 */}
                            {/* Col xs={12} md={6} lg={4} key={x._id.toString()} -> 반응형 그리드 시스템 설정 */}
                            {products
                                .map(x =>
                                    <Col xs={12} md={6} lg={4} key={x._id.toString()}>
                                        <ProductCard params={x} />
                                    </Col>
                                )
                            }
                        </Row>
                    ) : (
                            <p className="nothing-to-show">Nothing to show</p>
                        )
                    }
                </>) :
                <Spinner animation="border" />}
        </>
    )
}

export default ActiveSells;