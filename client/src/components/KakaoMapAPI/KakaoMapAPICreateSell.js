import React, { useState, useEffect } from 'react';
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk';

const KakaoMapAPI = ({kakaocity}) => {
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

	//현재 위치 공유
	const locationshare = () => {
		console.log('클릭!')
		const location = address.address_name;
		console.log(address.address_name); 
		kakaocity(address.address_name);
	}

	return (
		<>	
			<Map center={{ lat: location.latitude, lng: location.longitude }} 	
				 level={4}
				 style={{
				 width: "auto",
				 height: "400px",
				 backgroundColor: "white",
				 borderRadius: "10px",
				 padding: "20px",}}
				 onClick={(_t, mouseEvent) => {
					setPosition({
					  lat: mouseEvent.latLng.getLat(),
					  lng: mouseEvent.latLng.getLng(),
					});
					locationshare()
					setIsOpen(false);
				  }}
			>

				{position && <MapMarker position={position} 
				onClick={() => {setIsOpen(true); getAddress();}}
				/>}
				{isOpen && (
				<CustomOverlayMap position={position} yAnchor={1.3}>
				 <div style={{ minWidth: "180px", minHeight: "70px"}}>
				 	<div style={{ padding: "2px", 
				 				  color: "#000",
				 				  }}>
				 	{address && 
					(
				 		<div style={{ fontSize: "12px", 
									  fontWeight: "bold",
				 					  border: "3px solid orange", 
				 				  	  borderRadius: "10px",
									  backgroundColor: "white",
									  textAlign: "center"
				 					  }}>
				 			{address.address_name}
				 		<div>
				 			<button 
				 			style={{fontSize: "12px", 
				 					border: "none", 
				 					background: "orange", 
				 					borderRadius: "10px",
									zIndex:"999",
				 					color: "white"}}
							onClick={locationshare}		
									>
									선택 완료
							</button>
				 		</div>
				 		</div>
				 	)
					}
				 	</div>
				 </div>
          	</CustomOverlayMap>
				)}
			</Map>
		</>
	);
};

export default KakaoMapAPI;
