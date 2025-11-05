import type { ReactNode } from "react";
import { useBusLocations } from "../api/bus";
import { busStops } from "../data/busStops";
import { useKakaoMap } from "../hooks/useKakaoMap";
import { useMapEventHandlers } from "../hooks/useMapEventHandlers";
import { useMapOverlays } from "../hooks/useMapOverlays";
import { useToast } from "./ui/use-toast";

interface MapContainerProps {
    mapId: string;
    children?: ReactNode;
    selectedStopName?: string;
}

export const MapContainer = ({
    mapId,
    children,
    selectedStopName,
}: MapContainerProps) => {
    const { toast } = useToast();
    const map = useKakaoMap({ mapId, toast });
    const { data: buses = [] } = useBusLocations();

    useMapOverlays(map, [...busStops], buses, selectedStopName);
    useMapEventHandlers(mapId);

    return (
        <div id={mapId} style={{ height: "70vh", width: "100vw" }}>
            {children}
        </div>
    );
};
