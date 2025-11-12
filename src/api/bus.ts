import { useQuery } from "@tanstack/react-query";
import type { Bus } from "../data/bus";
import { apiGet } from "../lib/api";
import { API_ENDPOINTS } from "../lib/endpoints";

export const useBusLocations = () => {
    return useQuery({
        queryKey: ["busLocations"],
        queryFn: async () => {
            const data = await apiGet<Bus[]>(API_ENDPOINTS.BUS.LOCATION);
            return Array.isArray(data) ? data : [];
        },
        refetchInterval: 5000,
        refetchIntervalInBackground: true,
    });
};
