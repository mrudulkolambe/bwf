import API from "@/lib/api";
import APIs from "@/lib/endpoints";
import { AdminAuthResponse } from "./types/admin.auth.response.types";
import { setToken, clearToken } from "@/lib/token";

class AdminAuthService {
    requestOTP = async ({ setLoading, phone, email, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        phone: string,
        email: string,
        onSuccess: (message: string) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.post<any>(APIs.adminLogin, { phone, email });
        setLoading(false);
        if (response.success) {
            onSuccess(response.message);
        } else {
            onError(response.message);
        }
    };

    verifyOTP = async ({ setLoading, phone, email, code, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        phone: string,
        email: string,
        code: string,
        onSuccess: (data: AdminAuthResponse) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.post<AdminAuthResponse>(APIs.adminLogin, { phone, email, code });
        setLoading(false);
        if (response.success) {
            if (response.data?.token) {
                setToken(response.data.token);
            }
            onSuccess(response.data as AdminAuthResponse);
        } else {
            onError(response.message);
        }
    };

    logout = () => {
        clearToken();
    };
}

export default AdminAuthService;
