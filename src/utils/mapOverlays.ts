interface BusStop {
    lat: number;
    lng: number;
}

interface Bus {
    lat: number;
    lng: number;
    shuttleId?: string;
}

interface OverlayHandle {
    setMap: (map: unknown) => void;
}

export const createBusStopOverlays = (
    map: unknown,
    busStops: BusStop[]
): OverlayHandle[] => {
    if (!map || !window.kakao?.maps) return [];

    return busStops.map((stop) => {
        const busIconDiv = document.createElement("div");
        busIconDiv.style.width = "48px";
        busIconDiv.style.height = "48px";
        busIconDiv.style.display = "flex";
        busIconDiv.style.alignItems = "center";
        busIconDiv.style.justifyContent = "center";
        busIconDiv.innerHTML =
            '<img src="/ic_busstop.svg" alt="Bus Icon" width="48" height="48" />';

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
    if (!map || !window.kakao?.maps) return [];

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
