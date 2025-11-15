import { useEffect } from "react";
import type { Bus } from "../data/bus";
import type { BusStop } from "../data/busStops";
import type { KakaoMap } from "../types/kakao";
import {
    clearAllBusOverlays,
    createBusOverlays,
    createBusStopOverlays,
} from "../utils/mapOverlays";

export const useMapOverlays = (
    map: KakaoMap | null,
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

    // map 변경 시 이전 캐시 정리 (cleanup에서만 실행)
    // map이 변경될 때 이전 캐시를 정리하기 위해 의도적으로 의존성에 포함
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        // 컴포넌트 언마운트 또는 map 변경 시 정리
        return () => {
            clearAllBusOverlays();
        };
    }, []);

    // 버스 오버레이 업데이트 (캐시 유지)
    useEffect(() => {
        if (!map) return;
        createBusOverlays(map, buses);
    }, [map, buses]);
};
