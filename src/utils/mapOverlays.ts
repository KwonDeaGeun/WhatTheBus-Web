import type { Bus } from "../data/bus";
import type { BusStop } from "../data/busStops";

export interface OverlayHandle {
    setMap: (map: unknown) => void;
}

// Helper to create Lucide icon as SVG element
const createIconSVG = (iconType: "mapPin" | "bus") => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "32");
    svg.setAttribute("height", "32");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "#2563eb"); // text-blue-600
    svg.setAttribute("stroke-width", "2.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.style.display = "block";

    if (iconType === "mapPin") {
        // MapPin icon path with white fill
        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0");
        path1.setAttribute("fill", "white");
        svg.appendChild(path1);
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "10");
        circle.setAttribute("r", "3");
        circle.setAttribute("fill", "white");
        svg.appendChild(circle);
    } else {
        // Bus icon paths with white fill background
        // Background rectangle for white fill
        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute("x", "1");
        bgRect.setAttribute("y", "5");
        bgRect.setAttribute("width", "22");
        bgRect.setAttribute("height", "15");
        bgRect.setAttribute("rx", "2");
        bgRect.setAttribute("fill", "white");
        bgRect.setAttribute("stroke", "none");
        svg.appendChild(bgRect);
        
        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M8 6v6");
        svg.appendChild(path1);
        
        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "M2 12h19.6");
        svg.appendChild(path2);
        
        const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path3.setAttribute("d", "M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3");
        svg.appendChild(path3);
        
        const circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle1.setAttribute("cx", "7");
        circle1.setAttribute("cy", "18");
        circle1.setAttribute("r", "2");
        circle1.setAttribute("fill", "white");
        svg.appendChild(circle1);
        
        const path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path4.setAttribute("d", "M9 18h5");
        svg.appendChild(path4);
        
        const circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle2.setAttribute("cx", "16");
        circle2.setAttribute("cy", "18");
        circle2.setAttribute("r", "2");
        circle2.setAttribute("fill", "white");
        svg.appendChild(circle2);
    }

    return svg;
};

export const createBusStopOverlays = (
    map: unknown,
    busStops: BusStop[]
): OverlayHandle[] => {
    if (!map || typeof window === "undefined" || !window.kakao?.maps) return [];

    return busStops.map((stop) => {
        const busIconDiv = document.createElement("div");
        busIconDiv.style.width = "32px";
        busIconDiv.style.height = "32px";
        busIconDiv.style.display = "flex";
        busIconDiv.style.alignItems = "center";
        busIconDiv.style.justifyContent = "center";
        busIconDiv.setAttribute("role", "img");
        busIconDiv.setAttribute("aria-label", `정류장: ${stop.name}`);
        
        const iconSVG = createIconSVG("mapPin");
        busIconDiv.appendChild(iconSVG);

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
        busDiv.style.width = "32px";
        busDiv.style.height = "32px";
        busDiv.style.display = "flex";
        busDiv.style.alignItems = "center";
        busDiv.style.justifyContent = "center";
        busDiv.style.cursor = "pointer";
        busDiv.setAttribute("role", "img");
        busDiv.setAttribute("aria-label", bus.shuttleId || "bus");

        const iconSVG = createIconSVG("bus");
        busDiv.appendChild(iconSVG);

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
