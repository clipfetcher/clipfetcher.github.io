<template>
  <div id="app">
    <b-navbar toggleable type="dark" variant="dark">
      <b-navbar-brand to="/">
        <img
          src="./assets/ClipFetcher.png"
          width="30"
          height="30"
          class="d-inline-block align-top"
          alt="ClipFetcher Logo"
        />
        {{ title }}
      </b-navbar-brand>

      <b-navbar-toggle target="navbar-toggle-collapse">
        <span class="navbar-toggler-icon"></span>
      </b-navbar-toggle>

      <b-collapse id="navbar-toggle-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!isLogin">
            <b-button @click="modalLogin()" size="sm" class="my-2 my-sm-0" variant="info">Login</b-button>
          </b-nav-item>
          <b-nav-item v-else>
            <b-button @click="logout" size="sm" class="my-2 my-sm-0" variant="info">Logout</b-button>
          </b-nav-item>
          <b-nav-item to="/home">Vue Home</b-nav-item>
          <b-nav-item to="/axios">Axios</b-nav-item>
          <b-nav-item to="/test">TestComponent</b-nav-item>
          <b-nav-item to="/admin">Admin</b-nav-item>
          <b-nav-item to="/user">User</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <br />
    <router-view />

    <footer class="mt-3">
      <div class="fixed-bottom">
        <div class="float-right">
          <b-button
            @click="opinionModalShow = !opinionModalShow"
            pill
            variant="info"
            v-b-tooltip.hover
            title="意見回饋"
            class="m-4"
          >
            <i class="fas fa-info-circle fa-lg"></i>
          </b-button>
        </div>
      </div>

      <div class="container">
        <b-modal v-model="opinionModalShow" title="意見回饋" hide-footer>
          <form @submit.prevent="opinion">
            <div class="form-group">
              <label for="mail">電子信箱：</label>
              <input
                type="text"
                class="form-control"
                :class="emailError?'is-invalid':''"
                id="mail"
                v-model="mail"
                aria-describedby="emailHelp"
              />
              <div class="invalid-feedback">{{ emailErrorText }}</div>
              <small id="emailHelp" class="form-text text-muted">我們將會使用這個信箱作為聯絡您的方式</small>
            </div>
            <div class="form-group">
              <label for="content">建議內容：</label>
              <input
                type="text"
                class="form-control"
                :class="contentError?'is-invalid':''"
                placeholder="想要給本系統改善的建議"
                id="content"
                v-model="content"
              />
              <div class="invalid-feedback">建議內容不得為空</div>
            </div>
            <button type="submit" class="btn btn-primary float-right">送出</button>
          </form>
        </b-modal>

        <b-modal v-model="accountModalShow" :title="accountModalTitle" hide-footer>
          <!--登入-->
          <div v-if="accountModalTitle==='登入'">
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="loginAccount">帳號：</label>
                <input
                  type="text"
                  class="form-control"
                  :class="loginAccountError?'is-invalid':''"
                  id="loginAccount"
                  v-model="loginAccount"
                />
                <div class="invalid-feedback">{{ loginAccountErrorText }}</div>
              </div>
              <div class="form-group">
                <label for="loginPassword">密碼：</label>
                <input
                  type="password"
                  class="form-control"
                  :class="loginPasswordError?'is-invalid':''"
                  id="loginPassword"
                  v-model="loginPassword"
                  aria-describedby="loginPasswordHelp"
                />
                <div class="invalid-feedback">{{ loginPasswordErrorText }}</div>
                <small id="loginPasswordHelp" class="form-text">
                  <b-link @click="modalForgotPassword">忘記密碼</b-link>
                </small>
              </div>
              <div class="form-group">
                <span>
                  還沒有帳號嗎？
                  <b-link @click="modalSignup">註冊帳號</b-link>
                </span>
                <div v-if="logging">
                  <div class="spinner-border text-secondary float-right" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
                <div v-else>
                  <button type="submit" class="btn btn-primary float-right">登入</button>
                </div>
              </div>
            </form>
          </div>

          <!--註冊-->
          <div v-else-if="accountModalTitle==='註冊'">
            <div v-if="signupSuccess" class="alert alert-success" role="alert">
              <p class="text-center my-2 py-2">
                <span>驗證信已寄出 請至註冊時填寫的信箱查看!</span>
              </p>
            </div>
            <div v-else>
              <form @submit.prevent="signup">
                <div class="form-group">
                  <span>
                    已經有帳號了嗎？
                    <b-link @click="accountModalTitle='登入'">登入帳號</b-link>
                  </span>
                </div>
                <div v-if="signupFail" class="alert alert-danger" role="alert">
                  <p class="text-center m-0">
                    <span>{{ signupFailText }}</span>
                  </p>
                </div>
                <div class="form-group">
                  <label for="signupAccount">帳號：</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="signupAccountError?'is-invalid':''"
                    id="signupAccount"
                    v-model="signupAccount"
                    @keyup="signupAccountLengthCheck"
                  />
                  <div class="invalid-feedback">{{ signupAccountErrorText }}</div>
                </div>
                <div class="form-group">
                  <label for="signupMail">電子信箱：</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="signupMailError?'is-invalid':''"
                    id="signupMail"
                    v-model="signupMail"
                  />
                  <div class="invalid-feedback">{{ signupMailErrorText }}</div>
                </div>
                <div class="form-group">
                  <label for="signupPassword">設定密碼</label>
                  <input
                    type="password"
                    class="form-control"
                    :class="signupPasswordError?'is-invalid':''"
                    id="signupPassword"
                    v-model="signupPassword"
                    @keyup="signupPasswordLengthCheck"
                  />
                  <div class="invalid-feedback">{{ signupPasswordErrorText }}</div>
                </div>
                <div class="form-group">
                  <label for="signupCheckPassword">確認密碼</label>
                  <input
                    type="password"
                    class="form-control"
                    :class="signupCheckPasswordError?'is-invalid':''"
                    id="signupCheckPassword"
                    v-model="signupCheckPassword"
                    @keyup="signupCheckPasswordSameCheck"
                  />
                  <div class="invalid-feedback">{{ signupCheckPasswordErrorText }}</div>
                </div>
                <div class="form-group">
                  <p class="text-center">
                    點擊註冊及代表您已閱讀並了解
                    <b-link to="/terms-of-service" target="_blank">服務條款</b-link>及
                    <b-link to="/privacy-notice" target="_blank">隱私權聲明</b-link>
                  </p>
                  <div class="text-center">
                    <div v-if="signupping">
                      <div class="spinner-border text-secondary" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                    <div v-else>
                      <button type="submit" class="btn btn-primary">註冊</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!--忘記密碼-->
          <div v-else-if="accountModalTitle==='忘記密碼'">
            <div v-if="forgotPasswordSuccess" class="alert alert-success" role="alert">
              <p class="text-center my-2 py-2">
                <span>驗證信已寄出 請至註冊時填寫的信箱查看!</span>
              </p>
            </div>
            <div v-else>
              <form @submit.prevent="forgotPassword">
                <div class="form-group">
                  <label for="forgotPasswordId">請輸入帳號或電子信箱：</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="forgotPasswordIdError?'is-invalid':''"
                    id="forgotPasswordId"
                    v-model="forgotPasswordId"
                  />
                  <div class="invalid-feedback">{{ forgotPasswordIdErrorText }}</div>
                </div>
                <div class="form-group">
                  <div v-if="forgotPasswordLoading">
                    <div class="spinner-border text-secondary float-right" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                  <div v-else>
                    <button type="submit" class="btn btn-primary float-right">傳送驗證信件</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </b-modal>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      title: "Highlight Clip Fetcher",
      //opinion
      opinionModalShow: false,
      mail: "",
      content: "",
      emailErrorText: "",
      emailError: false,
      contentError: false,

      //account
      accountModalShow: false,
      accountModalTitle: "",
      //account-login
      loginAccount: "",
      loginPassword: "",
      loginAccountErrorText: "",
      loginAccountError: false,
      loginPasswordErrorText: "",
      loginPasswordError: false,
      logging: false,
      //account-signup
      signupAccount: "",
      signupMail: "",
      signupPassword: "",
      signupCheckPassword: "",
      signupAccountErrorText: "",
      signupAccountError: false,
      signupMailErrorText: "",
      signupMailError: false,
      signupPasswordErrorText: "",
      signupPasswordError: false,
      signupCheckPasswordErrorText: "",
      signupCheckPasswordError: false,
      signupSuccess: false,
      signupFail: false,
      signupFailText: "",
      signupping: false,
      //account-forgotPassword
      forgotPasswordId: "",
      forgotPasswordIdErrorText: "",
      forgotPasswordIdError: false,
      forgotPasswordSuccess: false,
      forgotPasswordLoading: false,

      response: null,
      modalResponse: null,
    };
  },
  methods: {
    /*
    btnPlayer(uid) {
      this.$router.push({ path: `/player/${uid}` });
      //this.$router.push({ path: `/player/${uid}/profile` });
      //this.$router.push({ name: "Player", params: { uid: uid } });
      //this.$router.push({ name: "Player", query: { uid: uid } });
      //this.$router.go(-1);
    }
    */
    modalLogin() {
      this.accountModalShow = !this.accountModalShow;
      this.accountModalTitle = "登入";
      this.loginAccount = "";
      this.loginPassword = "";
      this.loginAccountErrorText = "";
      this.loginAccountError = false;
      this.loginPasswordErrorText = "";
      this.loginPasswordError = false;
      this.logging = false;
    },
    modalSignup() {
      this.accountModalTitle = "註冊";
      this.signupAccount = "";
      this.signupMail = "";
      this.signupPassword = "";
      this.signupCheckPassword = "";
      this.signupAccountErrorText = "";
      this.signupAccountError = false;
      this.signupMailErrorText = "";
      this.signupMailError = false;
      this.signupPasswordErrorTex = "";
      this.signupPasswordError = false;
      this.signupCheckPasswordErrorText = "";
      this.signupCheckPasswordError = false;
      this.signupSuccess = false;
      this.signupFail = false;
      this.signupFailText = "";
      this.signupping = false;
    },
    modalForgotPassword() {
      this.accountModalTitle = "忘記密碼";
      this.forgotPasswordId = "";
      this.forgotPasswordIdErrorText = "";
      this.forgotPasswordIdError = false;
      this.forgotPasswordSuccess = false;
      this.forgotPasswordLoading = false;
    },
    opinion: function () {
      let vm = this;
      let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.emailError = false;
      this.contentError = false;
      this.emailErrorText = "";

      if (this.mail == "" || this.mail == null) {
        this.emailError = true;
        this.emailErrorText = "信箱未填寫";
        if (this.content == "" || this.content == null) {
          this.contentError = true;
        }
      } else if (reg.test(this.mail) == false) {
        this.emailError = true;
        this.emailErrorText = "信箱格式不正確";
        if (this.content == "" || this.content == null) {
          this.contentError = true;
        }
      } else if (this.content == "" || this.content == null) {
        this.contentError = true;
      } else {
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/opinion", {
            mail: this.mail,
            content: this.content,
          })
          .then((response) => {
            vm.response = response.status;
          })
          .catch(function (error) {
            console.log(error);
          });
        this.opinionModalShow = !this.opinionModalShow;
        this.mail = "";
        this.content = "";
      }
    },
    login: function () {
      let isValid = true;
      let vm = this;
      this.loginAccountError = false;
      this.loginPasswordError = false;
      this.logging = true;
      if (this.loginAccount.length == 0) {
        this.loginAccountError = true;
        this.loginAccountErrorText = "帳號輸入為空";
        isValid = false;
      }
      if (this.loginPassword.length == 0) {
        this.loginPasswordError = true;
        this.loginPasswordErrorText = "密碼輸入為空";
        isValid = false;
      }
      if (isValid) {
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/user/login", {
            account: this.loginAccount,
            password: this.loginPassword,
          })
          .then((response) => {
            this.loginAccount = "";
            this.loginPassword = "";

            let token = response.data.token;
            this.$store.dispatch("auth/setAuth", {
              token: token,
              isLogin: true,
            });
            this.accountModalShow = false;
            this.logging = false;
          })
          .catch(function (error) {
            console.log(error.response);
            if (error.response) {
              if (error.response.status === 400) {
                vm.loginAccountError = true;
                vm.loginAccountErrorText = "";
                vm.loginPasswordError = true;
                vm.loginPasswordErrorText = "帳號/密碼輸入錯誤";
              } else {
                vm.loginAccountError = true;
                vm.loginAccountErrorText = "";
                vm.loginPasswordError = true;
                vm.loginPasswordErrorText = "登入時發生錯誤 請重新嘗試";
              }
            } else {
              vm.loginAccountError = true;
              vm.loginPasswordError = true;
              vm.loginPasswordErrorText = "系統連線發生錯誤";
            }
            vm.logging = false;
          });
      } else {
        this.logging = false;
      }
    },
    logout() {
      this.$store.dispatch("auth/setAuth", {
        token: "",
        isLogin: false,
      });
      setTimeout(() => {
        this.$router.push({ path: "/" });
      }, 2000);
    },
    signup() {
      let isValid = true;
      let vm = this;
      let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.signupAccountError = false;
      this.signupMailError = false;
      this.signupPasswordError = false;
      this.signupCheckPasswordError = false;
      this.signupping = true;
      if (this.signupAccount.length == 0) {
        this.signupAccountError = true;
        this.signupAccountErrorText = "帳號輸入為空";
        isValid = false;
      } else if (this.signupAccount.length < 4) {
        this.signupAccountError = true;
        this.signupAccountErrorText = "帳號過短。帳號長度請 >= 4";
        isValid = false;
      }
      if (this.signupMail.length == 0) {
        this.signupMailError = true;
        this.signupMailErrorText = "信箱輸入為空";
        isValid = false;
      } else if (reg.test(this.signupMail) == false) {
        this.signupMailError = true;
        this.signupMailErrorText = "信箱格式不正確";
        isValid = false;
      }
      if (this.signupPassword.length == 0) {
        this.signupPasswordError = true;
        this.signupPasswordErrorText = "密碼輸入為空";
        isValid = false;
      } else if (this.signupPassword.length < 8) {
        this.signupPasswordError = true;
        this.signupPasswordErrorText = "密碼過短。密碼長度請 >= 8";
        isValid = false;
      }
      if (this.signupCheckPassword.length == 0) {
        this.signupCheckPasswordError = true;
        this.signupCheckPasswordErrorText = "確認密碼輸入為空";
        isValid = false;
      } else if (this.signupPassword != this.signupCheckPassword) {
        this.signupCheckPasswordError = true;
        this.signupCheckPasswordErrorText = "密碼不相符。請再試一次";
        isValid = false;
      }
      if (isValid) {
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/user/signup", {
            account: this.signupAccount,
            email: this.signupMail,
            password: this.signupPassword,
          })
          .then(() => {
            this.signupAccount = "";
            this.signupMail = "";
            this.signupPassword = "";
            this.signupCheckPassword = "";
            this.signupping = false;
            this.signupSuccess = true;
          })
          .catch(function (error) {
            console.log(error);
            vm.signupAccount = "";
            vm.signupMail = "";
            vm.signupPassword = "";
            vm.signupCheckPassword = "";
            vm.signupping = false;
            if (error.response) {
              if (
                error.response.status === 400 &&
                error.response.data === "accountDuplicate"
              ) {
                vm.signupFailText = "此帳號已被註冊!";
              } else if (
                error.response.status === 400 &&
                error.response.data === "emailDuplicate"
              ) {
                vm.signupFailText = "此信箱已被註冊!";
              } else {
                vm.signupFailText = "註冊時發生錯誤 請重新嘗試";
              }
            } else {
              vm.signupFailText = "系統連線發生錯誤";
            }
            vm.signupFail = true;
          });
      } else {
        this.signupping = false;
      }
    },
    signupAccountLengthCheck() {
      if (this.signupAccount.length == 0) {
        this.signupAccountError = true;
        this.signupAccountErrorText = "帳號輸入為空";
      } else if (this.signupAccount.length < 4) {
        this.signupAccountError = true;
        this.signupAccountErrorText = "帳號過短。帳號長度請 >= 4";
      } else {
        this.signupAccountError = false;
      }
    },
    signupPasswordLengthCheck() {
      if (this.signupPassword.length == 0) {
        this.signupPasswordError = true;
        this.signupPasswordErrorText = "密碼輸入為空";
      } else if (this.signupPassword.length < 8) {
        this.signupPasswordError = true;
        this.signupPasswordErrorText = "密碼過短。密碼長度請 >= 8";
      } else {
        this.signupPasswordError = false;
      }
    },
    signupCheckPasswordSameCheck() {
      if (this.signupPassword != this.signupCheckPassword) {
        this.signupCheckPasswordError = true;
        this.signupCheckPasswordErrorText = "密碼不相符";
      } else {
        this.signupCheckPasswordError = false;
      }
    },
    forgotPassword() {
      let vm = this;
      if (this.forgotPasswordId.length == 0) {
        this.forgotPasswordIdError = true;
        this.forgotPasswordIdErrorText = "帳號或電子信箱輸入為空";
      } else {
        this.forgotPasswordIdError = false;
      }
      if (!this.forgotPasswordIdError) {
        this.forgotPasswordLoading = true;
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/user/forgetPassword", {
            email_account: this.forgotPasswordId,
          })
          .then(() => {
            this.forgotPasswordId = "";
            this.forgotPasswordSuccess = true;
            this.forgotPasswordLoading = false;
          })
          .catch(function (error) {
            vm.forgotPasswordLoading = false;
            vm.forgotPasswordIdError = true;
            if (error.response) {
              if (
                error.response.status === 400 &&
                error.response.data == "email_accountError"
              ) {
                vm.forgotPasswordIdErrorText = "帳號或電子信箱輸入不存在";
              } else {
                vm.forgotPasswordIdErrorText = "發生錯誤 請重新嘗試";
              }
            } else {
              vm.forgotPasswordIdErrorText = "系統連線發生錯誤";
            }
            vm.forgotPasswordSuccess = false;
          });
      }
    },
  },
  computed: {
    isLogin: function () {
      return this.$store.state.auth.isLogin;
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#app {
  font-family: "Noto Sans TC", Avenir, Helvetica, Arial, sans-serif;
}
</style>
