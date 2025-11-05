import type { Dispatch, SetStateAction } from "react";
import type { Bus } from "../data/bus";
import { moveToLocation } from "./useMapMovement";

export const useBusSelection = (
    buses: Bus[],
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
                    const direction =
                        bus.direction === true
                            ? "단국대학교"
                            : bus.direction === false
                              ? "죽전역"
                              : "";
                    const label = direction
                        ? `셔틀버스(${direction} 방향)`
                        : "셔틀버스";
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
