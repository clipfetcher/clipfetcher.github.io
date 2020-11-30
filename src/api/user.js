import req from "./http.js"

export const apiUserLogin = params => req("post", "/user/login", params);
export const apiUserSignup = params => req("post", "/user/signup", params);
export const apiUserVerify = token => req("post", "/user/verify/" + token);
export const apiUserLogout = params => req("post", "/user/logout", params);
export const apiUserForgetPassword = params => req("post", "/user/forgetPassword", params);
export const apiUserUpdatePassword = params => req("post", "/user/updatePassword", params);
export const apiUserUpdatePassword = params => req("post", "/user", params);