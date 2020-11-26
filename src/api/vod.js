import req from "./http.js"

export const apiGetHighlightPlayList = params => req("get", "/vod/highlight_playlist", params);