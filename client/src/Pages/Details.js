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

function Details({ match, history }) {
    let productId = match.params.id;
    let [product, setProduct] = useState([])
    let [loading, setLoading] = useState(true);
    let [viewc, setViewc] = useState();
   
    useEffect(() => {
        window.scrollTo(0, 0)
        getSpecific(productId)
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