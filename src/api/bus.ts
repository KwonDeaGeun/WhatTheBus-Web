import { useQuery } from "@tanstack/react-query";
import type { Bus } from "../data/bus";
import { apiGet } from "../lib/api";
import { API_ENDPOINTS } from "../lib/endpoints";
import { handleApiError } from "../lib/error";

export const useBusLocations = (onError?: (message: string) => void) => {
    return useQuery({
        queryKey: ["busLocations"],
        queryFn: async () => {
            try {
                const data = await apiGet<Bus[]>(
                    API_ENDPOINTS.SHUTTLE.LOCATIONS
                );
                return Array.isArray(data) ? data : [];
            } catch (error) {
                const errorMessage = await handleApiError(error);
                if (onError) {
                    onError(errorMessage);
                }
                return [];
            }
        },
        refetchInterval: 7000,
        refetchIntervalInBackground: true,
        retry: 2,
    });
};

// Types for arrivals API
export interface ArrivalBus {
    routeName: string;
    minutesLeft: number | null;
    remainingSeats: number | null;
}

export interface ArrivalStop {
    stopCode: string;
    stopName: string;
    buses: ArrivalBus[];
}

export interface ArrivalsResponse {
    updatedAt: string;
    stops: ArrivalStop[];
}

export const useBusArrivals = (onError?: (message: string) => void) => {
    return useQuery({
        queryKey: ["busArrivals"],
        queryFn: async (): Promise<ArrivalsResponse | null> => {
            try {
                const data = await apiGet<ArrivalsResponse>(
                    API_ENDPOINTS.BUS.ARRIVALS
                );
                return data || null;
            } catch (error) {
                const errorMessage = await handleApiError(error);
                if (onError) onError(errorMessage);
                return null;
            }
        },
        refetchInterval: 30000,
        refetchIntervalInBackground: true,
        retry: 2,
    });
};
