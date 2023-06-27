import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import './AdminProduct.css';
import {deleteProduct} from './../../services/adminData';
import { Link,useHistory } from 'react-router-dom';
import { getSpecific } from '../../services/productData';
import Details from '../../Pages/Details';

const AdminProduct = (props) => {
    
    const adminProducts = props.params;
    console.log(adminProducts);


    const filteredProducts = adminProducts.filter(product => product.declare === true);
    console.log('true인것만 출력',filteredProducts);

   
    const deleteProductHandler = (product) =>{
      console.log('찍히냐');
      console.log(product._id);

       deleteProduct(product._id);
       window.location.reload();

    }
    const history = useHistory();

    const getSpecificHandler = async (product) => {
      try {
        const info = await getSpecific(product._id);
        history.push(`/categories/${info.category}/${product._id}/details`);
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <div>
        <div id="cardAdmin-wrap">
          <Row className="AdminCardRow">
            {filteredProducts.map((product) => (
              <Col className="AdminCardCol" sm={3} key={product.id}>
                <Card className="cardAdmin">
                  <Link to={`/categories/${product.category}/${product._id}/details`}>
                    <Card.Img variant="top" src={product.image} />
                  </Link>
                  <Card.Body>
                    <Card.Title className="cardAdmin-title">{product.name}</Card.Title>
                    <Card.Text className="cardAdmin-text">{product.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      {product.addedAt} - {product.city}
                    </small>
                  </Card.Footer>
                  <button onClick={() => deleteProductHandler(product)} id="delete-product-btn" className="btn btn-primary">
                    제품 삭제하기
                  </button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    );
};

export default AdminProduct;