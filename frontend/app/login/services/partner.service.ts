import API from "@/lib/api";
import APIs from "@/lib/endpoints";

class PartnerService {
    updateBusinessDetails = async ({ setLoading, data, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        data: any,
        onSuccess: (data: any) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.put<any>(APIs.partnerBusiness, data);
        setLoading(false);
        if (response.success) {
            onSuccess(response.data);
        } else {
            onError(response.message);
        }
    };

    getProfile = async ({ setLoading, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        onSuccess: (data: any) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.get<any>(APIs.partnerMe);
        setLoading(false);
        if (response.success) {
            onSuccess(response.data);
        } else {
            onError(response.message);
        }
    };

    verifyCode = async ({ setLoading, code, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        code: string,
        onSuccess: (data: any) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.post<any>(APIs.partnerVerifyCode, { code });
        setLoading(false);
        if (response.success) {
            onSuccess(response.data);
        } else {
            onError(response.message);
        }
    };
}

export default PartnerService;
