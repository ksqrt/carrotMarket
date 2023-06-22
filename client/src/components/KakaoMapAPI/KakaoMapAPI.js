import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const KakaoMapAPI = () => {
	const { kakao } = window;
	const [location, setLoacation] = useState({latitude: null, longitude: null}); // 현재 위치를 저장할 상태
	const [address, setAddress] = useState(null); // 현재 좌표의 주소를 저장할 상태

	//현재 위치를 불러오는것
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

	//현재위치의 위도 경도값을 기반으로 주소로 변경해주는것
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
  const getPosSuccess = (pos) => {
    const currentPos = new window.kakao.maps.LatLng(
      pos.coords.latitude,
      pos.coords.longitude
    );
    if (map && marker) {  // ensure that map and marker are not null
        map.panTo(currentPos);

        marker.setMap(null);
        marker.setPosition(currentPos);
        marker.setMap(map);
    }
};

  useDidMountEffect(() => {
    window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      var geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.coord2Address(
        mouseEvent.latLng.getLng(),
        mouseEvent.latLng.getLat(),
        function (result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            var addr = !!result[0].road_address
              ? result[0].road_address.address_name
              : result[0].address.address_name;

            console.log(addr);

            if (marker) {  // ensure that marker is not null
                marker.setMap(null);
                marker.setPosition(mouseEvent.latLng);
                marker.setMap(map);
            }
          }
        }
      );
    });
  }, [map]);

  return (
    <div>
      <div id="map" style={{ width: '500px', height: '500px' }}></div>
      <div onClick={getCurrentPosBtn}>현재 위치</div>
      
    </div>
  );
};

export default KakaoMapAPI;
