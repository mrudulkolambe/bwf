const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

const apiBuilder = (path: string) => {
    const base = ""
    const apiBase = base.includes('localhost') ? `${base}/api` : `/api`;
    const finalURL = `${apiBase}${path}`
    return finalURL
};

const APIs = {
    login: apiBuilder('/partners/login'),
    partners: apiBuilder('/partners'),
    partnerCheckPhone: apiBuilder('/partners/check-phone'),
    partnerMe: apiBuilder('/partners/me'),
    partnerBusiness: apiBuilder('/partners/business'),
    partnerVerifyCode: apiBuilder('/partners/verify-code'),
    categories: apiBuilder('/categories')
}

export default APIs
