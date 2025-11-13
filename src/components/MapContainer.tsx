import type { ReactNode } from "react";
import { useBusLocations } from "../api/bus";
import type { BusStop } from "../data/busStops";
import { busStops } from "../data/busStops";
import { useKakaoMap } from "../hooks/useKakaoMap";
import { useMapEventHandlers } from "../hooks/useMapEventHandlers";
import { useMapOverlays } from "../hooks/useMapOverlays";
import { useToast } from "./ui/use-toast";

interface MapContainerProps {
    mapId: string;
    children?: ReactNode;
    selectedStopName?: string;
    onStopClick?: (stop: BusStop) => void;
}

export const MapContainer = ({
    mapId,
    children,
    selectedStopName,
    onStopClick,
}: MapContainerProps) => {
    const { toast } = useToast();
    const map = useKakaoMap({ mapId, toast });
    const { data: buses = [] } = useBusLocations();

    useMapOverlays(map, [...busStops], buses, selectedStopName, onStopClick);
    useMapEventHandlers(mapId);

    return (
        <div id={mapId} style={{ flex: 1, width: "100%", minHeight: 200 }}>
            {children}
        </div>
    );
};
