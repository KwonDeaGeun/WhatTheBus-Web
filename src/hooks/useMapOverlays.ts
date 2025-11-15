import { useEffect } from "react";
import type { Bus } from "../data/bus";
import type { BusStop } from "../data/busStops";
import {
    createBusOverlays,
    createBusStopOverlays,
    type OverlayHandle,
} from "../utils/mapOverlays";

export const useMapOverlays = (
    map: unknown,
    busStops: BusStop[],
    buses: Bus[],
    selectedStopName?: string,
    onStopClick?: (stop: BusStop) => void
) => {
    useEffect(() => {
        if (!map) return;

        const overlays: OverlayHandle[] = [
            ...createBusStopOverlays(map, busStops, selectedStopName, onStopClick),
            ...createBusOverlays(map, buses),
        ];

        return () => {
            overlays.forEach((overlay) => {
                try {
                    overlay.setMap(null);
                } catch {
                    // ignore cleanup errors
                }
                try {
                    overlay.cleanup?.();
                } catch {
                    // ignore cleanup errors
                }
            });
        };
    }, [map, busStops, buses, selectedStopName, onStopClick]);
};
