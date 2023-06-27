import React, { useState, useRef, useEffect } from "react";
import { createProduct } from "../services/productData";
import { Form, Button, Col, Spinner, Alert, Row } from "react-bootstrap";
import "../components/CreateSell/CreateSell.css";
import "../components/CreateSell/addproduct.css";
import Display from "../components/Display/Display";
import { KakaoMapAPI } from "../components/KakaoMapAPI/KakaoMapAPI";

const AddProduct = ({ history }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("clothing");
  const [image, setImage] = useState([]);
  const [previewURL, setPreviewURL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [errors, setErrors] = useState([]);

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

  const fileInput = useRef(null);
  let tmp = 0;
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
      console.log(e.target.name);
      console.log(value);
    }

    if (e.target.files) {
      e.preventDefault();
      let imagenew = e.target.files[0];
      // reader.onloadend = () => {
      //   setImage(imagenew, ...image);
      //   setPreviewURL(reader.result, ...previewURL);

      // };
      // reader.readAsDataURL(imagenew);
      getBase64(imagenew)
      .then((data) => {
        setImage([...image,data]);
      });
        tmp = tmp + 1;
      console.log('pre'+previewURL);
      console.log('image'+image);
    }
  };
  // useEffect(()=>{
  //   for (let index = 0; index < image.length; index++) {

  //   }

  // },[image]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let obj = { title, price, description, city, category };
    setLoading(true);
    // getBase64(image)
      // .then((data) => {
        obj["image"] = image;
        createProduct(obj)
          .then((res) => {
            if (res.error) {
              setLoading(false);
              setErrors(res.error);
              setAlertShow(true);
            } else {
              history.push(`/categories/${category}/${res.productId}/details`);
            }
          })
          .catch((err) => console.error("Creating product err: ", err));
      // }
      // )
      // .catch((err) => console.error("Converting to base64 err: ", err));
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
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
                <p>{errors}</p>
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
                <button className="imgbtn" onClick={handlerButtonClick}>
                  <img
                    src={
                      "https://kr.object.ncloudstorage.com/ncp3/ncp3/Group%206%20%281%29.png"
                    }
                  />
                </button>
                <button
                  style={{
                    border: "none",
                    backgroundColor: "white",
                  }}
                >
                </button>
                  
                  <Display image={image}/>


                <Form.Control
                  name="image"
                  ref={fileInput}
                  type="file"
                  className="imginput"
                  required
                  multiple
                  onChange={onChangeHandler}
                  />
              </Col>
            </Row>
            <Row>
              <Col md="2"></Col>
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
                  <br />- 이미지를 클릭 후 이동하여 등록순서를 변경할 수
                  있습니다.
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
                  onChange={onCity}
                />
              </Col>
              <Col>
                <KakaoMapAPI />
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
                상품 등록
              </Button>
            )}
          </Form>
          <br></br>
        </div>
  );
};

export default AddProduct;
