import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const KakaoMapAPI = () => {
	const { kakao } = window;
	const [location, setLoacation] = useState({latitude: null, longitude: null}); // 현재 위치
	const [address, setAddress] = useState({latitude: null, longitude: null}); // 현재 좌표의 주소를 저장할 상태
	const [position, setPosition] = useState(null) // 마커 이동시 좌표 저장
	const [isOpen, setIsOpen] = useState(false)
	const [addressConfirmed, setAddressConfirmed] = useState(false)


	//현재 위치를 불러옴(geolocation)
	useEffect(() => {
		navigator.geolocation.getCurrentPosition(successHandler, errorHandler); // 성공시 successHandler, 실패시 errorHandler 함수가 실행된다.
	}, []);

	const successHandler = (response) => {
		console.log(response); // coords: GeolocationCoordinates {latitude: 위도, longitude: 경도, …} timestamp: 1673446873903
		const { latitude, longitude } = response.coords;
		setLoacation({ latitude, longitude });
	};

	const errorHandler = (error) => {
		console.log(error);
	};

	//현재위치의 위도,경도값을 기반으로 주소값으로 변경
	const getAddress = (lat, lng) => {
		const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
		const coord = new kakao.maps.LatLng(position.lat, position.lng); // 주소로 변환할 좌표 입력
		const callback = function (result, status) {
			if (status === kakao.maps.services.Status.OK) {
				console.log(result[0].address)
				setAddress(result[0].address);
				console.log(position)
				setAddressConfirmed(true);
			}
		};
		geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
		console.log(address)
	};

	return (
		<>
			<Map center={{ lat: location.latitude, lng: location.longitude }} 
				 style={{ position: "fixed",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "500px",
						height: "500px",
						backgroundColor: "white",
						borderRadius: "10px",
						padding: "20px",
						boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
						}}
				 level={4}
				 onClick={(_t, mouseEvent) => {
					setPosition({
					  lat: mouseEvent.latLng.getLat(),
					  lng: mouseEvent.latLng.getLng(),
					});
					setIsOpen(false);
				  }}
			>
				{position && <MapMarker position={position} 
				//clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
				onClick={() => {setIsOpen(true); getAddress();}}
				>
				{isOpen && (
				<div style={{ minWidth: "180px" }}>
					<div style={{ padding: "5px", 
								  color: "#000",
								  
								  }}>
					{address && (
						<div style={{ fontSize: "15px", 
									  fontWeight: "bold",
									  }}>
							{address.address_name}
						</div>
					)}
					</div>
					<div>
					<button disabled={!addressConfirmed} style={{fontSize: "15px",
																	}}>현재위치 공유하기</button>
					</div>
				</div>
				)}
				</MapMarker>}
			</Map>
		</>
	);
};

export default KakaoMapAPI;
