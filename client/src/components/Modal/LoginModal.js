import React from 'react';
import './Modal.css';

const LoginModal = ({onClose}) => {
    return (
        <>
            <div className='modal-bg'></div>
            <div className='modal-popup'>
                <button className="modal-close" onClick={onClose}>
                    <img src="https://m.bunjang.co.kr/pc-static/resource/ee442d3dd827628bc5fe.png" width="24" height="24" alt="닫기"/>
                </button>
                <div className="modal-div">
                    <img src="로고 이미지" width="30" height="34" className="sc-eLExRp heUPiF" alt='웹 로고'/>
                    <div className="modal-title">당근마켓으로 중고거래 시작하기</div>
                    <div className="modal-subtitle">간편하게 가입하고 상품을 확인하세요</div>
                    <div className="modal-paths">                  
                        <a id='kakao' href="/auth/kakao" className="sc-gHboQg bSxxhX">
                            <div className='modal-path'>
                                <img src='https://m.bunjang.co.kr/pc-static/resource/7bf83f72cf54461af573.png' width="30" alt="카카오"/>
                                카카오로 이용하기
                            </div>
                        </a>                                     
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginModal;