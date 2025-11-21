import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../lib/api";
import { API_ENDPOINTS } from "../lib/endpoints";
import { handleApiError } from "../lib/error";
import type { ArrivalsResponse, Shuttle } from "../types/bus";

export const useBusLocations = (onError?: (message: string) => void) => {
    return useQuery({
        queryKey: ["busLocations"],
        queryFn: async () => {
            try {
                const data = await apiGet<Shuttle[]>(
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
        refetchInterval: 20000,
        refetchIntervalInBackground: true,
        retry: 2,
    });
};
