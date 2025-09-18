import { Settings, X } from "lucide-react";
import { useCallback, useId, useState } from "react";
import Bubble from "./components/Bubble";
import BusStops from "./components/BusStops";
import { useToast } from "./components/ui/use-toast";
import { buses } from "./data/bus";
import { busStops } from "./data/busStops";
import type { ToastOptions } from "./hooks/useKakaoMap";
import { useKakaoMap } from "./hooks/useKakaoMap";

function App() {
    const mapId = useId();
    const langId = useId();
    const [language, setLanguage] = useState("ko");
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
    const [showSettings, setShowSettings] = useState(false);
    const toggleSettings = useCallback(() => setShowSettings((s) => !s), []);
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
            <button
                type="button"
                aria-label="설정"
                onClick={toggleSettings}
                style={{
                    position: "fixed",
                    top: 12,
                    right: 12,
                    zIndex: 10000,
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                }}
            >
                {showSettings ? <X size={18} /> : <Settings size={18} />}
            </button>

            {showSettings ? (
                <div
                    role="dialog"
                    aria-label="설정 패널"
                    style={{
                        position: "fixed",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 10000,
                        background: "white",
                        padding: 20,
                        width: "50%",
                        boxShadow: "-8px 0 24px rgba(0,0,0,0.12)",
                        overflowY: "auto",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        <div style={{ fontWeight: 600 }}>설정</div>
                        <button
                            type="button"
                            onClick={toggleSettings}
                            aria-label="닫기"
                            style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            <X />
                        </button>
                    </div>
                    <div
                        style={{
                            fontSize: 13,
                            color: "#374151",
                            display: "grid",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                            }}
                        >
                            <label
                                htmlFor={langId}
                                style={{ fontSize: 12, color: "#111827" }}
                            >
                                언어
                            </label>
                            <select
                                id={langId}
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                style={{
                                    padding: 8,
                                    borderRadius: 6,
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <option value="ko">한국어</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        <div
                            style={{
                                height: 1,
                                background: "#e6e6e6",
                                width: "100%",
                            }}
                        />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                            }}
                        >
                            <div style={{ fontSize: 12, color: "#111827" }}>
                                문의하기
                            </div>
                            <a
                                href="https://forms.gle/your-google-form-id"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "#0ea5e9",
                                    textDecoration: "none",
                                }}
                            >
                                문의하기(구글폼)
                            </a>
                        </div>

                        <div
                            style={{
                                height: 1,
                                background: "#e6e6e6",
                                width: "100%",
                            }}
                        />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                            }}
                        >
                            <div style={{ fontSize: 12, color: "#111827" }}>
                                사용 가이드
                            </div>
                            <div style={{ fontSize: 13, color: "#374151" }}>
                                <a
                                    href="https://www.notion.so/your-notion-page"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: "#0ea5e9",
                                        textDecoration: "none",
                                    }}
                                >
                                    사용 가이드 보기 (Notion)
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
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
