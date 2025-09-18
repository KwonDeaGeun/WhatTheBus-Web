import { useId, useState } from "react";
import Bubble from "./components/Bubble";
import BusStops from "./components/BusStops";
import { useToast } from "./components/ui/use-toast";
import { buses } from "./data/bus";
import { busStops } from "./data/busStops";
import type { ToastOptions } from "./hooks/useKakaoMap";
import { useKakaoMap } from "./hooks/useKakaoMap";

function App() {
    const mapId = useId();
    const { toast } = useToast();

    const { moveToLocation } = useKakaoMap(mapId, (opts: ToastOptions) => {
        try {
            toast(opts);
        } catch {
            // ignore
        }
    });

    const [bubbleStop, setBubbleStop] = useState<
        { lat: number; lng: number; name: string } | undefined
    >(undefined);
    // map initialization and script loading handled by useKakaoMap

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

    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            <div id={mapId} style={{ height: "70vh", width: "100vw" }} />
            <Bubble
                stop={bubbleStop}
                onClose={() => setBubbleStop(undefined)}
            />
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
                    onBusNumberSelect={handleBusNumberSelect}
                    onToggleBubble={(stop) => {
                        setBubbleStop(stop);
                    }}
                />
            </div>
        </div>
    );
}

export default App;
