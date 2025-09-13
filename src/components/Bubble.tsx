import { useEffect } from "react";

type Stop = { lat: number; lng: number; name: string };

type Props = {
    stop?: Stop;
    onClose?: () => void;
};

export default function Bubble({ stop, onClose }: Props) {
    useEffect(() => {
        if (typeof window.kakao === "undefined" || !window.map) return;

        let overlay: Window["__currentBubbleOverlay"] | undefined;
        let idleHandler: (() => void) | undefined;
        const map = window.map;

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
                try {
                    const el = document.createElement("div");
                    el.style.background = "white";
                    el.style.padding = "8px 10px";
                    el.style.borderRadius = "6px";
                    el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                    el.style.fontSize = "14px";
                    el.style.fontWeight = "600";
                    el.style.cursor = "pointer";
                    // keep text on one line but allow the element to size to content
                    el.style.whiteSpace = "nowrap";
                    el.style.display = "inline-block";
                    el.style.width = "auto";
                    el.style.maxWidth = "none";
                    el.style.overflow = "visible";
                    el.style.boxSizing = "border-box";
                    el.style.zIndex = "200";
                    el.textContent = stop.name;

                    el.onclick = () => {
                        try {
                            if (overlay) overlay.setMap(null);
                        } catch {
                            /* ignore */
                        }
                        window.__currentBubbleOverlay = undefined;
                        window.__currentBubbleStopName = undefined;
                        if (onClose) onClose();
                    };
                    el.style.transform = "translateY(-40px)";

                    overlay = new window.kakao.maps.CustomOverlay({
                        position: new window.kakao.maps.LatLng(
                            stop.lat,
                            stop.lng
                        ),
                        content: el,
                        yAnchor: 1,
                        offset: new window.kakao.maps.Size(0, 0),
                    });
                    overlay.setMap(map);

                    setTimeout(() => {
                        try {
                            // Use the created element directly to avoid relying on overlay's runtime API
                            const elToStyle = el;
                            elToStyle.style.position = "relative";
                            elToStyle.style.zIndex = "100";
                            elToStyle.style.overflow = "visible";
                            if (elToStyle.parentElement) {
                                elToStyle.parentElement.style.position =
                                    "relative";
                                elToStyle.parentElement.style.zIndex = "100";
                                // Ensure the wrapper doesn't clip the bubble
                                elToStyle.parentElement.style.overflow =
                                    "visible";
                            }
                        } catch {
                            /* ignore */
                        }
                    }, 30);

                    window.__currentBubbleOverlay = overlay;
                    window.__currentBubbleStopName = stop.name;
                } catch {
                    /* ignore */
                }
            };

            // Wait until the map finishes moving (idle) before showing the bubble.
            // Register a one-time 'idle' listener and, after the idle event,
            // wait for any custom pan animation (__panAnimationId) to finish
            // before actually creating the overlay.
            try {
                if (
                    window.kakao?.maps?.event &&
                    typeof window.kakao?.maps?.event?.addListener === "function"
                ) {
                    idleHandler = () => {
                        try {
                            if (window.kakao?.maps?.event && idleHandler) {
                                window.kakao.maps.event.removeListener(
                                    map,
                                    "idle",
                                    idleHandler
                                );
                            }
                        } catch {
                            /* ignore */
                        }
                        const waitForPanToFinish = () => {
                            if (typeof window.__panAnimationId === "number") {
                                // animation still running; check next frame
                                requestAnimationFrame(waitForPanToFinish);
                                return;
                            }
                            // small timeout to ensure map settled, then show
                            setTimeout(() => {
                                try {
                                    createAndShowOverlay();
                                } catch {
                                    /* ignore */
                                }
                            }, 0);
                        };
                        waitForPanToFinish();
                    };
                    window.kakao.maps.event.addListener(
                        map,
                        "idle",
                        idleHandler
                    );
                } else {
                    // Fallback: wait for any pan animation to finish, then show
                    const waitForPanAndShow = () => {
                        const waiter = () => {
                            if (typeof window.__panAnimationId === "number") {
                                requestAnimationFrame(waiter);
                                return;
                            }
                            try {
                                createAndShowOverlay();
                            } catch {
                                /* ignore */
                            }
                        };
                        waiter();
                    };
                    waitForPanAndShow();
                }
            } catch {
                // If listener registration fails, fallback to waiting for pan to finish and show
                try {
                    const waiter = () => {
                        if (typeof window.__panAnimationId === "number") {
                            requestAnimationFrame(waiter);
                            return;
                        }
                        createAndShowOverlay();
                    };
                    waiter();
                } catch {
                    /* ignore */
                }
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
            try {
                if (idleHandler && window.kakao?.maps?.event) {
                    window.kakao.maps.event.removeListener(
                        map,
                        "idle",
                        idleHandler
                    );
                }
            } catch {
                /* ignore */
            }
            window.__currentBubbleOverlay = undefined;
            window.__currentBubbleStopName = undefined;
        };
    }, [stop, onClose]);

    return null;
}
