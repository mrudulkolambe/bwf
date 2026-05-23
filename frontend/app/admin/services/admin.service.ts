import API from "@/lib/api";
import APIs from "@/lib/endpoints";
import { Partner } from "./types/partner.response.types";

class AdminService {
    getPartners = async ({ setLoading, search, category, status, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        search?: string,
        category?: string,
        status?: string,
        onSuccess: (data: Partner[]) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (category && category !== 'all') params.category = category;
        if (status && status !== 'all') params.status = status;

        const response = await API.get<Partner[]>(APIs.adminPartners, params);
        setLoading(false);
        if (response.success) {
            onSuccess(response.data as Partner[]);
        } else {
            onError(response.message);
        }
    };

    togglePartnerVerification = async ({ setLoading, id, completed, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        id: string,
        completed: boolean,
        onSuccess: (data: Partner) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.patch<Partner>(APIs.adminPartnerById(id), { completed });
        setLoading(false);
        if (response.success) {
            onSuccess(response.data as Partner);
        } else {
            onError(response.message);
        }
    };

    deletePartner = async ({ setLoading, id, onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        id: string,
        onSuccess: (data: Partner) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.delete<Partner>(APIs.adminPartnerById(id));
        setLoading(false);
        if (response.success) {
            onSuccess(response.data as Partner);
        } else {
            onError(response.message);
        }
    };
}

export default AdminService;
