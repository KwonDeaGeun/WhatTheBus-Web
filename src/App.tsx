import {
    type ComponentType,
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useId,
    useState,
} from "react";
import Bubble from "./components/Bubble";
import { BusStopsPanel } from "./components/BusStopsPanel";
import { MapContainer } from "./components/MapContainer";
import { SettingsButton } from "./components/SettingsButton";

const SettingsPanel = lazy(() => import("./components/SettingsPanel"));

import { QueryClientProvider } from "@tanstack/react-query";
import { useBusSelection } from "./hooks/useBusSelection";
import { queryClient } from "./lib/query-client";

interface DevtoolsProps {
    initialIsOpen?: boolean;
}

// Conditionally load ReactQueryDevtools only in development
const ReactQueryDevtools: ComponentType<DevtoolsProps> = import.meta.env.DEV
    ? lazy(() =>
          import("@tanstack/react-query-devtools").then((module) => ({
              default: module.ReactQueryDevtools,
          }))
      )
    : ((() => null) as ComponentType<DevtoolsProps>);

function App() {
    const mapId = useId();
    const langId = useId();
    const [language, setLanguage] = useState(() => {
        try {
            return typeof window !== "undefined" && window.localStorage
                ? (localStorage.getItem("wtb:lang") ?? "ko")
                : "ko";
        } catch {
            return "ko";
        }
    });
    const [showSettings, setShowSettings] = useState(false);
    const toggleSettings = useCallback(() => setShowSettings((s) => !s), []);

    // 변경 시 반영
    useEffect(() => {
        try {
            if (localStorage.getItem("wtb:lang") !== language) {
                localStorage.setItem("wtb:lang", language);
            }
        } catch {
            /* ignore */
        }
    }, [language]);

    const [bubbleStop, setBubbleStop] = useState<
        { lat: number; lng: number; name: string } | undefined
    >(undefined);

    const handleBusNumberSelect = useBusSelection(setBubbleStop);

    return (
        <QueryClientProvider client={queryClient}>
            <div
                className="App"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                }}
            >
                <SettingsButton
                    showSettings={showSettings}
                    onToggle={toggleSettings}
                />

                {showSettings ? (
                    <Suspense fallback={null}>
                        <SettingsPanel
                            langId={langId}
                            language={language}
                            setLanguage={setLanguage}
                            onClose={() => setShowSettings(false)}
                        />
                    </Suspense>
                ) : null}
                <MapContainer mapId={mapId}>
                    <Bubble
                        stop={bubbleStop}
                        onClose={() => setBubbleStop(undefined)}
                    />
                </MapContainer>
                <BusStopsPanel
                    onBusNumberSelect={handleBusNumberSelect}
                    onToggleBubble={(stop) => {
                        setBubbleStop((prev) =>
                            prev === stop ? undefined : stop
                        );
                    }}
                />
            </div>
            {import.meta.env.DEV && (
                <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
            )}
        </QueryClientProvider>
    );
}

export default App;
