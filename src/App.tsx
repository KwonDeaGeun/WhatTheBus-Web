import { useEffect, useId } from "react";

function App() {
    const mapId = useId();

    useEffect(() => {
        const kakaoApiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

        const initMap = () => {
            const container = document.getElementById(mapId);
            if (!container) {
                // eslint-disable-next-line no-console
                console.error("지도를 표시할 HTML 요소를 찾을 수 없습니다.");
                return;
            }

            const options = {
                center: new (window as any).kakao.maps.LatLng(37.32014600082093, 127.1288399333128),
                level: 4,
            };

            const map = new (window as any).kakao.maps.Map(container, options);
            map.setMinLevel(3);
            map.setMaxLevel(4);
            map.setZoomable(true);

            window.map = map;

            // WebView hooks
            if (typeof window.__moveFromRN !== "function") {
                window.__moveFromRN = (lat: number, lng: number) => {
                    try {
                        if (window.map && typeof window.map.setCenter === "function" && typeof window.kakao !== "undefined") {
                            window.map.setCenter(new window.kakao.maps.LatLng(lat, lng));
                        } else {
                            window.__pendingMove = { lat, lng };
                        }
                    } catch (_err) {
                        // ignore
                    }
                };
            }

                    if (window.__pendingMove && Number.isFinite(window.__pendingMove.lat) && Number.isFinite(window.__pendingMove.lng)) {
                        try {
                            window.map?.setCenter(new window.kakao.maps.LatLng(window.__pendingMove.lat, window.__pendingMove.lng));
                            window.__pendingMove = null;
                        } catch (_err) {
                            // ignore
                        }
                    }

            if (typeof window.__onMapReady === "function") {
                try {
                    window.__onMapReady();
                } catch (_err) {
                    // ignore
                }
            }

            if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === "function") {
                try {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: "MAP_READY" }));
                } catch (_err) {
                    // ignore
                }
            }

            const busStops = [
                { name: "단국대 평화의 광장", lat: 37.32014600082093, lng: 127.1288399333128 },
                { name: "단국대 종합 실험동", lat: 37.32022368228002, lng: 127.12572906480165 },
                { name: "단국대 치과병원", lat: 37.322291863336666, lng: 127.12543635052465 },
                { name: "죽전역", lat: 37.32420554845601, lng: 127.10820542281134 },
                { name: "단국대 정문", lat: 37.323352264049944, lng: 127.12596838722746 },
                { name: "단국대 상경관", lat: 37.32220999341863, lng: 127.12826242041064 },
            ];

            busStops.forEach((stop) => {
                const busIconDiv = document.createElement("div");
                busIconDiv.style.width = "40px";
                busIconDiv.style.height = "40px";
                busIconDiv.style.display = "flex";
                busIconDiv.style.alignItems = "center";
                busIconDiv.style.justifyContent = "center";
                busIconDiv.innerHTML = '<img src="/ic_busstop.svg" alt="Bus Icon" width="40" height="40" />';

                const markerPosition = new (window as any).kakao.maps.LatLng(stop.lat, stop.lng);
                const overlay = new (window as any).kakao.maps.CustomOverlay({ position: markerPosition, content: busIconDiv, yAnchor: 1 });
                overlay.setMap(map);
            });
        };

        const loadKakaoMapScript = () => {
            if ((window as any).kakao && (window as any).kakao.maps) {
                initMap();
                return;
            }

            const script = document.createElement("script");
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                (window as any).kakao.maps.load(initMap);
            };

            script.onerror = () => {
                // eslint-disable-next-line no-console
                console.error("Kakao Maps API 스크립트를 로드하는데 실패했습니다.");
            };
        };

        loadKakaoMapScript();

        const allowedOrigins = [window.location.origin, "http://localhost:3000", "http://localhost:5173"];

        const messageHandler = (event: MessageEvent) => {
            if (!allowedOrigins.includes(event.origin)) return;

            let data: unknown;
            try {
                if (typeof event.data === "object" && event.data !== null) data = event.data;
                else if (typeof event.data === "string") data = JSON.parse(event.data);
                else return;
            } catch (_err) {
                return;
            }

            const payload = data as { type?: string; lat?: number; lng?: number };
            if (payload.type === "MOVE" && window.map && Number.isFinite(payload.lat as number) && Number.isFinite(payload.lng as number)) {
                try {
                    const ll = new (window as any).kakao.maps.LatLng(payload.lat, payload.lng);
                    window.map.setCenter(ll);
                } catch (_err) {
                    // ignore
                }
            }
        };

        window.addEventListener("message", messageHandler);

        const containerEl = document.getElementById(mapId);
        const gestureHandler = (e: Event) => {
            const t = e.target as HTMLElement | null;
            if (t?.closest?.("#" + mapId) && e.cancelable) e.preventDefault();
        };
        const touchMoveHandler = (e: TouchEvent) => {
            if ((e.target as HTMLElement)?.closest?.("#" + mapId)) e.preventDefault();
        };

        document.addEventListener("gesturestart", gestureHandler, { passive: false });
        containerEl?.addEventListener("touchmove", touchMoveHandler, { passive: false });

        return () => {
            document.removeEventListener("gesturestart", gestureHandler);
            containerEl?.removeEventListener("touchmove", touchMoveHandler);
            window.removeEventListener("message", messageHandler);
            // @ts-ignore
            window.map = undefined;
        };
    }, [mapId]);

    return (
        <div className="App">
            <div id={mapId} style={{ width: "100vw", height: "100vh" }} />
        </div>
    );
}

export default App;
