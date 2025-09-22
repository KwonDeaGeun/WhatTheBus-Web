import type { Bus } from "../data/bus";
import type { BusStop } from "../data/busStops";

export interface OverlayHandle {
    setMap: (map: unknown) => void;
}

export const createBusStopOverlays = (
    map: unknown,
    busStops: BusStop[]
): OverlayHandle[] => {
    if (!map || typeof window === "undefined" || !window.kakao?.maps) return [];

    return busStops.map((stop) => {
        const busIconDiv = document.createElement("div");
        busIconDiv.style.width = "48px";
        busIconDiv.style.height = "48px";
        busIconDiv.style.display = "flex";
        busIconDiv.style.alignItems = "center";
        busIconDiv.style.justifyContent = "center";
        const stopImg = document.createElement("img");
        stopImg.src = "/ic_busstop.svg";
        stopImg.alt = `정류장: ${stop.name}`;
        stopImg.width = 48;
        stopImg.height = 48;
        stopImg.decoding = "async";
        stopImg.style.display = "block";
        busIconDiv.appendChild(stopImg);

        const markerPosition = new window.kakao.maps.LatLng(stop.lat, stop.lng);
        const overlay = new window.kakao.maps.CustomOverlay({
            position: markerPosition,
            content: busIconDiv,
            yAnchor: 1,
        });
        (overlay as unknown as { setMap: (m: unknown) => void }).setMap(map);

        return overlay as OverlayHandle;
    });
};

export const createBusOverlays = (
    map: unknown,
    buses: Bus[]
): OverlayHandle[] => {
    if (!map || typeof window === "undefined" || !window.kakao?.maps) return [];

    return buses.map((bus) => {
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

        const busPosition = new window.kakao.maps.LatLng(bus.lat, bus.lng);
        const busOverlay = new window.kakao.maps.CustomOverlay({
            position: busPosition,
            content: busDiv,
            yAnchor: 1,
        });
        (busOverlay as unknown as { setMap: (m: unknown) => void }).setMap(map);

        return busOverlay as OverlayHandle;
    });
};
