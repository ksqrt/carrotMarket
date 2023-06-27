import React,{useContext} from 'react';
import { useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import SimpleSider from '../components/Siders/SimpleSider';
import Breadcrumb from '../components/Details/Breadcrumb'
import ProductInfo from '../components/Details/ProductInfo/ProductInfo';
import Aside from '../components/Details/Aside/Aside';
import { getSpecific, views } from '../services/productData'
import '../components/Details/ProductInfo/ProductInfo.css';
import '../components/Details/Aside/Aside.css';
import KakaoShare from '../components/Kakao/KakaoShare';
import { Context } from '../ContextStore';

function Details({ match, history }) {
    const { userData } = useContext(Context);
    
    let productId = match.params.id;
    let [product, setProduct] = useState([])
    let [loading, setLoading] = useState(true);
    let [viewc, setViewc] = useState();

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

    // userId를 사용하는 나머지 코드 작성

    useEffect(() => {
        window.scrollTo(0, 0)
        getSpecific(productId,userId)
            .then(res => setProduct(res), setLoading(false))
            .catch(err => console.log(err));
        
        }, [productId, setProduct, setLoading])
    useEffect(()=>{    
        views(productId)
            .then(res => setViewc(res))
            .catch(err => console.log(err));
    },[productId])
        return (
        <>
            <div className="container d-flex justify-content-center align-items-center">
                {!loading ? (
                    <>
                    <Row>
                        <Col lg={12} id="detailsProduct">
                            <ProductInfo params={product} />
                        </Col>
                    </Row></>) : (<Spinner animation="border" />)}
                <a id="kakaotalk-sharing-btn" href="javascript:;">
                    <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                    alt="카카오톡 공유 보내기 버튼" />
                </a>

                

            </div>
        </>
    )
}

export default Details;