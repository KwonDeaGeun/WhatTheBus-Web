import ky from "ky";

const apiClient = ky.create({
    prefixUrl: import.meta.env.VITE_API_BASE_URL || "",
    timeout: 10000,
});

export const apiGet = async <T, P = undefined>(
    url: string,
    params?: P
): Promise<T> => {
    const response = await apiClient.get(url, {
        searchParams: params as Record<string, string | number | boolean>,
    });
    return response.json<T>();
};
