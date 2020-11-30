import req from "./http.js"

export const apiAdminHighlightReanalysis = params => req("post", "/admin/highlightReanalysis", params);
export const apiAdminHighlightEdit = params => req("post", "/admin/highlightEdit", params);
export const apiAdminHighlightDelete = params => req("post", "/admin/highlightDelete", params);
export const apiAdminHighlightAppraise = params => req("get", "/admin/highlightAppraise", params);
export const apiAdminUserList = params => req("get", "/admin/users", params);