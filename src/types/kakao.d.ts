export {};

interface KakaoLatLng {
    lat: number;
    lng: number;
}

interface KakaoMap {
    setCenter: (pos: KakaoLatLng) => void;
    setMinLevel: (level: number) => void;
    setMaxLevel: (level: number) => void;
    setZoomable: (zoomable: boolean) => void;
}

interface KakaoOverlay {
    setMap: (map: KakaoMap | null) => void;
}

declare global {
    interface Window {
        kakao: {
            maps: {
                LatLng: new (lat: number, lng: number) => KakaoLatLng;
                Map: new (container: HTMLElement, options: unknown) => KakaoMap;
                CustomOverlay: new (options: unknown) => KakaoOverlay;
                load: (callback: () => void) => void;
            };
        };
        map?: KakaoMap;
        // WebView / embed hooks used by React Native WebView or other hosts
        __moveFromRN?: (lat: number, lng: number) => void;
        __onMapReady?: () => void;
        __pendingMove?: { lat: number; lng: number } | null;
        // Minimal React Native WebView typing to allow postMessage from the web app
        ReactNativeWebView?: { postMessage: (message: string) => void };
    }
}
