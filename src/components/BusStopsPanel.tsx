import type { BusStop } from "../data/busStops";
import { busStops } from "../data/busStops";
import { moveToLocation } from "../hooks/useMapMovement";
import BusStops from "./BusStops";

interface BusStopsPanelProps {
    onBusNumberSelect: (n: number) => void;
    onToggleBubble: (stop?: BusStop) => void;
}

export const BusStopsPanel = ({
    onBusNumberSelect,
    onToggleBubble,
}: BusStopsPanelProps) => {
    return (
        <div
            style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#f5f5f5",
                borderTop: "1px solid #ddd",
            }}
        >
            <BusStops
                busStops={busStops}
                onSelect={(stop) => moveToLocation(stop.lat, stop.lng)}
                onBusNumberSelect={onBusNumberSelect}
                onToggleBubble={onToggleBubble}
            />
        </div>
    );
};
