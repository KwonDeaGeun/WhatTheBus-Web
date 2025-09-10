import { useEffect } from "react";

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

            const script = document.createElement("script");
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                window.kakao.maps.load(initMap);
            };

            script.onerror = () => {
                console.error(
                    "Kakao Maps API 스크립트를 로드하는데 실패했습니다."
                );
            };
        };

        const initMap = () => {
            const container = document.getElementById("map");
            if (!container) {
                console.error("지도를 표시할 HTML 요소를 찾을 수 없습니다.");
                return;
            }
            const options = {
                center: new window.kakao.maps.LatLng(
                    37.32014600082093,
                    127.1288399333128
                ),
                level: 4,
            };
            const map = new window.kakao.maps.Map(container, options);
            map.setMinLevel(3); // 최소 레벨(가장 많이 확대)
            map.setMaxLevel(4); // 최대 레벨(가장 많이 축소)
            map.setZoomable(true); // 줌 활성화

            // 정류장 정보 배열
            const busStops = [
                {
                    name: "단국대 평화의 광장",
                    lat: 37.32014600082093,
                    lng: 127.1288399333128,
                },
                {
                    name: "단국대 종합 실험동",
                    lat: 37.32022368228002,
                    lng: 127.12572906480165,
                },
                {
                    name: "단국대 치과병원",
                    lat: 37.322291863336666,
                    lng: 127.12543635052465,
                },
                {
                    name: "죽전역",
                    lat: 37.32420554845601,
                    lng: 127.10820542281134,
                },
                {
                    name: "단국대 정문",
                    lat: 37.323352264049944,
                    lng: 127.12596838722746,
                },
                {
                    name: "단국대 상경관",
                    lat: 37.32220999341863,
                    lng: 127.12826242041064,
                },
            ];

            busStops.forEach((stop) => {
                const busIconDiv = document.createElement("div");
                busIconDiv.style.width = "40px";
                busIconDiv.style.height = "40px";
                busIconDiv.style.display = "flex";
                busIconDiv.style.alignItems = "center";
                busIconDiv.style.justifyContent = "center";
                busIconDiv.innerHTML =
                    '<img src="/ic_busstop.svg" alt="Bus Icon" width="40" height="40" />';

                const markerPosition = new window.kakao.maps.LatLng(
                    stop.lat,
                    stop.lng
                );
                const overlay = new window.kakao.maps.CustomOverlay({
                    position: markerPosition,
                    content: busIconDiv,
                    yAnchor: 1,
                });
                overlay.setMap(map);
            });
        };

        loadKakaoMapScript();

        // 모바일 제스처/스크롤 제어 (접근성 개선)
        const container = document.getElementById("map");
        const gestureHandler = (e: Event) => {
            const t = e.target as HTMLElement | null;
            if (t?.closest?.("#map") && e.cancelable) {
                // 지도 영역 내에서만 핀치줌 방지
                e.preventDefault();
            }
        };
        const touchMoveHandler = (e: TouchEvent) => {
            // 지도 영역 내 터치 시 바디 스크롤 방지
            if ((e.target as HTMLElement)?.closest?.("#map")) {
                e.preventDefault();
            }
        };
        document.addEventListener("gesturestart", gestureHandler, {
            passive: false,
        });
        container?.addEventListener("touchmove", touchMoveHandler, {
            passive: false,
        });

        return () => {
            document.removeEventListener("gesturestart", gestureHandler);
            container?.removeEventListener("touchmove", touchMoveHandler);
        };
    }, []);

    return (
        <div className="App">
            <div id="map" style={{ width: "100vw", height: "100vh" }} />
        </div>
    );
}

export default App;
