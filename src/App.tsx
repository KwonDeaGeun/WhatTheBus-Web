import {
    type ComponentType,
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import Bubble from "./components/Bubble";
import { BusStopsPanel } from "./components/BusStopsPanel";
import { MapContainer } from "./components/MapContainer";
import { SettingsButton } from "./components/SettingsButton";
import { ToastProvider, useToast } from "./components/ui/use-toast";

const SettingsPanel = lazy(() => import("./components/SettingsPanel"));

import { QueryClientProvider } from "@tanstack/react-query";
import { useBusLocations } from "./api/bus";
import { type Language, LanguageProvider } from "./contexts/LanguageContext";
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
    const [language, setLanguage] = useState<Language>(() => {
        try {
            const stored =
                typeof window !== "undefined" && window.localStorage
                    ? localStorage.getItem("wtb:lang")
                    : null;
            return stored === "en" ? "en" : "ko";
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
            <LanguageProvider language={language} setLanguage={setLanguage}>
                <ToastProvider>
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
                    {import.meta.env.DEV && (
                        <ReactQueryDevtools initialIsOpen={false} />
                    )}
                </ToastProvider>
            </LanguageProvider>
        </QueryClientProvider>
    );
}

interface AppContentProps {
    mapId: string;
    langId: string;
    language: Language;
    setLanguage: (lang: Language) => void;
    showSettings: boolean;
    toggleSettings: () => void;
    bubbleStop: { lat: number; lng: number; name: string } | undefined;
    setBubbleStop: React.Dispatch<
        React.SetStateAction<
            { lat: number; lng: number; name: string } | undefined
        >
    >;
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
    const { toast } = useToast();
    const errorShownRef = useRef(false);

    const handleBusLocationError = useCallback(
        (message: string) => {
            // Only show toast once to avoid spamming on refetch failures
            if (!errorShownRef.current) {
                toast({
                    title: "버스 위치 조회 오류",
                    description: message,
                    variant: "destructive",
                });
                errorShownRef.current = true;
                // Reset after 30 seconds to allow showing error again if it persists
                setTimeout(() => {
                    errorShownRef.current = false;
                }, 30000);
            }
        },
        [toast]
    );

    const { data: buses = [] } = useBusLocations(handleBusLocationError);
    const handleBusNumberSelect = useBusSelection(buses, setBubbleStop);
    const handleStopClick = useCallback(
        (stop: { lat: number; lng: number; name: string }) =>
            setBubbleStop(stop),
        [setBubbleStop]
    );

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
            <MapContainer
                mapId={mapId}
                selectedStopName={bubbleStop?.name}
                onStopClick={handleStopClick}
            >
                <Bubble
                    stop={bubbleStop}
                    onClose={() => setBubbleStop(undefined)}
                />
            </MapContainer>
            <BusStopsPanel
                onBusNumberSelect={handleBusNumberSelect}
                onToggleBubble={(stop) => {
                    setBubbleStop((prev) => (prev === stop ? undefined : stop));
                }}
                busCount={buses.length}
            />
        </div>
    );
}

export default App;
