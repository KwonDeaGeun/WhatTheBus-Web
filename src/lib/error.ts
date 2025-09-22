import { HTTPError } from "ky";

export interface ApiErrorResponse {
    message: string;
    code?: string;
    details?: unknown;
}

export const handleApiError = async (error: unknown): Promise<string> => {
    if (error instanceof HTTPError) {
        const errorData = (await error.response.json()) as ApiErrorResponse;

        if (errorData?.message) {
            return errorData.message;
        }

        switch (error.response.status) {
            case 400:
                return "잘못된 요청입니다.";
            case 401:
                return "인증이 필요합니다.";
            case 403:
                return "접근 권한이 없습니다.";
            case 404:
                return "요청한 리소스를 찾을 수 없습니다.";
            case 409:
                return "중복된 데이터입니다.";
            case 422:
                return "입력 데이터를 확인해주세요.";
            case 429:
                return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
            case 500:
                return "서버 오류가 발생했습니다.";
            default:
                return "알 수 없는 오류가 발생했습니다.";
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "알 수 없는 오류가 발생했습니다.";
};
