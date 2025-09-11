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
    }
}
