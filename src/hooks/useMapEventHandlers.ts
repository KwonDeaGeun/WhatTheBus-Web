import { useEffect } from "react";

export const useMapEventHandlers = (mapId: string) => {
    useEffect(() => {
        const containerEl = document.getElementById(mapId);
        const gestureHandler = (e: Event) => {
            const t = e.target as HTMLElement | null;
            if (containerEl && t && containerEl.contains(t) && e.cancelable)
                e.preventDefault();
        };

        document.addEventListener("gesturestart", gestureHandler, {
            passive: false,
        });

        return () => {
            document.removeEventListener("gesturestart", gestureHandler);
        };
    }, [mapId]);
};
