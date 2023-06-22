import { useEffect, useState } from 'react';
import useDidMountEffect from './useDidMountEffect';

const KakaoMapAPI = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      setMap(new window.kakao.maps.Map(container, options));
      setMarker(new window.kakao.maps.Marker());
    });
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
