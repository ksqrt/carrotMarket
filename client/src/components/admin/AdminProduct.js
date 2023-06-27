// import React from 'react';
// import { Card, Col, Row } from 'react-bootstrap';
// import './AdminProduct.css';
// import {deleteProduct} from './../../services/adminData';
// import { Link,useHistory } from 'react-router-dom';
// import { getSpecific } from '../../services/productData';
// import Details from '../../Pages/Details';

// const AdminProduct = (props) => {

//     const adminProducts = props.params;
//     console.log(adminProducts);


//     const filteredProducts = adminProducts.filter(product => product.declare === true);
//     console.log('true인것만 출력',filteredProducts);

   
//     const deleteProductHandler = (product) =>{
//       console.log('찍히냐');
//       console.log(product._id);

//        deleteProduct(product._id);
//        window.location.reload();

//     }
//     const history = useHistory();

//     const getSpecificHandler = async (product) =>{
//       try{
//        const info = await getSpecific(product);
      
//        history.push(`/categories/${info.category}/${info._id}/details`);
//       }
//       catch(error){
//         console.log(error);
//       }
      
  
//     }

//     return (
//       <div>
//       <div id="card-wrap">
//         <Row>
//           {filteredProducts.map(product => (
//             <Col sm={3} key={product.id}>
//               <Card className='card'>
//               <Link onClick={() => getSpecificHandler(product._id)}>
//                 <Card.Img variant="top" src={product.image} />
//               </Link>
//                 <Card.Body>
//                   <Card.Title className='card-title'>{product.name}</Card.Title>
//                   <Card.Text className='card-text'>{product.description}</Card.Text>
//                 </Card.Body>
//                 <Card.Footer>
//                   <small className='text-muted'>
//                     {product.addedAt} - {product.city}
//                     {/* <span id="enableIcon" onClick={handleShow}><RiDeviceRecoverFill /></span> */}
//                   </small>
//                 </Card.Footer>
//                 {/* 추가적인 정보나 요소들을 출력할 수 있습니다 */}
//                 <button onClick={() => deleteProductHandler(product)} id="delete-product-btn" className="btn btn-primary">제품 삭제하기</button>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </div>
//     </div>
//     );
// };

// export default AdminProduct;