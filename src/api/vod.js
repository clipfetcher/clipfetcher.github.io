import req from "./http.js"

export const apiGetHighlightPlayList = params => req("get", "/vod/highlight_playlist", params);
export const apiManualEditor = params => req("post", "/vod/manualEditor", params);
export const apiHighlightCreate = params => req("post", "/vod", params);
export const apiHighlightSearch = params => req("get", "/vod/highlight", params);
export const apiHighlightAppraise = params => req("post", "/vod/appraise", params);