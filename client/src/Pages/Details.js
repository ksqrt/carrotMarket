import { useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import SimpleSider from '../components/Siders/SimpleSider';
import Breadcrumb from '../components/Details/Breadcrumb'
import ProductInfo from '../components/Details/ProductInfo/ProductInfo';
import Aside from '../components/Details/Aside/Aside';
import { getSpecific } from '../services/productData'

import '../components/Details/ProductInfo/ProductInfo.css';
import '../components/Details/Aside/Aside.css';

function Details({ match, history }) {
    let productId = match.params.id;
    let [product, setProduct] = useState([])
    let [loading, setLoading] = useState(true);
   
    useEffect(() => {
        window.scrollTo(0, 0)
        getSpecific(productId)
            .then(res => setProduct(res), setLoading(false))
            .catch(err => console.log(err));
            
    }, [productId, setProduct, setLoading])
    
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
            </div>
        </>
    )
}

export default Details;