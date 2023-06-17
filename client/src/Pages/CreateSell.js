import React from 'react';
import { Component } from 'react';
import { Form, Button, Col, Spinner, Alert } from 'react-bootstrap';
import { createProduct } from '../services/productData';
import SimpleSider from '../components/Siders/SimpleSider';
import '../components/CreateSell/CreateSell.css';

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = { title: "", price: "", description: "", city: "", category: "", image: "", loading: false, alertShow: false, errors: [] };
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
        }
      };

    onSubmitHandler(e) {
        e.preventDefault();
        let { title, price, description, city, category, image } = this.state;
        let obj = { title, price, description, city, category }
        this.setState({ loading: true })
        this.getBase64(image)
            .then((data) => {
                obj['image'] = data;
                createProduct(obj)
                    .then(res => {
                        if (res.error) {
                            this.setState({ loading: false })
                            this.setState({ errors: res.error })
                            this.setState({ alertShow: true })
                        } else {
                            this.props.history.push(`/categories/${category}/${res.productId}/details`)
                        }
                    })
                    .catch(err => console.error('Creating product err: ', err))
            })
            .catch(err => console.error('Converting to base64 err: ', err));
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    render() {
        return (
            <>
                <SimpleSider />
                <div className='container'>
                    <h1 className="heading">Add a Product</h1>
                    <Form onSubmit={this.onSubmitHandler}>
                        {this.state.alertShow &&
                            <Alert variant="danger" onClose={() => this.setState({ alertShow: false })} dismissible>
                                <p>
                                    {this.state.errors}
                                </p>
                            </Alert>
                        }
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter title" name="title" required onChange={this.onChangeHandler} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" step="0.01" placeholder="Price" name="price" required onChange={this.onChangeHandler} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Group controlId="formGridDescription.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} name="description" required onChange={this.onChangeHandler} />
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control name="city" placeholder="Sofia" required onChange={this.onChangeHandler} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" defaultValue="Choose..." name="category" required onChange={this.onChangeHandler}>
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
                            </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridImage" >
                                <Form.Label>Image</Form.Label>
                                <Form.Control name="image" type="file" required onChange={this.onChangeHandler} />
                            </Form.Group>
                        </Form.Row>
                        {this.state.loading ?
                            <Button className="col-lg-12" variant="dark" disabled >
                                Please wait... <Spinner animation="border" />
                            </Button>
                            :
                            <Button className="col-lg-12" variant="dark" type="submit">Add product</Button>
                        }
                    </Form>
                    <br></br>
                </div>
            </>
        )
    }
}

export default AddProduct;