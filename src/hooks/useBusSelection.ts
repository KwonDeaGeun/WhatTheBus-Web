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
                    // Store direction info as a key that can be translated
                    const directionKey =
                        bus.direction === true
                            ? "bus.shuttleToDKU"
                            : bus.direction === false
                              ? "bus.shuttleToJukjeon"
                              : "bus.shuttle";
                    setBubbleStop({ lat: bus.lat, lng: bus.lng, name: directionKey });
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
