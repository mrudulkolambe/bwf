import API from "@/lib/api";
import APIs from "@/lib/endpoints";
import { PartnerCreateRequest } from "./types/partner.auth.request.types";
import { PartnerAuthResponse } from "./types/partner.auth.response.types";

class PartnerAuthService {
    createPartner = async ({ setLoading, data, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        data: PartnerCreateRequest,
        onSuccess: (data: PartnerAuthResponse) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.post<PartnerAuthResponse>(APIs.partners, data);
        setLoading(false);
        if (response.success) {
            onSuccess(response.data as PartnerAuthResponse);
        } else {
            onError(response.message);
        }
    };

    checkPhone = async ({ setLoading, phoneNumber, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        phoneNumber: string,
        onSuccess: (data: { exists: boolean }) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.post<{ exists: boolean }>(APIs.partnerCheckPhone, { phoneNumber });
        setLoading(false);
        if (response.success) {
            onSuccess(response.data as { exists: boolean });
        } else {
            onError(response.message);
        }
    };

    login = async ({ setLoading, phone, code, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        phone: string,
        code: string,
        onSuccess: (data: PartnerAuthResponse) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.post<PartnerAuthResponse>(APIs.login, { phone, code });
        setLoading(false);
        if (response.success) {
            onSuccess(response.data as PartnerAuthResponse);
        } else {
            onError(response.message);
        }
    };

    updateProfile = async ({ setLoading, data, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        data: any,
        onSuccess: (data: any) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.put<any>(APIs.partnerMe, data);
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
}

export default PartnerAuthService;
