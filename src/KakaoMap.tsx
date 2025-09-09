import { Map, MapMarker } from 'react-kakao-maps-sdk';

const KakaoMap = () => {
  const s_lat = 37.323105;
  const s_lng = 126.97059787494679;

  return (
    <Map
      center={{ lat: s_lat, lng: s_lng }}
      style={{ width: '100%', height: '360px' }}
    >
      <MapMarker position={{ lat: s_lat, lng: s_lng }}></MapMarker>
    </Map>
  );
};

export default KakaoMap;