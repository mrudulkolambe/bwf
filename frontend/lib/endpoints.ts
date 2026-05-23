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
    categories: apiBuilder('/categories'),
    adminLogin: apiBuilder('/admin/login'),
    adminPartners: apiBuilder('/admin/partners'),
    adminPartnerById: (id: string) => apiBuilder(`/admin/partners/${id}`)
}

export default APIs
