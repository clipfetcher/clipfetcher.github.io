import req from "./http.js"

export const apiopinion = params => req("post", "/opinion", params);