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
    getCenter?: () =>
        | KakaoLatLng
        | { getLat: () => number; getLng: () => number };
}

interface KakaoOverlay {
    setMap: (map: KakaoMap | null) => void;
}

declare global {
    interface Window {
        kakao: {
            maps: {
                // LatLng factory / class
                LatLng: new (lat: number, lng: number) => KakaoLatLng;
                // Size used for pixel offsets
                Size: new (width: number, height: number) => { width: number; height: number };
                // Map constructor
                Map: new (
                    container: HTMLElement,
                    options: { center: KakaoLatLng; level?: number }
                ) => KakaoMap;
                // CustomOverlay accepts a slightly more flexible options object
                CustomOverlay: new (options: {
                    position: KakaoLatLng | { lat: number; lng: number };
                    content: HTMLElement | string;
                    yAnchor?: number;
                    offset?: { width: number; height: number } | any;
                    // some versions expose a clickable flag on overlays
                    clickable?: boolean;
                }) => KakaoOverlay;
                load: (callback: () => void) => void;
            };
        };
        map?: KakaoMap;
        __panAnimationId?: number;
        // WebView / embed hooks used by React Native WebView or other hosts
        __moveFromRN?: (lat: number, lng: number) => void;
        __onMapReady?: () => void;
        __pendingMove?: { lat: number; lng: number } | null;
        // Minimal React Native WebView typing to allow postMessage from the web app
        ReactNativeWebView?: { postMessage: (message: string) => void };
        // internal bubble overlay handle / name used by the app
        __currentBubbleOverlay?: KakaoOverlay | undefined;
        __currentBubbleStopName?: string | undefined;
    }
}
