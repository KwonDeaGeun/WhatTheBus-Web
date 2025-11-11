import type { BusStop } from "../data/busStops";
import { busStops } from "../data/busStops";
import { moveToLocation } from "../hooks/useMapMovement";
import BusStops from "./BusStops";

interface BusStopsPanelProps {
    onBusNumberSelect: (n: number) => void;
    onToggleBubble: (stop?: BusStop) => void;
    busCount: number;
}

export const BusStopsPanel = ({
    onBusNumberSelect,
    onToggleBubble,
    busCount,
}: BusStopsPanelProps) => {
    return (
        <div
            style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 50,
                padding: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#f5f5f5",
                borderTop: "1px solid #ddd",
                boxShadow: "0 -6px 20px rgba(0,0,0,0.08)",
            }}
        >
            <BusStops
                busStops={busStops}
                onSelect={(stop) => moveToLocation(stop.lat, stop.lng)}
                onBusNumberSelect={onBusNumberSelect}
                onToggleBubble={onToggleBubble}
                busCount={busCount}
            />
        </div>
    );
};
