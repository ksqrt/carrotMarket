import React, { useRef } from 'react';
import { useState, useEffect,useContext } from 'react';
import { Col, Form, Button, Spinner, Alert, Row } from 'react-bootstrap';
import SimpleSider from '../components/Siders/SimpleSider';
import { getSpecific, editProduct } from '../services/productData';
import { Context } from '../ContextStore';
import '../components/Edit/Edit.css'
import Imagemodal from '../components/Display/Imagemodal';
import KakaoMapAPI from '../components/KakaoMapAPI/KakaoMapAPICreateSell';
import Display from '../components/Display/Display';

const Edit= ({ match, history }) => {
    const { userData } = useContext(Context);
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [error, setError] = useState(null);
    const productId = match.params.id;
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [city, setCity] = useState("");
    const [category, setCategory] = useState("clothing");
    const [image, setImage] = useState([]);
    const [imagemodal, setImagemodal] = useState(false);
    const [checkimgindex, setCheckimgindex] = useState('');
    const _id = product._id
    console.log(_id);
    console.log(product.image);
    console.log(image);
    console.log(product.city);

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
        window.scrollTo(0, 0);
        // getSpecific(productId)
        //     .then(res => setProduct(res))
        //     .catch(err => console.log(err));
 
        //     setTitle(product.title)
        //     setPrice(product.price)
        //     setDescription(product.description)
        //     setCity(product.city)
        //     setCategory(product.category)
        //     setImage([...product.image])
        const fetchData = async () => {
            try {
              const res = await getSpecific(productId);
              setProduct(res);
        
              setTitle(res.title);
              setPrice(res.price);
              setDescription(res.description);
              setCity(res.city);
              setCategory(res.category);
              setImage([...res.image]);
            } catch (err) {
              console.log(err);
            }
          };
        
          fetchData();

        }, [productId])
    

    // let { _id, title, price, description, city, category, image } = product;

    const onTitle= (e) => {
        setTitle(e.target.value);
    };
    const onPrice= (e) => {
        setPrice(e.target.value);
    };
    const onDescription= (e) => {
        setDescription(e.target.value);
    };
    const onCity= (e) => {
        setCity(e.target.value);
    };
    const kakaocity = (a) => {
        setCity(a);
    };
    
    const closeModal = () => {
        setImagemodal(false);
    }
    const fileInput = useRef(null);

    const onChangeHandler = (e) => {
      e.preventDefault();
      let value = e.target.value;
      if (value === "의류") {
        value = "clothing";
      } else if (value === "가전제품") {
        value = "electronics";
      } else if (value === "가구 및 인테리어") {
        value = "furnitureAndInterior";
      } else if (value === "자동차 및 오토바이") {
        value = "automotive";
      } else if (value === "스포츠 및 레저용품") {
        value = "sportsAndLeisure";
      } else if (value === "아동용품") {
        value = "kidsItems";
      } else if (value === "도서 및 문구용품") {
        value = "booksAndStationery";
      } else if (value === "신발") {
        value = "shoes";
      } else if (value === "악세서리 및 장신구") {
        value = "accessoriesAndJewelry";
      } else if (value === "뷰티 및 화장품") {
        value = "beautyAndCosmetics";
      }
  
      if (e.target.name === "category") {
        setCategory(value);
      }
  
      if (e.target.files) {
        e.preventDefault();
        let imagenew = e.target.files[0];
        getBase64(imagenew)
        .then((data) => {
          setImage([...image,data]);
        });
      }
    };


    const deleteimg = (index) => {
        image.splice(index,1);
        setImage([...image]);
    }
    const imgboxbtn = (index) => {
        setCheckimgindex(index);
        setImagemodal(true);   
    }








    // const onChangeHandler = (e) => {
    //     e.preventDefault();
    //     setProduct({ ...product, [e.target.name]: e.target.value });
    //     if (e.target.files) {
    //         setProduct({ ...product, image: e.target.files[0] })
    //     }
    // }

    const onSubmitHandler = (e) => {
        //TODO: Rewrite this 
        e.preventDefault();
        let obj = { title, price, description, city, category }
        setLoading(true);
        // if (typeof image == 'object') {
            // getBase64(image)
            //     .then((data) => {
        obj['image'] = image;
        editProduct(_id, obj,userId)
            .then(res => {
                if (!res.error) {
                    history.push(`/categories/${category}/${_id}/details`)
                } else {
                    setLoading(false);
                    setError(res.error);
                    setAlertShow(true);
                }
            })
        .catch(err => console.error('edit product err: ', err))
                // })
                // .catch(err => console.log('base64 error: ', err));
        // } else {
        //     editProduct(_id, obj)
        //         .then(res => {
        //             if (!res.error) {
        //                 history.push(`/categories/${category}/${_id}/details`)
        //             } else {
        //                 setLoading(false);
        //                 setError(res.error);
        //                 setAlertShow(true);
        //             }
        //         })
        //         .catch(err => console.error('edit product err: ', err))
        // }
    }

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          try{
            reader.readAsDataURL(file);
          } catch (err){
    
          }
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
    };
    
    const handlerButtonClick = (e) => {
        fileInput.current.click();
    };

    return (
        <div className="container">
        <Form onSubmit={onSubmitHandler}>
          {alertShow && (
            <Alert
              variant="danger"
              onClose={() => setAlertShow(false)}
              dismissible
            >
              <p>{error}</p>
            </Alert>
          )}
          <h2 className="mainfont">
            판매 정보 &nbsp;
            <a className="mainsubfont">*필수항목</a>
          </h2>
          <hr />
          {/* 이미지 추가 */}
          <Row className="rowinterval">
            <Col md="2">
              <Form.Label>
                상품 이미지
                <span className="redfont">*</span>
              </Form.Label>
            </Col>
            <Col>
            <div className="displaygrid">
              <button className="imgbtn" onClick={handlerButtonClick}>
                <img
                  src={
                    "https://kr.object.ncloudstorage.com/ncp3/ncp3/Group%206%20%281%29.png"
                  }
                />
              </button>
                
              <Display image={image} imgboxbtn={imgboxbtn} deleteimg={deleteimg} />

            </div>    

              <Form.Control
                name="image"
                ref={fileInput}
                type="file"
                className="imginput"
                multiple
                onChange={onChangeHandler}
                />
            </Col>
          </Row>
          <Row>
            <Col md="2">
            </Col>
            <Col>
              <div className="imgfont">
                <a
                  style={{
                    fontWeight: "700",
                  }}
                >
                  * 상품 이미지는 700x500에 최적화 되어 있습니다.
                </a>
                <br />- 상품 이미지는 PC에서는 1:1, 모바일에서는 1:1.23 비율로
                보여집니다.
                <br />- 이미지를 클릭할 경우 원본 이미지를 확인할 수 있습니다.
                <br />- 먼저 등록한 이미지가 대표 이미지가 됩니다.
                <br />- 큰 이미지일 경우 이미지가 깨지는 경우가 발생할 수
                있습니다.
                <br />
                최대 지원 사이즈인 700 X 500으로 리사이즈 해서 올려주세요.
                (이미지 최대 10M)
              </div>
            </Col>
          </Row>
          <hr />
          <Row className="rowinterval">
            <Col md="2">
              <Form.Label>
                제목
                <span className="redfont">*</span>
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                className="titleinput"
                type="text"
                placeholder="제목을 입력해주세요"
                name="title"
                required
                value={title}
                onChange={onTitle}
              />
            </Col>
          </Row>
          <hr />
          <Row >
            <Col md="2">
              <Form.Label>
                가격(₩)
                <span className="redfont">*</span>
              </Form.Label>
            </Col>
            <Col md="4">
              <Form.Control
                className="priceinput"
                type="number"
                step="1000"
                placeholder="가격을 입력해주세요"
                name="price"
                required
                value={price}
                onChange={onPrice}
              />
            </Col>
            <Col md="2">
              <Form.Label>
                상품 분류
                <span className="redfont">*</span>
              </Form.Label>
            </Col>
            <Col md="4">
              <Form.Control
                className="cateselect"
                as="select"
                name="category"
                required
                value={category}
                onChange={onChangeHandler}
              >
                <option selected value="clothing">
                  의류
                </option>
                <option value="electronics">가전제품</option>
                <option value="furnitureAndInterior">가구 및 인테리어</option>
                <option value="automotive">자동차 및 오토바이</option>
                <option value="sportsAndLeisure">스포츠 및 레저용품</option>
                <option value="kidsItems">아동용품</option>
                <option value="booksAndStationery">도서 및 문구용품</option>
                <option value="shoes">신발</option>
                <option value="accessoriesAndJewelry">
                  악세서리 및 장신구
                </option>
                <option value="beautyAndCosmetics">뷰티 및 화장품</option>
              </Form.Control>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md="2">
              <Form.Label>
                거래 장소
                <span className="redfont">*</span>
              </Form.Label>
            </Col>
            <Col md="4">
              <Form.Control
                className="cityinput"
                name="city"
                placeholder="서울"
                required
                value={city}
                onChange={onCity}
              />
            </Col>
            <Col>
              <KakaoMapAPI kakaocity={kakaocity}/>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md="2">
              상품 설명
              <span className="redfont">*</span>
            </Col>
            <Col>
              <Form.Control
                style={{
                  width: "100%",
                  height: "200px",
                  resize: "none",
                }}
                as="textarea"
                rows={3}
                name="description"
                required
                value={description}
                onChange={onDescription}
              />
            </Col>
          </Row>
          {loading ? (
            <Button className="col-lg-12" variant="dark" disabled>
              상품 등록중입니다 ... <Spinner animation="border" />
            </Button>
          ) : (
            <Button className="col-lg-12" variant="dark" type="submit">
              수정하기
            </Button>
          )}
        </Form>
        <br></br>
        {/* 모달 */}
        {imagemodal && (
          <Imagemodal image={image} closeModal={closeModal} checkimgindex={checkimgindex}/>
        )}
      </div>
    );
        // <>
        //     <div className='container'>
        //         <h1 className="heading">Edit product</h1>
        //         <Form onSubmit={onSubmitHandler}>
        //             {alertShow &&
        //                 <Alert variant="danger" onClose={() => setAlertShow(false)} dismissible>
        //                     <p>
        //                         {error}
        //                     </p>
        //                 </Alert>
        //             }
        //             <Form.Row>
        //                 <Form.Group as={Col} controlId="formGridTitle">
        //                     <Form.Label>Title</Form.Label>
        //                     <Form.Control type="text" placeholder="Enter title" name="title" value={product.title} onChange={onChangeHandler} required />
        //                 </Form.Group>

        //                 <Form.Group as={Col} controlId="formGridPrice">
        //                     <Form.Label>Price</Form.Label>
        //                     <Form.Control type="number" step="0.01" placeholder="Price" name="price" value={product.price} onChange={onChangeHandler} required />
        //                 </Form.Group>
        //             </Form.Row>

        //             <Form.Group controlId="formGridDescription.ControlTextarea1">
        //                 <Form.Label>Description</Form.Label>
        //                 <Form.Control as="textarea" rows={3} name="description" defaultValue={product.description} onChange={onChangeHandler} required />
        //             </Form.Group>

        //             <Form.Row>
        //                 <Form.Group as={Col} controlId="formGridCity">
        //                     <Form.Label>City</Form.Label>
        //                     <Form.Control name="city" placeholder="Sofia" value={product.city} onChange={onChangeHandler} required />
        //                 </Form.Group>

        //                 <Form.Group as={Col} controlId="formGridCategory">
        //                     <Form.Label>Category</Form.Label>
        //                     <Form.Control as="select" value={product.category} name="category" onChange={onChangeHandler} required >
        //                         <option>Choose...</option>
        //                         <option>properties</option>
        //                         <option>auto</option>
        //                         <option>electronics</option>
        //                         <option>clothes</option>
        //                         <option>toys</option>
        //                         <option>home</option>
        //                         <option>garden</option>
        //                     </Form.Control>
        //                 </Form.Group>

        //                 <Form.Group as={Col} controlId="formGridImage" >
        //                     <Form.Label>Image</Form.Label>
        //                     <Form.Control name="image" type="file" onChange={onChangeHandler} />
        //                 </Form.Group>
        //             </Form.Row>
        //             {loading ?
        //                 <Button className="col-lg-12" variant="dark" disabled >
        //                     Please wait... <Spinner animation="border" />
        //                 </Button>
        //                 :
        //                 <Button className="col-lg-12" variant="dark" type="submit">Add product</Button>
        //             }
        //         </Form>
        //     </div>
        // </>
    
};

export default Edit;