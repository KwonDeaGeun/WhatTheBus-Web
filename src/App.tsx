import { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

function App() {
  useEffect(() => {
    const kakaoApiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

    const loadKakaoMapScript = () => {
      if (window.kakao && window.kakao.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(initMap);
      };

      script.onerror = () => {
        console.error("Kakao Maps API 스크립트를 로드하는데 실패했습니다.");
      };
    };

    const initMap = () => {
      const container = document.getElementById('map');
      if (!container) {
        console.error("지도를 표시할 HTML 요소를 찾을 수 없습니다.");
        return;
      }
      const options = {
        center: new window.kakao.maps.LatLng(37.32014600082093, 127.1288399333128),
        level: 4,
      };
  const map = new window.kakao.maps.Map(container, options);
  map.setZoomable(false); // 줌(축척) 고정

      // 단국대 평화의 광장
      const busIconDiv1 = document.createElement('div');
      busIconDiv1.style.width = '40px';
      busIconDiv1.style.height = '40px';
      busIconDiv1.style.display = 'flex';
      busIconDiv1.style.alignItems = 'center';
      busIconDiv1.style.justifyContent = 'center';
      busIconDiv1.innerHTML = '<img src="/ic_busstop.svg" alt="Bus Icon" width="40" height="40" />';

      const markerPosition1 = new window.kakao.maps.LatLng(37.32014600082093, 127.1288399333128);
      const overlay1 = new window.kakao.maps.CustomOverlay({
        position: markerPosition1,
        content: busIconDiv1,
        yAnchor: 1,
      });
      overlay1.setMap(map);

      // 단국대 종합 실험동
      const busIconDiv2 = document.createElement('div');
      busIconDiv2.style.width = '40px';
      busIconDiv2.style.height = '40px';
      busIconDiv2.style.display = 'flex';
      busIconDiv2.style.alignItems = 'center';
      busIconDiv2.style.justifyContent = 'center';
      busIconDiv2.innerHTML = '<img src="/ic_busstop.svg" alt="Bus Icon" width="40" height="40" />';

      const markerPosition2 = new window.kakao.maps.LatLng(37.32022368228002, 127.12572906480165);
      const overlay2 = new window.kakao.maps.CustomOverlay({
        position: markerPosition2,
        content: busIconDiv2,
        yAnchor: 1,
      });
      overlay2.setMap(map);

      // 단국대 치과병원
      const busIconDiv3 = document.createElement('div');
      busIconDiv3.style.width = '40px';
      busIconDiv3.style.height = '40px';
      busIconDiv3.style.display = 'flex';
      busIconDiv3.style.alignItems = 'center';
      busIconDiv3.style.justifyContent = 'center';
      busIconDiv3.innerHTML = '<img src="/ic_busstop.svg" alt="Bus Icon" width="40" height="40" />';

      const markerPosition3 = new window.kakao.maps.LatLng(37.322291863336666, 127.12543635052465);
      const overlay3 = new window.kakao.maps.CustomOverlay({
        position: markerPosition3,
        content: busIconDiv3,
        yAnchor: 1,
      });
      overlay3.setMap(map);

      // 죽전역
      const busIconDiv4 = document.createElement('div');
      busIconDiv4.style.width = '40px';
      busIconDiv4.style.height = '40px';
      busIconDiv4.style.display = 'flex';
      busIconDiv4.style.alignItems = 'center';
      busIconDiv4.style.justifyContent = 'center';
      busIconDiv4.innerHTML = '<img src="/ic_busstop.svg" alt="Bus Icon" width="40" height="40" />';

      const markerPosition4 = new window.kakao.maps.LatLng(37.32420554845601, 127.10820542281134);
      const overlay4 = new window.kakao.maps.CustomOverlay({
        position: markerPosition4,
        content: busIconDiv4,
        yAnchor: 1,
      });
      overlay4.setMap(map);
    };

    loadKakaoMapScript();

  }, []);

  return (
    <div className="App">
      <div id="map" style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
}

export default App;
