export {};

declare global {
  interface Window {
    kakao: any;
    map?: {
      setCenter: (pos: unknown) => void;
      setMinLevel: (level: number) => void;
      setMaxLevel: (level: number) => void;
      setZoomable: (zoomable: boolean) => void;
    };
  }
}