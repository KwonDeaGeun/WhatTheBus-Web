import { useEffect, useState } from "react";

interface UseKakaoMapOptions {
    mapId: string;
    toast: (options: {
        title: string;
        description: string;
        variant?: "destructive";
    }) => void;
}

export const useKakaoMap = ({ mapId, toast }: UseKakaoMapOptions) => {
    const [mapInstance, setMapInstance] = useState<unknown>(null);

    useEffect(() => {
        const kakaoApiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
        if (!kakaoApiKey) {
            toast({
                title: "환경설정 오류",
                description: "Kakao Maps API 키가 설정되지 않았습니다.",
                variant: "destructive",
            });
            return;
        }

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
            map.setMaxLevel(5);
            map.setZoomable(true);

            window.map = map;
            setMapInstance(map);

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

        return () => {
            window.map = undefined;
            setMapInstance(null);
        };
    }, [mapId, toast]);

    return mapInstance;
};
