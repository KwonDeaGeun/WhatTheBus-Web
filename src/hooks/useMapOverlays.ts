import { useEffect } from "react";
import type { Bus } from "../data/bus";
import type { BusStop } from "../data/busStops";
import {
    clearAllBusOverlays,
    createBusOverlays,
    createBusStopOverlays,
} from "../utils/mapOverlays";

export const useMapOverlays = (
    map: unknown,
    busStops: BusStop[],
    buses: Bus[],
    selectedStopName?: string,
    onStopClick?: (stop: BusStop) => void
) => {
    // 버스 정류장 오버레이 관리
    useEffect(() => {
        if (!map) return;

        const stopOverlays = createBusStopOverlays(map, busStops, selectedStopName, onStopClick);

        return () => {
            stopOverlays.forEach((overlay) => {
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
    }, [map, busStops, selectedStopName, onStopClick]);

    // 버스 오버레이 관리 (업데이트만 수행, cleanup 없음)
    useEffect(() => {
        if (!map) return;
        createBusOverlays(map, buses);
    }, [map, buses]);

    // 컴포넌트 언마운트 시에만 모든 버스 오버레이 정리
    useEffect(() => {
        return () => {
            clearAllBusOverlays();
        };
    }, []);
};
