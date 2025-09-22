import type { Dispatch, SetStateAction } from "react";
import { buses } from "../data/bus";
import { moveToLocation } from "./useMapMovement";

export const useBusSelection = (
    setBubbleStop: Dispatch<
        SetStateAction<{ lat: number; lng: number; name: string } | undefined>
    >
) => {
    const handleBusNumberSelect = (n: number) => {
        try {
            const idx = n - 1;
            const bus = buses[idx];
            if (bus && Number.isFinite(bus.lat) && Number.isFinite(bus.lng)) {
                moveToLocation(bus.lat, bus.lng);
                try {
                    const dir = bus.direction?.trim() ?? "";
                    const label = dir ? `셔틀버스(${dir} 방향)` : "셔틀버스";
                    setBubbleStop({ lat: bus.lat, lng: bus.lng, name: label });
                } catch {
                    /* ignore */
                }
            } else {
                // eslint-disable-next-line no-console
                console.warn(`No bus data for number ${n}`);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    };

    return handleBusNumberSelect;
};
