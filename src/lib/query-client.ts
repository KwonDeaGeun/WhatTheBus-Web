import { QueryClient } from "@tanstack/react-query";
import { handleApiError } from "./error";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
        },
        mutations: {
            onError: async (error: unknown) => {
                const message = await handleApiError(error);
                console.error("Mutation Error:", message);
            },
        },
    },
});
