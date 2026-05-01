import API from "@/lib/api";
import { PartnerCreateRequest } from "./types/partner.auth.request.types";
import { PartnerAuthResponse } from "./types/partner.auth.response.types";
import APIs from "@/lib/endpoints";

export interface ServiceOptions<T> {
    setLoading?: (loading: boolean) => void;
    onSuccess?: (data: T) => void;
    onError?: (message: string) => void;
}

export class PartnerAuthService {
    private static async handleRequest<T>(
        request: Promise<any>,
        options?: ServiceOptions<T>
    ) {
        const { setLoading, onSuccess, onError } = options || {};
        setLoading?.(true);
        try {
            const response = await request;
            if (response.success) {
                onSuccess?.(response.data);
            } else {
                onError?.(response.message);
            }
            return response;
        } catch (error: any) {
            onError?.(error.message || "An error occurred");
            return { success: false, message: error.message, data: null };
        } finally {
            setLoading?.(false);
        }
    }

    static async createPartner(data: PartnerCreateRequest, options?: ServiceOptions<PartnerAuthResponse>) {
        return this.handleRequest(API.post<PartnerAuthResponse>(APIs.partners, data), options);
    }

    static async checkPhone(phoneNumber: string, options?: ServiceOptions<{ exists: boolean }>) {
        return this.handleRequest(API.post<{ exists: boolean }>(APIs.partnerCheckPhone, { phone: phoneNumber }), options);
    }

    static async login(phone: string, code: string, options?: ServiceOptions<PartnerAuthResponse>) {
        return this.handleRequest(API.post<PartnerAuthResponse>(APIs.login, { phone, code }), options);
    }
}
