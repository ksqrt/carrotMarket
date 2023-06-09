import React from 'react';

const LoginModal = ({ handleCloseModal }) => {
    return (
        <div className="sc-lkqHmb jHoRJZ">
            <button className="sc-emmjRN jzYHCc" onClick={handleCloseModal}>
                <img src="/pc-static/resource/ee442d3dd827628bc5fe.png" width="24" height="24" alt="로그인 모달 닫기 버튼 아이콘"/>
            </button>
            <div className="sc-fYiAbW jvfUAr">
                <img src="/pc-static/resource/56db3dd43075482b1d31.png" width="30" height="34" className="sc-eLExRp heUPiF"/>
                <div className="sc-cbkKFq dgtOdA">당근마켓으로 중고거래 시작하기</div>
                <div className="sc-krvtoX isOQjp">간편하게 가입하고 상품을 확인하세요</div>
                <div className="sc-fOKMvo icXGke">
                    {/*  */}
                    <a id='kakao' href="/auth/kakao" className="sc-gHboQg bSxxhX">
                        <div className="sc-dUjcNx cRZkQG"></div>
                        카카오로 이용하기
                    </a>                 
                </div>
            </div>
        </div>
    )
}

export default LoginModal;
