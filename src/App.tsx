import { useEffect, useId } from "react";
import BusStops from "./components/BusStops";
import { busStops } from "./data/busStops";

function App() {
    const mapId = useId();

    type OverlayHandle = { setMap: (m: unknown) => void };

    // Function to move map to specific location with smooth animation
    const moveToLocation = (lat: number, lng: number) => {
        if (!window.map || typeof window.kakao === "undefined") return;

        // try to read current center in a few common shapes
        const getCenterCoords = () => {
            try {
                const c = (window.map as any).getCenter?.();
                if (!c) return null;
                if (
                    typeof c.getLat === "function" &&
                    typeof c.getLng === "function"
                ) {
                    return { lat: c.getLat(), lng: c.getLng() };
                }
                if (typeof c.lat === "number" && typeof c.lng === "number") {
                    return { lat: c.lat, lng: c.lng };
                }
            } catch {
                // ignore
            }
            return null;
        };

        const start = getCenterCoords();
        const targetLat = Number(lat);
        const targetLng = Number(lng);

        // if we can't read start center, jump immediately
        if (!start) {
            try {
                window.map?.setCenter(
                    new window.kakao.maps.LatLng(targetLat, targetLng)
                );
            } catch {
                // ignore
            }
            return;
        }

        const duration = 500; // ms
        const startTime = performance.now();
        const startLat = start.lat;
        const startLng = start.lng;

        // cancel previous animation if any
        try {
            if (typeof window.__panAnimationId === "number")
                cancelAnimationFrame(window.__panAnimationId);
        } catch {}

        const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

        const step = (now: number) => {
            const elapsed = now - startTime;
            const t = Math.min(1, Math.max(0, elapsed / duration));
            const eased = easeOutCubic(t);
            const curLat = startLat + (targetLat - startLat) * eased;
            const curLng = startLng + (targetLng - startLng) * eased;
            try {
                window.map?.setCenter(
                    new window.kakao.maps.LatLng(curLat, curLng)
                );
            } catch {
                // ignore
            }

            if (t < 1) {
                window.__panAnimationId = requestAnimationFrame(step);
            } else {
                try {
                    window.__panAnimationId = undefined;
                } catch {}
            }
        };

        window.__panAnimationId = requestAnimationFrame(step);
    };

    useEffect(() => {
        const kakaoApiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
        const overlays: OverlayHandle[] = [];

        // Guard against multiple initMap executions in StrictMode
        let mapInitialized = false;

        const initMap = () => {
            if (mapInitialized) return;
            mapInitialized = true;
            const container = document.getElementById(mapId);
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
            map.setMinLevel(3);
            map.setMaxLevel(4);
            map.setZoomable(true);

            window.map = map;

            // WebView hooks
            if (typeof window.__moveFromRN !== "function") {
                window.__moveFromRN = (lat: number, lng: number) => {
                    try {
                        if (
                            window.map &&
                            typeof window.map.setCenter === "function" &&
                            typeof window.kakao !== "undefined"
                        ) {
                            window.map.setCenter(
                                new window.kakao.maps.LatLng(lat, lng)
                            );
                        } else {
                            window.__pendingMove = { lat, lng };
                        }
                    } catch {
                        // ignore
                    }
                };
            }

            if (
                window.__pendingMove &&
                Number.isFinite(window.__pendingMove.lat) &&
                Number.isFinite(window.__pendingMove.lng)
            ) {
                try {
                    window.map?.setCenter(
                        new window.kakao.maps.LatLng(
                            window.__pendingMove.lat,
                            window.__pendingMove.lng
                        )
                    );
                    window.__pendingMove = null;
                } catch {
                    // ignore
                }
            }

            if (typeof window.__onMapReady === "function") {
                try {
                    window.__onMapReady();
                } catch {
                    // ignore
                }
            }

            if (
                window.ReactNativeWebView &&
                typeof window.ReactNativeWebView.postMessage === "function"
            ) {
                try {
                    window.ReactNativeWebView.postMessage(
                        JSON.stringify({ type: "MAP_READY" })
                    );
                } catch {
                    // ignore
                }
            }

            busStops.forEach((stop) => {
                const busIconDiv = document.createElement("div");
                busIconDiv.style.width = "48px";
                busIconDiv.style.height = "48px";
                busIconDiv.style.display = "flex";
                busIconDiv.style.alignItems = "center";
                busIconDiv.style.justifyContent = "center";
                busIconDiv.innerHTML =
                    '<img src="/ic_busstop.svg" alt="Bus Icon" width="48" height="48" />';

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
                overlays.push(overlay as OverlayHandle);
            });
        };

        const loadKakaoMapScript = () => {
            if (window.kakao?.maps?.load) {
                window.kakao.maps.load(initMap);
                return;
            }

            const scriptId = "kakao-maps-sdk";
            let script = document.getElementById(scriptId) as HTMLScriptElement;

            if (script) {
                // Script exists but may not be loaded yet
                if (!window.kakao?.maps?.load) {
                    // Attach handlers to existing script if not loaded
                    script.onload = () => {
                        window.kakao.maps.load(initMap);
                    };
                    script.onerror = () => {
                        console.error(
                            "Kakao Maps API 스크립트를 로드하는데 실패했습니다."
                        );
                    };
                }
                return;
            }

            // Create new script with stable ID
            script = document.createElement("script");
            script.id = scriptId;
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
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

        loadKakaoMapScript();

        const isRN = !!window.ReactNativeWebView;
        const selfOrigin = location.protocol.startsWith("http")
            ? location.origin
            : undefined;
        const allowedOrigins = new Set([
            ...(selfOrigin ? [selfOrigin] : []),
            "http://localhost:3000",
            "http://localhost:5173",
        ]);

        const messageHandler = (event: MessageEvent) => {
            // RN(WebView)에서만 origin === "null" 허용
            if (
                !(isRN && event.origin === "null") &&
                !allowedOrigins.has(event.origin)
            )
                return;

            // WebView message handling - only for non-MOVE commands if needed
            // Remove MOVE command handling - will use buttons instead
        };
        window.addEventListener("message", messageHandler);

        const containerEl = document.getElementById(mapId);
        const gestureHandler = (e: Event) => {
            const t = e.target as HTMLElement | null;
            if (containerEl && t && containerEl.contains(t) && e.cancelable)
                e.preventDefault();
        };
        const touchMoveHandler = (e: TouchEvent) => {
            if (
                containerEl &&
                e.target &&
                containerEl.contains(e.target as Node)
            )
                e.preventDefault();
        };

        document.addEventListener("gesturestart", gestureHandler, {
            passive: false,
        });
        containerEl?.addEventListener("touchmove", touchMoveHandler, {
            passive: false,
        });

        return () => {
            document.removeEventListener("gesturestart", gestureHandler);
            containerEl?.removeEventListener("touchmove", touchMoveHandler);
            window.removeEventListener("message", messageHandler);
            // 생성한 오버레이 해제
            overlays.forEach((o) => {
                o.setMap(null);
            });
            overlays.length = 0;
            window.map = undefined;
        };
    }, [mapId]);

    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            <div id={mapId} style={{ height: "50vh", width: "100vw" }} />
            <div
                style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "#f5f5f5",
                    borderTop: "1px solid #ddd",
                }}
            >
                <BusStops
                    busStops={busStops}
                    onSelect={(stop) => moveToLocation(stop.lat, stop.lng)}
                />
            </div>
        </div>
    );
}

export default App;
