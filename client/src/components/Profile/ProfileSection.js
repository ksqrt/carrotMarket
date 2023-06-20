import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdEmail, MdPhoneAndroid } from 'react-icons/md'
import { FaSellsy } from 'react-icons/fa'
import { GrEdit } from 'react-icons/gr';
import aImage from './profile_images/a.png'; // 이미지 파일 경로
import bImage from './profile_images/b.png'; // 이미지 파일 경로
import cImage from './profile_images/c.png'; // 이미지 파일 경로
import dImage from './profile_images/d.png'; // 이미지 파일 경로
import eImage from './profile_images/e.png'; // 이미지 파일 경로

const getMannerTemperatureStyle = (temperature) => {
    const width = temperature + "%";
    return {
      width: width,
      backgroundColor: getBackgroundColor(temperature)
    };
  };

  const getBackgroundColor = (temperature) => {
    // 여기에서 매너온도에 따른 배경색을 결정하는 로직을 작성하면 됩니다.
    // 예시로 몇 가지 범위에 따른 배경색을 지정합니다.
    if (temperature >= 0 && temperature < 21) {
      return "black";
    } else if (temperature >= 21 && temperature < 36.5) {
      return "darkblue";
    } else if (temperature >= 36.5 && temperature < 40) {
        return "royalblue";
    }else if (temperature >= 40 && temperature < 50) {
      return "green";
    }else if (temperature >= 50 && temperature < 60) {
        return "#f9bc28";
    }else {
      return "#ff6f31";
    }
  };

  const getMannerTemperatureImage = (temperature) => {
    if (temperature >= 0 && temperature < 21) {
      return aImage;
    } else if (temperature >= 21 && temperature < 36.5) {
      return bImage;
    } else if (temperature >= 36.5 && temperature < 40) {
      return cImage;
    } else if (temperature >= 40 && temperature < 50) {
      return dImage;
    } else if (temperature >= 50 && temperature < 60) {
      return eImage;
    } else {
      return null;
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



function ProfileSection({ params }) {
    return (
        <div id="profile-head">
            <div className="container">
                <Row className="profile-row">
                    <Col id="profile_avatar" lg={2} md={5} sm={12}>
                        <img id="avatar" alt="avatar" src={params.avatar} />
                    </Col>
                    <Col id="profile_information" lg={3} md={3} sm={12}>
                        <div id="profile_information2">
                            <div id="profile_name">
                            <p>
                                <span style={{ fontWeight: 'bold' }}><BsFillPersonFill /> {params.name}</span>
                            </p>
                                <span id="edit-icon">
                                    <Link to={`/profile/${params._id}/edit`}>
                                        <button className="profile-edit-button">프로필 수정</button>
                                    </Link>
                                </span>
                            </div>
                        <div id="tem_total">
                            <p style={{ float: 'left', fontWeight: 'bold', textDecoration: 'underline' }}>매너온도</p>
                            <p style={{ marginBottom: '-1px', float: 'right', color: getFontColor(36.5) }}>{36.5}%
                                <img
                                    src={getMannerTemperatureImage(36.5)}
                                    alt="이미지 사진"
                                    style={{ width: '50px', height: '50px' }}
                                />
                            </p>
                            <div className="manner-thermometer" style={{ marginBottom: '10px' }}>
                                <div className="manner-thermometer-fill" style={getMannerTemperatureStyle(36.5)}></div>
                            </div>
                        </div>
                        <br></br>
                        {/* <p><MdEmail /> {params.email} asdasd</p>
                        <p><MdPhoneAndroid /> {params.phoneNumber}</p>
                        <p><FaSellsy /> {params.totalSells} sells in total</p> */}
                        </div>
                    </Col>
                
                </Row>
            </div>
        </div>
    )
}

export default ProfileSection;