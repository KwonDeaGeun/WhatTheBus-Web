import { Settings, X } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useId, useState } from "react";
import Bubble from "./components/Bubble";
import BusStops from "./components/BusStops";

const SettingsPanel = lazy(() => import("./components/SettingsPanel"));

import { useToast } from "./components/ui/use-toast";
import { buses } from "./data/bus";
import { busStops } from "./data/busStops";

function App() {
    const mapId = useId();
    const langId = useId();
    const [language, setLanguage] = useState(() => {
        try {
            return typeof window !== "undefined" && window.localStorage
                ? localStorage.getItem("wtb:lang") ?? "ko"
                : "ko";
        } catch {
            return "ko";
        }
    });
    const { toast } = useToast();
    const [showSettings, setShowSettings] = useState(false);
    const toggleSettings = useCallback(() => setShowSettings((s) => !s), []);

    // 변경 시 반영
    useEffect(() => {
        try {
            if (localStorage.getItem("wtb:lang") !== language) {
                localStorage.setItem("wtb:lang", language);
            }
        } catch {
            /* ignore */
        }
    }, [language]);

    type OverlayHandle = { setMap: (m: unknown) => void };

    // Function to move map to specific location with smooth animation
    const moveToLocation = (lat: number, lng: number) => {
        if (!window.map || typeof window.kakao === "undefined") return;

        // try to read current center in a few common shapes
        const getCenterCoords = () => {
            try {
                const c = window.map?.getCenter?.();
                if (!c) return null;
                if (
                    "getLat" in c &&
                    typeof (c as { getLat?: unknown }).getLat === "function"
                ) {
                    // Kakao LatLng-like object with getLat/getLng
                    return {
                        lat: (c as { getLat: () => number }).getLat(),
                        lng: (c as { getLng: () => number }).getLng(),
                    };
                }
                if (
                    "lat" in c &&
                    typeof (c as { lat?: unknown }).lat === "number"
                ) {
                    return {
                        lat: (c as { lat: number }).lat,
                        lng: (c as { lng: number }).lng,
                    };
                }
            } catch {
                /* ignore */
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
        } catch {
            /* ignore */
        }

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
                /* ignore */
            }

            if (t < 1) {
                window.__panAnimationId = requestAnimationFrame(step);
            } else {
                try {
                    window.__panAnimationId = undefined;
                } catch {
                    /* ignore */
                }
            }
        };

        window.__panAnimationId = requestAnimationFrame(step);
    };

    const [bubbleStop, setBubbleStop] = useState<
        { lat: number; lng: number; name: string } | undefined
    >(undefined);

    useEffect(() => {
        const kakaoApiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
        const overlays: OverlayHandle[] = [];

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

            buses.forEach((bus) => {
                const busDiv = document.createElement("div");
                busDiv.style.width = "40px";
                busDiv.style.height = "40px";
                busDiv.style.display = "flex";
                busDiv.style.alignItems = "center";
                busDiv.style.justifyContent = "center";
                busDiv.style.cursor = "pointer";

                const img = document.createElement("img");
                img.src = "/ic_busfront.svg";
                img.alt = bus.shuttleId || "bus";
                img.style.width = "32px";
                img.style.height = "32px";
                img.style.display = "block";
                busDiv.appendChild(img);

                const busPosition = new window.kakao.maps.LatLng(
                    bus.lat,
                    bus.lng
                );
                const busOverlay = new window.kakao.maps.CustomOverlay({
                    position: busPosition,
                    content: busDiv,
                    yAnchor: 1,
                });
                busOverlay.setMap(map);
                overlays.push(busOverlay as OverlayHandle);
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
                if (!window.kakao?.maps?.load) {
                    script.onload = () => {
                        window.kakao.maps.load(initMap);
                    };
                    script.onerror = () => {
                        try {
                            toast({
                                title: "지도 로드 실패",
                                description:
                                    "Kakao Maps API 스크립트를 불러오는 데 실패했습니다.",
                                variant: "destructive",
                            });
                        } catch {
                            // fallback to console
                            // eslint-disable-next-line no-console
                            console.error(
                                "Kakao Maps API 스크립트를 로드하는데 실패했습니다."
                            );
                        }
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
                toast({
                    title: "지도 로드 실패",
                    description:
                        "Kakao Maps API 스크립트를 불러오는 데 실패했습니다.",
                    variant: "destructive",
                });
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
            // 말풍선 오버레이 해제 (있다면)
            try {
                const bubble = window.__currentBubbleOverlay;
                if (bubble) bubble.setMap(null);
            } catch {
                /* ignore */
            }
            window.__currentBubbleOverlay = undefined;
            window.__currentBubbleStopName = undefined;
            window.map = undefined;
        };
    }, [mapId, toast]);

    const handleBusNumberSelect = (n: number) => {
        try {
            const idx = n - 1;
            const bus = buses[idx];
            if (bus && Number.isFinite(bus.lat) && Number.isFinite(bus.lng)) {
                moveToLocation(bus.lat, bus.lng);
                try {
                    const dir = bus.direction?.trim() ?? "";
                    const label = dir ? `셔틀버스(${dir} 방향)` : "셔틀버스";
                    setBubbleStop({ lat: bus.lat, lng: bus.lng, name: label });
                } catch {
                    /* ignore */
                }
            } else {
                // eslint-disable-next-line no-console
                console.warn(`No bus data for number ${n}`);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    };

    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            <button
                type="button"
                aria-label="설정"
                aria-haspopup="dialog"
                aria-expanded={showSettings}
                onClick={toggleSettings}
                style={{
                    position: "fixed",
                    top: 40,
                    right: 12,
                    zIndex: 10000,
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                }}
            >
                {showSettings ? <X size={20} /> : <Settings size={20} />}
            </button>

            {showSettings ? (
                <Suspense fallback={null}>
                    <SettingsPanel
                        langId={langId}
                        language={language}
                        setLanguage={setLanguage}
                        onClose={() => setShowSettings(false)}
                    />
                </Suspense>
            ) : null}
            <div id={mapId} style={{ height: "70vh", width: "100vw" }} />
            <Bubble
                stop={bubbleStop}
                onClose={() => setBubbleStop(undefined)}
            />
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
                    onBusNumberSelect={handleBusNumberSelect}
                    onToggleBubble={(stop) => {
                        setBubbleStop((prev) => (prev === stop ? undefined : stop));
                    }}
                />
            </div>
        </div>
    );
}

export default App;
