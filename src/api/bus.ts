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
                const data = await apiGet<Bus[]>(API_ENDPOINTS.BUS.LOCATION);
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
