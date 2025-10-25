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
import { useBusLocations } from "./api/bus";
import { useBusSelection } from "./hooks/useBusSelection";
import { queryClient } from "./lib/query-client";

interface DevtoolsProps {
    initialIsOpen?: boolean;
}

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

    return (
        <QueryClientProvider client={queryClient}>
            <AppContent
                mapId={mapId}
                langId={langId}
                language={language}
                setLanguage={setLanguage}
                showSettings={showSettings}
                toggleSettings={toggleSettings}
                bubbleStop={bubbleStop}
                setBubbleStop={setBubbleStop}
            />
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}

interface AppContentProps {
    mapId: string;
    langId: string;
    language: string;
    setLanguage: (lang: string) => void;
    showSettings: boolean;
    toggleSettings: () => void;
    bubbleStop: { lat: number; lng: number; name: string } | undefined;
    setBubbleStop: React.Dispatch<React.SetStateAction<{ lat: number; lng: number; name: string } | undefined>>;
}

function AppContent({
    mapId,
    langId,
    language,
    setLanguage,
    showSettings,
    toggleSettings,
    bubbleStop,
    setBubbleStop,
}: AppContentProps) {
    const { data: buses = [] } = useBusLocations();
    const handleBusNumberSelect = useBusSelection(buses, setBubbleStop);

    return (
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
                        onClose={toggleSettings}
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
    );
}

export default App;
