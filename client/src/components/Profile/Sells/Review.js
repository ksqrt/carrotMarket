import React, { useState } from 'react';
import { Component } from 'react';
import { Form, Button, Col, Spinner, Alert } from 'react-bootstrap';
import '../../CreateSell/CreateSell.css';
import SimpleSider from '../../Siders/SimpleSider';
import {createReview} from '../../../services/ReviewData';

class Review extends Component {
//     const [conversation, setConversation] = useState([]);
//     let [loading, setLoading] = useState(true);
//     const history = useHistory();

    constructor(props) {
        super(props);
        const [state,setState] = useState('');
        
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }


    onChangeHandler(e) {
        e.preventDefault();

        let value = e.target.value;
        
        setState({ [e.target.name]: value });
      
      };

    onSubmitHandler(e) {
        e.preventDefault();
        let  content  = this.state;
        let obj = { content }
        console.log('이거모냐'+this.state);
          setState({ loading: true })
        createReview(content)
        .then(res => {
            if (res.error) {
                setState({ loading: false })
                setState({ errors: res.error })
                setState({ alertShow: true })
            } else {
                this.props.history.push('/')
            }
        })
        .catch(err => console.error('Creating Review err: ', err))

    }

    render() {
        return (
            <>
                <SimpleSider />
                <div className='container'>
                    <h1 className="heading">구매후기추가</h1>

                    <Form onSubmit={this.onSubmitHandler}>
                        
                        {this.state.alertShow &&
                            <Alert variant="danger" onClose={() => this.setState({ alertShow: false })} dismissible>
                                <p>
                                    {this.state.errors}
                                </p>
                            </Alert>
                        }

                        <Form.Row>
                            <Form.Group as={Col} controlId="content">
                                <Form.Label>Content</Form.Label>
                                <Form.Control type="text" placeholder="Enter content" name="content" required onChange={this.onChangeHandler}/>
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


export default Review;