import { useEffect, useRef } from "react";
import { buses } from "../data/bus";
import { busStops } from "../data/busStops";

export type ToastOptions = {
    title?: string;
    description?: string;
    variant?: "default" | "destructive" | undefined;
};
type ToastFn = (opts: ToastOptions) => void;

export function useKakaoMap(mapId: string, toast?: ToastFn) {
    const panAnimationRef = useRef<number | undefined>(undefined);
    type OverlayHandle = { setMap: (map: Window["map"] | null) => void };

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
                toast?.({
                    title: "지도 초기화 오류",
                    description: "지도를 표시할 요소를 찾을 수 없습니다.",
                    variant: "destructive",
                });
                return;
            }

            const options = {
                center: new window.kakao.maps.LatLng(
                    37.32014600082093,
                    127.1288399333128
                ),
                level: 4,
            };

            try {
                const map = new window.kakao.maps.Map(container, options);
                map.setMinLevel(3);
                map.setMaxLevel(4);
                map.setZoomable(true);
                window.map = map;

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
                    overlays.push(overlay as unknown as OverlayHandle);
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
                    overlays.push(busOverlay as unknown as OverlayHandle);
                });
            } catch (e) {
                console.error("Kakao Maps 초기화 중 오류:", e);
                toast?.({
                    title: "지도 초기화 오류",
                    description:
                        "지도를 초기화하지 못했습니다. 잠시 후 다시 시도하세요.",
                    variant: "destructive",
                });
            }
        };

        const loadKakaoMapScript = () => {
            if (window.kakao?.maps?.load) {
                window.kakao.maps.load(initMap);
                return;
            }

            const scriptId = "kakao-maps-sdk";
            let script = document.getElementById(
                scriptId
            ) as HTMLScriptElement | null;

            if (script) {
                if (!window.kakao?.maps?.load) {
                    script.onload = () => {
                        window.kakao.maps.load(initMap);
                    };
                    script.onerror = () => {
                        toast?.({
                            title: "지도 로드 실패",
                            description:
                                "Kakao Maps API 스크립트를 불러오는 데 실패했습니다.",
                            variant: "destructive",
                        });
                    };
                }
                return;
            }

            script = document.createElement("script");
            script.id = scriptId;
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                window.kakao.maps.load(initMap);
            };

            script.onerror = () => {
                toast?.({
                    title: "지도 로드 실패",
                    description:
                        "Kakao Maps API 스크립트를 불러오는 데 실패했습니다.",
                    variant: "destructive",
                });
            };
        };

        loadKakaoMapScript();

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
            overlays.forEach((o) => {
                try {
                    o.setMap(null);
                } catch {
                    /* ignore */
                }
            });
            overlays.length = 0;
            try {
                const bubble = window.__currentBubbleOverlay;
                if (bubble) bubble.setMap(null);
            } catch {
                /* ignore */
            }
            window.__currentBubbleOverlay = undefined;
            window.__currentBubbleStopName = undefined;
            window.map = undefined;
            if (typeof panAnimationRef.current === "number")
                cancelAnimationFrame(panAnimationRef.current);
        };
    }, [mapId, toast]);

    const moveToLocation = (lat: number, lng: number) => {
        if (!window.map || typeof window.kakao === "undefined") return;

        const getCenterCoords = () => {
            try {
                const c = window.map?.getCenter?.();
                if (!c) return null;
                if (
                    "getLat" in c &&
                    typeof (c as { getLat?: unknown }).getLat === "function"
                ) {
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

        if (!start) {
            try {
                window.map?.setCenter(
                    new window.kakao.maps.LatLng(targetLat, targetLng)
                );
            } catch {
                /* ignore */
            }
            return;
        }

        const duration = 500;
        const startTime = performance.now();
        const startLat = start.lat;
        const startLng = start.lng;

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

    return { moveToLocation };
}

export default useKakaoMap;
