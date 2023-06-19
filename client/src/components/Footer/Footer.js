import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer = () => {
  return (
    <footer  className="bg-dark py-4" style={{ height: '250px', maxHeight: '250px' }}>
      <Container>
        <Row className="pb-14 border-bottom border-gray-500">
          <Col>
            <img src="https://kr.object.ncloudstorage.com/ncp3/ncp3/logo_white.webp" alt="Logo" />
          </Col>
          <Col className="pt-2 space-y-3">
            <ul className="list-unstyled m-0">
              <li>
                <a href="https://www.daangn.com/trust" target="_blank" rel="noreferrer" className="text-white font-medium">
                  믿을 수 있는 중고거래
                </a>
              </li>
              <li>
                <a href="https://cs.kr.karrotmarket.com/wv/faqs" target="_blank" rel="noreferrer" className="text-white font-medium">
                  자주 묻는 질문
                </a>
              </li>
            </ul>
          </Col>
          <Col className="pt-2 space-y-3">
            <ul className="list-unstyled m-0">
              <li>
                <a href="https://ads-local.daangn.com" target="_blank" rel="noreferrer" className="text-white font-medium">
                  광고주센터
                </a>
              </li>
              <li>
                <a href="https://www.daangnpay.com" target="_blank" rel="noreferrer" className="text-secondary">
                  당근페이
                </a>
              </li>
              <li>
                <a href="https://town.daangn.com" target="_blank" rel="noreferrer" className="text-secondary">
                  동네가게
                </a>
              </li>
            </ul>
          </Col>
          <Col className="pt-2 space-y-3">
            <ul className="list-unstyled m-0">
              <li>
                <a href="https://team.daangn.com" target="_blank" rel="noreferrer" className="text-secondary">
                  회사 소개
                </a>
              </li>
              <li>
                <a href="https://team.daangn.com/jobs" target="_blank" rel="noreferrer" className="text-secondary">
                  채용
                </a>
              </li>
            </ul>
          </Col>
          <Col className="pt-2 space-y-3">
            <ul className="list-unstyled m-0">
              <li>
                <a href="https://www.daangn.com/policy/terms" target="_blank" rel="noreferrer" className="text-secondary">
                  이용약관
                </a>
              </li>
              <li>
                <a href="https://www.daangn.com/policy/privacy" target="_blank" rel="noreferrer" className="text-secondary">
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a href="https://www.daangn.com/policy/location" target="_blank" rel="noreferrer" className="text-secondary">
                  위치기반 서비스
                </a>
              </li>
            </ul>
            <br></br>
          </Col>
        </Row>
        {/* <Row className="mt-6">
          <Col className="text-secondary text-3xl">
            <a href="https://www.facebook.com/daangn" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faFacebookSquare} />
            </a>
          </Col>
          <Col className="text-secondary text-3xl">
            <a href="https://www.instagram.com/daangnmarket" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </Col>
          <Col className="text-secondary text-3xl">
            <a href="https://blog.naver.com/daangn" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faBlogger} />
            </a>
          </Col>
        </Row> */}
        <Row>
          <Col>
            <br></br>
            <h5 className="mt-6 text-secondary text-xs">© {new Date().getFullYear()} GW. ALL RIGHTS RESERVED.</h5>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
