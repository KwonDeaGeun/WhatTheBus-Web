export const moveToLocation = (lat: number, lng: number) => {
    if (!window.map || typeof window.kakao === "undefined") return;

    // try to read current center in a few common shapes
    const getCenterCoords = () => {
        try {
            const c = window.map?.getCenter?.();
            if (!c) return null;
            if (
                "getLat" in c &&
                typeof (c as { getLat?: unknown }).getLat === "function"
            ) {
                // Kakao LatLng-like object with getLat/getLng
                return {
                    lat: (c as { getLat: () => number }).getLat(),
                    lng: (c as { getLng: () => number }).getLng(),
                };
            }
            if (
                "lat" in c &&
                typeof (c as { lat?: unknown }).lat === "number"
            ) {
                return {
                    lat: (c as { lat: number }).lat,
                    lng: (c as { lng: number }).lng,
                };
            }
        } catch {
            /* ignore */
        }
        return null;
    };

    const start = getCenterCoords();
    const targetLat = Number(lat);
    const targetLng = Number(lng);

    // if we can't read start center, jump immediately
    if (!start) {
        try {
            window.map?.setCenter(
                new window.kakao.maps.LatLng(targetLat, targetLng)
            );
        } catch {
            // ignore
        }
        return;
    }

    const duration = 500; // ms
    const startTime = performance.now();
    const startLat = start.lat;
    const startLng = start.lng;

    // cancel previous animation if any
    try {
        if (typeof window.__panAnimationId === "number")
            cancelAnimationFrame(window.__panAnimationId);
    } catch {
        /* ignore */
    }

    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

    const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, Math.max(0, elapsed / duration));
        const eased = easeOutCubic(t);
        const curLat = startLat + (targetLat - startLat) * eased;
        const curLng = startLng + (targetLng - startLng) * eased;
        try {
            window.map?.setCenter(new window.kakao.maps.LatLng(curLat, curLng));
        } catch {
            /* ignore */
        }

        if (t < 1) {
            window.__panAnimationId = requestAnimationFrame(step);
        } else {
            try {
                window.__panAnimationId = undefined;
            } catch {
                /* ignore */
            }
        }
    };

    window.__panAnimationId = requestAnimationFrame(step);
};
