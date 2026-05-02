import API from "@/lib/api";
import APIs from "@/lib/endpoints";
import { CategoryResponse } from "./types/category.response.types";

class CategoryService {
    getCategories = async ({ setLoading, lang = 'en', onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        lang?: string,
        onSuccess: (data: CategoryResponse[]) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.get<CategoryResponse[]>(`${APIs.categories}?lang=${lang}`);
        setLoading(false);
        if (response.success) {
            onSuccess(response.data as CategoryResponse[]);
        } else {
            onError(response.message);
        }
    };

    getTags = async ({ setLoading, categoryId, lang = 'en', onSuccess, onError }: {
        setLoading: (loading: boolean) => void,
        categoryId: string,
        lang?: string,
        onSuccess: (data: any[]) => void,
        onError: (message: string) => void
    }) => {
        setLoading(true);
        const response = await API.get<any[]>(`${APIs.categories}/${categoryId}/tags?lang=${lang}`);
        setLoading(false);
        if (response.success) {
            onSuccess(response.data as any[]);
        } else {
            onError(response.message);
        }
    };
}

export default CategoryService;
