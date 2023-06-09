import React, { useState, useEffect, useContext } from 'react';
import { Col, Row, Button, Form, Modal } from 'react-bootstrap';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaSellsy } from 'react-icons/fa';
import { RiMessage3Fill } from 'react-icons/ri';
import { FaShoppingCart } from 'react-icons/fa';
import { getUserById } from '../../services/userData';
import MannerModal from './MannerModal';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { Context } from '../../ContextStore';

function SellerProfile({ params, history }) {
    const { id } = useParams();
    const { userData } = useContext(Context);
    const isCurrentUserSeller = userData && id === userData._id;

    const [showMsg, setShowMdg] = useState(false);
    const [message, setMessage] = useState("");

    const [showCpt, setShowCpt] = useState(false);
    const [cptIn, setcptIn] = useState("");

    const [mannerTemperature, setMannerTemperature] = useState(null);

    const fetchUserData = async () => {
        try {
            const user = await getUserById(params._id); // 사용자 정보를 가져오는 API 호출 (예시)
            const mannerTemp = parseFloat(user.mannertmp);
            setMannerTemperature(mannerTemp);
            console.log(params.mannertmp, '매너온도');
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData(params._id); // 사용자 정보를 가져오는 함수 호출
    }, [params._id]);

    const handleClose = () => setShowMdg(false);
    const handleShow = () => setShowMdg(true);

    const handlecloseCpt = () => setShowCpt(false);
    const handleshowCpt = () => setShowCpt(true);

    const handleMsgChange = (e) => {
        e.preventDefault();
        setMessage(e.target.value);
    };

    const getMannerTemperatureStyle = (temperature) => {
        const width = temperature + "%";
        return {
            width: width,
            backgroundColor: getBackgroundColor(temperature)
        };
    };

    const getBackgroundColor = (temperature) => {
        if (temperature >= 0 && temperature < 21) {
            return "black";
        } else if (temperature >= 21 && temperature < 36.5) {
            return "darkblue";
        } else if (temperature >= 36.5 && temperature < 40) {
            return "royalblue";
        } else if (temperature >= 40 && temperature < 50) {
            return "green";
        } else if (temperature >= 50 && temperature < 60) {
            return "#f9bc28";
        } else {
            return "#ff6f31";
        }
    };

    const getMannerTemperatureImage = (temperature) => {
        if (temperature >= 0 && temperature < 21) {
            return "https://kr.object.ncloudstorage.com/ncp3/ncp3/2.png";
        } else if (temperature >= 21 && temperature < 36.5) {
            return "https://kr.object.ncloudstorage.com/ncp3/ncp3/3.png";
        } else if (temperature >= 36.5 && temperature < 40) {
            return "https://kr.object.ncloudstorage.com/ncp3/ncp3/4.png";
        } else if (temperature >= 40 && temperature < 50) {
            return "https://kr.object.ncloudstorage.com/ncp3/ncp3/5.png";
        } else if (temperature >= 50 && temperature < 60) {
            return "https://kr.object.ncloudstorage.com/ncp3/ncp3/5.png";
        } else {
            return "https://kr.object.ncloudstorage.com/ncp3/ncp3/5.png";
        }
    };

    const getFontColor = (temperature) => {
        if (temperature >= 0 && temperature < 21) {
            return "black";
        } else if (temperature >= 21 && temperature < 36.5) {
            return "darkblue";
        } else if (temperature >= 36.5 && temperature < 40) {
            return "royalblue";
        } else if (temperature >= 40 && temperature < 50) {
            return "green";
        } else if (temperature >= 50 && temperature < 60) {
            return "#f9bc28";
        } else {
            return "#ff6f31";
        }
    };

    return (
        <>
            <div id="profile-head">
                <div className="container">
                    <Row className="profile-row">
                        <Col id="profile_avatar" lg={2} md={5} sm={12}>
                            <img id="avatar" alt="avatar" src={params.avatar} />
                        </Col>
                        <Col id="profile_information1" lg={3} md={3} sm={12}>
                            <div id="profile_information2">
                                <div id="profile_name">
                                    <p>
                                        <span style={{ fontWeight: "bold" }}><BsFillPersonFill /> {params.name}</span>
                                    </p>
                                </div>
                                <div id="profile_button">
                                { userData && (
                                    <span id="edit-icon">
                                        <button className="manner-button" onClick={handleshowCpt}>
                                        매너 칭찬하기
                                        </button>
                                        {showCpt && <MannerModal onClose={handlecloseCpt} id={id} />}
                                    </span>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col id="profile_information3" lg={3} md={3} sm={12}>
                            <div className='sellcount'>
                                <FaShoppingCart className="section-icon" />
                                <p className="section-title">판매상품 <span className="item-count">{params.totalSells}</span>개</p>
                            </div>
                            <div id="tem_total">
                                <p id="tem_total_txt">매너온도</p>
                                <div className='meters'>
                                    <p id="tem_total_cnt" style={{ marginBottom: "-1px", float: "right", color: getFontColor(params.mannertmp) }}>
                                        { params.mannertmp }°C&nbsp;&nbsp;
                                    <img
                                        src={getMannerTemperatureImage(params.mannertmp)}
                                        alt="이미지 사진"
                                        style={{ width: '25px', height: '25px' }}
                                    />
                                    </p>
                                </div>
                                <div className="manner-thermometer" style={{ width: "100%" }}>
                                    <div className="manner-thermometer-fill" style={getMannerTemperatureStyle(params.mannertmp)}></div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            <div className="container">
            {/* <Row>
                <Col lg={12}>
                    <ActiveSells params={params} />
                </Col>
                </Row> */}
            </div>

            <Modal show={showMsg} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control as="textarea" name="textarea" onChange={handleMsgChange} rows={3} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SellerProfile;