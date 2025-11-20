import { BusFront, X } from "lucide-react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "../contexts/LanguageContext";

const DISPLAY_NAME_MAP: Record<string, string> = {
    죽전역: "죽전역(단국대학교 방향)",
    치과병원: "치과병원(단국대학교 방향)",
    정문: "정문(죽전역 방향)",
    인문관: "인문관(죽전역 방향)"
};

type Stop = { lat: number; lng: number; name: string };

type Props = {
    stop?: Stop;
    onClose?: () => void;
};

export default function Bubble({ stop, onClose }: Props) {
    const { t, formatTime } = useTranslation();
    useEffect(() => {
        if (typeof window.kakao === "undefined" || !window.map) return;

        let overlay: Window["__currentBubbleOverlay"] | undefined;

        try {
            const clearExisting = () => {
                try {
                    const existing = window.__currentBubbleOverlay;
                    if (existing) existing.setMap(null);
                } catch {
                    /* ignore */
                }
                window.__currentBubbleOverlay = undefined;
                window.__currentBubbleStopName = undefined;
            };

            if (!stop) {
                clearExisting();
                return;
            }

            clearExisting();

            const createAndShowOverlay = () => {
                // container element where we'll mount a small React subtree
                const el = document.createElement("div");
                try {
                    // fixed container positioning (body-level)
                    el.style.position = "fixed";
                    el.style.top = "16px";
                    el.style.left = "16px";
                    el.style.right = "16px";
                    el.style.marginLeft = "auto";
                    el.style.marginRight = "auto";
                    el.style.zIndex = "1001";
                    document.body.appendChild(el);

                    const rawName = String(stop.name);

                    // Check if it's a bus key (starts with "bus.")
                    let displayName: string;
                    if (rawName.startsWith("bus.")) {
                        // It's a bus translation key
                        displayName = t(rawName);
                    } else {
                        // It's a bus stop name
                        const translationKey = `busStop.${rawName}`;
                        const translatedName = t(translationKey);

                        // If translation key is returned as-is, use the raw name instead
                        const displayBaseName =
                            translatedName === translationKey
                                ? rawName
                                : translatedName;

                        displayName = displayBaseName;
                        if (DISPLAY_NAME_MAP[rawName]) {
                            const directionKey = DISPLAY_NAME_MAP[
                                rawName
                            ].includes("죽전역")
                                ? "direction.toJukjeon"
                                : "direction.toDKU";
                            displayName = `${displayBaseName} (${t(directionKey)})`;
                        }
                    }

                    // Pre-calculate time labels
                    const time1Label = formatTime(5);
                    const time2Label = formatTime(15);

                    const root = createRoot(el);
                    root.render(
                        <div
                            style={{
                                position: "fixed",
                                top: "40px",
                                left: "16px",
                                right: "16px",
                                zIndex: 10001,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            {/* modal panel positioned at top with 16px horizontal margins */}
                            <button
                                type="button"
                                onClick={() => {
                                    try {
                                        if (overlay) overlay.setMap(null);
                                    } catch {
                                        /* ignore */
                                    }
                                    window.__currentBubbleOverlay = undefined;
                                    window.__currentBubbleStopName = undefined;
                                    if (onClose) onClose();
                                }}
                                style={{
                                    position: "relative",
                                    background: "white",
                                    padding: "12px 14px",
                                    borderRadius: "8px",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                    maxWidth: "450px",
                                    width: "100%",
                                    boxSizing: "border-box",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    border: "none",
                                }}
                            >
                                <X
                                    aria-hidden
                                    size={28}
                                    style={{
                                        position: "absolute",
                                        right: 8,
                                        top: 8,
                                        pointerEvents: "none",
                                    }}
                                />
                                <div style={{ fontWeight: 600 }}>
                                    {displayName}
                                </div>
                                {!rawName.startsWith("bus.") && (
                                    <>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                marginTop: "8px",
                                                fontWeight: 400,
                                                fontSize: "16px",
                                            }}
                                        >
                                            <BusFront
                                                size={16}
                                                color="#f6c341"
                                            />
                                            <span>
                                                <span
                                                    style={{
                                                        color: "#f6c341",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    24
                                                </span>
                                                <span style={{ marginLeft: 8 }}>
                                                    | {time1Label}
                                                </span>
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                marginTop: "6px",
                                                fontWeight: 400,
                                                fontSize: "16px",
                                            }}
                                        >
                                            <BusFront
                                                size={16}
                                                color="#7dd3fc"
                                            />
                                            <span>
                                                <span
                                                    style={{
                                                        color: "#7dd3fc",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    720-3
                                                </span>
                                                <span style={{ marginLeft: 8 }}>
                                                    | {time2Label}
                                                </span>
                                            </span>
                                        </div>
                                    </>
                                )}
                            </button>
                        </div>
                    );

                    overlay = {
                        setMap: (m: Window["map"] | null) => {
                            if (m === null) {
                                try {
                                    Promise.resolve().then(() => {
                                        try {
                                            root.unmount();
                                            if (el.parentElement) el.remove();
                                        } catch {
                                            /* ignore */
                                        }
                                    });
                                } catch {
                                    /* ignore */
                                }
                            }
                        },
                    } as Window["__currentBubbleOverlay"];

                    window.__currentBubbleOverlay = overlay;
                    window.__currentBubbleStopName = stop.name;
                } catch {
                    /* ignore */
                } finally {
                    // If overlay creation failed before assigning `overlay`, ensure element is removed.
                    try {
                        if (!overlay && el.parentElement) el.remove();
                    } catch {
                        /* ignore */
                    }
                }
            };
            // Show immediately when stop is set (triggered by button click); do not wait for map idle/pan.
            try {
                createAndShowOverlay();
            } catch {
                /* ignore */
            }
        } catch {
            /* ignore */
        }

        return () => {
            try {
                if (overlay) overlay.setMap(null);
            } catch {
                /* ignore */
            }
            window.__currentBubbleOverlay = undefined;
            window.__currentBubbleStopName = undefined;
        };
    }, [stop, onClose, t, formatTime]);

    return null;
}
