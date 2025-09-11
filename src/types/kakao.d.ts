export {};

declare global {
    interface Window {
        kakao: {
            maps: {
                LatLng: new (lat: number, lng: number) => unknown;
                Map: new (container: HTMLElement, options: unknown) => unknown;
                CustomOverlay: new (options: unknown) => unknown;
                load: (callback: () => void) => void;
            };
        };
        map?: {
            setCenter: (pos: unknown) => void;
            setMinLevel: (level: number) => void;
            setMaxLevel: (level: number) => void;
            setZoomable: (zoomable: boolean) => void;
        };
    }
}
