import React from "react";
import { Component } from "react";
import { Form, Button, Col, Spinner, Alert, Row } from "react-bootstrap";
import { createProduct } from "../services/productData";
import SimpleSider from "../components/Siders/SimpleSider";
import "../components/CreateSell/CreateSell.css";
import "../components/CreateSell/addproduct.css";
import {KakaoMapAPI} from "../components/KakaoMapAPI/KakaoMapAPI";
class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      price: "",
      description: "",
      city: "",
      category: "clothing",
      image: "",
      previewURL: "",
      loading: false,
      alertShow: false,
      errors: [],
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  onChangeHandler(e) {
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

    this.setState({ [e.target.name]: value });

    if (e.target.files) {
      this.setState({ image: e.target.files[0] });

      e.preventDefault();
      let reader = new FileReader();
      let image = e.target.files[0];
      reader.onloadend = () => {
        this.setState({
          image: image,
          previewURL: reader.result,
        });
      };
      reader.readAsDataURL(image);
    }

    if (e.target.name == "category") {
      console.log(e.target.name);
      console.log(value);
    }
  }

  onSubmitHandler(e) {
    e.preventDefault();
    let { title, price, description, city, category, image } = this.state;
    let obj = { title, price, description, city, category };
    this.setState({ loading: true });
    this.getBase64(image)
      .then((data) => {
        obj["image"] = data;
        createProduct(obj)
          .then((res) => {
            if (res.error) {
              this.setState({ loading: false });
              this.setState({ errors: res.error });
              this.setState({ alertShow: true });
            } else {
              this.props.history.push(
                `/categories/${category}/${res.productId}/details`
              );
            }
          })
          .catch((err) => console.error("Creating product err: ", err));
      })
      .catch((err) => console.error("Converting to base64 err: ", err));
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  fileInput = React.createRef();

  handlerButtonClick = (e) => {
    this.fileInput.current.click();
  };

  render() {
    let profile_preview = null;
    if (this.state.image !== "") {
      profile_preview = (
        <img className="imge" src={this.state.previewURL}></img>
      );
    }
    return (
      <>
        <div className="container">
          <h1 className="heading">Add a Product</h1>
          <Form onSubmit={this.onSubmitHandler}>
            {this.state.alertShow && (
              <Alert
                variant="danger"
                onClose={() => this.setState({ alertShow: false })}
                dismissible
              >
                <p>{this.state.errors}</p>
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
                <button className="imgbtn" onClick={this.handlerButtonClick}>
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
                  {profile_preview}
                </button>
                <Form.Control
                  name="image"
                  ref={this.fileInput}
                  type="file"
                  className="imginput"
                  required
                  multiple
                  onChange={this.onChangeHandler}
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
              <Col className="itemscenter" md="2">
                <Form.Label>
                  제목
                  <span className="redfont">*</span>
                </Form.Label>
              </Col>
              <Col>
                <Form.Control
                  className="titleinput,itemscenter"
                  type="text"
                  placeholder="제목을 입력해주세요"
                  name="title"
                  required
                  onChange={this.onChangeHandler}
                />
              </Col>
            </Row>
            <hr />
            <Row>
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
                  onChange={this.onChangeHandler}
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
                  onChange={this.onChangeHandler}
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
                  onChange={this.onChangeHandler}
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
                  onChange={this.onChangeHandler}
                />
              </Col>
            </Row>

            {/* <Form.Row>
                            <Form.Group as={Col} controlId="formGridTitle"> 
            <Form.Label>제목</Form.Label>
            <Form.Control
              style={{
                width: "100%",
              }}
              type="text"
              placeholder="제목을 입력해주세요"
              name="title"
              required
              onChange={this.onChangeHandler}
            />
            </Form.Group> 
            
                            <Form.Group as={Col} controlId="formGridPrice">
            <Form.Label>가격 (₩)</Form.Label>
            <Form.Control
              style={{
                width: "auto",
              }}
              type="number"
              step="1000"
              placeholder="가격을 입력해주세요"
              name="price"
              required
              onChange={this.onChangeHandler}
            />
            </Form.Group>
                        </Form.Row> 

            <Form.Group controlId="formGridDescription.ControlTextarea1"> 
            <Form.Control
              style={{
                width: "100%ㅋ",
              }}
              as="textarea"
              rows={3}
              name="description"
              required
              onChange={this.onChangeHandler}
            />
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>거래 장소</Form.Label>
            <Form.Control
              name="city"
              placeholder="Sofia"
              required
              onChange={this.onChangeHandler}
            />
            </Form.Group>

              <Form.Group as={Col} controlId="formGridCategory">
            <Form.Label>상품 분류</Form.Label>
            <Form.Control
              as="select"
              defaultValue="Choose..."
              name="category"
              required
              onChange={this.onChangeHandler}
            >
              <option>선택해주세요...</option>
              <option>의류</option>
              <option>가전제품</option>
              <option>가구 및 인테리어</option>
              <option>자동차 및 오토바이</option>
              <option>스포츠 및 레저용품</option>
              <option>아동용품</option>
              <option>도서 및 문구용품</option>
              <option>신발</option>
              <option>악세서리 및 장신구</option>
              <option>뷰티 및 화장품</option>
            </Form.Control> */}
            {/* </Form.Group>

              <Form.Group as={Col} controlId="formGridImage"> */}
            {/* </Form.Group>
            </Form.Row> */}
            {this.state.loading ? (
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
      </>
    );
  }
}

export default AddProduct;
