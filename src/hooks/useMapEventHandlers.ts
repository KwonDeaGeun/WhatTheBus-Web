import { useEffect } from "react";

export const useMapEventHandlers = (mapId: string) => {
    useEffect(() => {
        const isRN = !!window.ReactNativeWebView;
        const selfOrigin = location.protocol.startsWith("http")
            ? location.origin
            : undefined;
        const allowedOrigins = new Set([
            ...(selfOrigin ? [selfOrigin] : []),
            "http://localhost:3000",
            "http://localhost:5173",
        ]);

        const messageHandler = (event: MessageEvent) => {
            // RN(WebView)에서만 origin === "null" 허용
            if (
                !(isRN && event.origin === "null") &&
                !allowedOrigins.has(event.origin)
            )
                return;
        };

        const containerEl = document.getElementById(mapId);
        const gestureHandler = (e: Event) => {
            const t = e.target as HTMLElement | null;
            if (containerEl && t && containerEl.contains(t) && e.cancelable)
                e.preventDefault();
        };
        const touchMoveHandler = (e: TouchEvent) => {
            if (
                containerEl &&
                e.target &&
                containerEl.contains(e.target as Node)
            )
                e.preventDefault();
        };

        window.addEventListener("message", messageHandler);
        document.addEventListener("gesturestart", gestureHandler, {
            passive: false,
        });
        containerEl?.addEventListener("touchmove", touchMoveHandler, {
            passive: false,
        });

        return () => {
            window.removeEventListener("message", messageHandler);
            document.removeEventListener("gesturestart", gestureHandler);
            containerEl?.removeEventListener("touchmove", touchMoveHandler);
        };
    }, [mapId]);
};
