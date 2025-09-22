import { useEffect } from "react";
import { createBusOverlays, createBusStopOverlays } from "../utils/mapOverlays";

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

export const useMapOverlays = (
    map: unknown,
    busStops: BusStop[],
    buses: Bus[]
) => {
    useEffect(() => {
        if (!map) return;

        const overlays: OverlayHandle[] = [
            ...createBusStopOverlays(map, busStops),
            ...createBusOverlays(map, buses),
        ];

        return () => {
            overlays.forEach((overlay) => {
                try {
                    overlay.setMap(null);
                } catch {
                    // ignore cleanup errors
                }
            });
        };
    }, [map, busStops, buses]);
};
