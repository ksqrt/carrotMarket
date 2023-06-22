import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const KakaoMapAPI = () => {
	const { kakao } = window;
	const [location, setLoacation] = useState({latitude: null, longitude: null}); // 현재 위치를 저장할 상태
	const [address, setAddress] = useState(null); // 현재 좌표의 주소를 저장할 상태

	//현재 위치를 불러옴
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

	//현재위치의 위도, 경도값을 기반으로 주소값으로 변경
	const getAddress = (lat, lng) => {
		const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
		const coord = new kakao.maps.LatLng(location.latitude, location.longitude); // 주소로 변환할 좌표 입력
		const callback = function (result, status) {
			if (status === kakao.maps.services.Status.OK) {
				console.log(result[0].address)
				setAddress(result[0].address);
			}
		};
		geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
		console.log(address)
	};

	return (
		<>
			<Map center={{ lat: location.latitude, lng: location.longitude }} style={{ width: '500px', height: '500px' }} level={3}>
				<MapMarker position={{ lat: location.latitude, lng: location.longitude }} />
				<button onClick={getAddress}>현재 좌표의 주소 얻기</button>
			</Map>

			{address && (
				<div>
					현재 좌표의 주소는..
					<p>address_name: {address.address_name}</p>
					<p>region_1depth_name: {address.region_1depth_name}</p>
					<p>region_2depth_name: {address.region_2depth_name}</p>
					<p>region_3depth_name: {address.region_3depth_name}</p>
				</div>
			)}
		</>
	);
};

export default KakaoMapAPI;
