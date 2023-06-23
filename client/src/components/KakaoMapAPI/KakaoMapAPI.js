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

  const getCurrentPosBtn = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        getPosSuccess,
        () => alert('위치 정보를 가져오는데 실패했습니다.'),
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000,
        }
      );
    } else {
      alert('Geolocation을 지원하지 않는 브라우저입니다.');
    }
  };

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

  // useDidMountEffect(() => {
  //   window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
  //     var geocoder = new window.kakao.maps.services.Geocoder();

  //     geocoder.coord2Address(
  //       mouseEvent.latLng.getLng(),
  //       mouseEvent.latLng.getLat(),
  //       function (result, status) {
  //         if (status === window.kakao.maps.services.Status.OK) {
  //           var addr = !!result[0].road_address
  //             ? result[0].road_address.address_name
  //             : result[0].address.address_name;

  //           console.log(addr);

  //           if (marker) {  // ensure that marker is not null
  //               marker.setMap(null);
  //               marker.setPosition(mouseEvent.latLng);
  //               marker.setMap(map);
  //           }
  //         }
  //       }
  //     );
  //   });
  // }, [map]);

	return (
		<>
			<Map center={{ lat: location.latitude, lng: location.longitude }} 
				 style={{ width: '500px', height: '500px' }} 
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
				<div style={{ minWidth: "150px" }}>
					{/* <img
					alt="close"
					width="20px"
					height="20px"
					src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
					style={{
						position: "absolute",
						right: "5px",
						top: "5px",
						cursor: "pointer",
					}}
					onClick={() => setIsOpen(false)}
					/> */}
					<div style={{ padding: "10px", color: "#000"}}>
					{address && (
						<div style={{ fontSize: "12px", fontWeight: "bold"}}>
							{address.address_name}
						</div>
					)}
					</div>
					<div>
					<button disabled={!addressConfirmed}>주소 보내기</button>
					</div>
				</div>
				)}
				</MapMarker>}
			</Map>
		</>
	);
};

export default KakaoMapAPI;