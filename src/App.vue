<template>
  <div id="app">
    <b-navbar class="py-1" toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand to="/">
        <img
          src="./assets/ClipFetcher.png"
          width="30"
          height="30"
          class="d-inline-block my-0 mr-1"
          alt="ClipFetcher Logo"
        />
        {{ title }}
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown class="mx-1" right>
            <template v-slot:button-content>
              <em>其他頁面</em>
            </template>
            <b-dropdown-item to="/home">Vue Home</b-dropdown-item>
            <b-dropdown-item to="/axios">Axios</b-dropdown-item>
            <b-dropdown-item to="/test">TestComponent</b-dropdown-item>
            <b-dropdown-item to="/admin">Admin</b-dropdown-item>
            <b-dropdown-item to="/user">User</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-form v-if="!isLogin"
            ><b-button @click="modalLogin()" variant="info"
              ><i class="fas fa-sign-in-alt mr-2"></i>登入</b-button
            ></b-nav-form
          >

          <b-nav-item-dropdown class="mx-1" right v-if="isLogin">
            <template v-slot:button-content>
              <em>會員</em>
            </template>
            <b-dropdown-item @click="modalSetting()"
              ><i class="fas fa-cog mr-1"></i>設定</b-dropdown-item
            >
            <b-dropdown-item @click="logout()"
              ><i class="fas fa-sign-out-alt mr-1"></i>登出</b-dropdown-item
            >
          </b-nav-item-dropdown>
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
                :class="emailError ? 'is-invalid' : ''"
                id="mail"
                v-model="mail"
                aria-describedby="emailHelp"
              />
              <div class="invalid-feedback">{{ emailErrorText }}</div>
              <small id="emailHelp" class="form-text text-muted"
                >我們將會使用這個信箱作為聯絡您的方式</small
              >
            </div>
            <div class="form-group">
              <label for="content">建議內容：</label>
              <input
                type="text"
                class="form-control"
                :class="contentError ? 'is-invalid' : ''"
                placeholder="想要給本系統改善的建議"
                id="content"
                v-model="content"
                maxlength="50"
              />
              <div class="invalid-feedback">建議內容不得為空</div>
            </div>
            <button type="submit" class="btn btn-primary float-right">
              送出
            </button>
          </form>
        </b-modal>

        <b-modal
          v-model="accountModalShow"
          :title="accountModalTitle"
          hide-footer
        >
          <!--登入-->
          <div v-if="accountModalTitle === '登入'">
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="loginAccount">帳號：</label>
                <input
                  type="text"
                  class="form-control"
                  :class="loginAccountError ? 'is-invalid' : ''"
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
                  :class="loginPasswordError ? 'is-invalid' : ''"
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
                  <div
                    class="spinner-border text-secondary float-right"
                    role="status"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
                <div v-else>
                  <button type="submit" class="btn btn-primary float-right">
                    登入
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!--註冊-->
          <div v-else-if="accountModalTitle === '註冊'">
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
                    <b-link @click="accountModalTitle = '登入'"
                      >登入帳號</b-link
                    >
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
                    :class="signupAccountError ? 'is-invalid' : ''"
                    id="signupAccount"
                    v-model="signupAccount"
                    @keyup="signupAccountLengthCheck"
                  />
                  <div class="invalid-feedback">
                    {{ signupAccountErrorText }}
                  </div>
                </div>
                <div class="form-group">
                  <label for="signupMail">電子信箱：</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="signupMailError ? 'is-invalid' : ''"
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
                    :class="signupPasswordError ? 'is-invalid' : ''"
                    id="signupPassword"
                    v-model="signupPassword"
                    @keyup="signupPasswordLengthCheck"
                  />
                  <div class="invalid-feedback">
                    {{ signupPasswordErrorText }}
                  </div>
                </div>
                <div class="form-group">
                  <label for="signupCheckPassword">確認密碼</label>
                  <input
                    type="password"
                    class="form-control"
                    :class="signupCheckPasswordError ? 'is-invalid' : ''"
                    id="signupCheckPassword"
                    v-model="signupCheckPassword"
                    @keyup="signupCheckPasswordSameCheck"
                  />
                  <div class="invalid-feedback">
                    {{ signupCheckPasswordErrorText }}
                  </div>
                </div>
                <div class="form-group">
                  <p class="text-center">
                    點擊註冊及代表您已閱讀並了解
                    <b-link to="/terms-of-service" target="_blank"
                      >服務條款</b-link
                    >及
                    <b-link to="/privacy-notice" target="_blank"
                      >隱私權聲明</b-link
                    >
                  </p>
                  <div class="text-center">
                    <div v-if="signupping">
                      <div class="spinner-border text-secondary" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                    <div v-else>
                      <button type="submit" class="btn btn-primary">
                        註冊
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!--忘記密碼-->
          <div v-else-if="accountModalTitle === '忘記密碼'">
            <div
              v-if="forgotPasswordSuccess"
              class="alert alert-success"
              role="alert"
            >
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
                    :class="forgotPasswordIdError ? 'is-invalid' : ''"
                    id="forgotPasswordId"
                    v-model="forgotPasswordId"
                  />
                  <div class="invalid-feedback">
                    {{ forgotPasswordIdErrorText }}
                  </div>
                </div>
                <div class="form-group">
                  <div v-if="forgotPasswordLoading">
                    <div
                      class="spinner-border text-secondary float-right"
                      role="status"
                    >
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                  <div v-else>
                    <button type="submit" class="btn btn-primary float-right">
                      傳送驗證信件
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!--設定-->
          <div v-else-if="accountModalTitle === '設定'">
            <div v-if="accountSettingLoading">
              <div
                class="spinner-border text-secondary float-right"
                role="status"
              >
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <div v-else>
              <b-form>
                <b-form-group label="帳號">
                  <b-form-input
                    v-model="accountSettingForm.account"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-form-group label="電子信箱">
                  <b-form-input
                    v-model="accountSettingForm.email"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-button variant="primary" @click="modalUpdatePassword()"
                  >修改密碼</b-button
                >
              </b-form>
            </div>
          </div>

          <!--修改密碼-->
          <div v-else-if="accountModalTitle === '修改密碼'">
            <form @submit.prevent="updatePassword()">
              <div class="form-group">
                <span>
                  <b-link @click="accountModalTitle = '設定'"
                    ><i class="fas fa-chevron-left mr-2"></i>返回</b-link
                  >
                </span>
              </div>

              <div class="form-group">
                <label for="updatePasswordFormOldPassword">舊密碼</label>
                <input
                  v-model="updatePasswordForm.oldPassword"
                  type="password"
                  id="updatePasswordFormOldPassword"
                  class="form-control"
                  :class="
                    updatePasswordForm.oldPasswordError ? 'is-invalid' : ''
                  "
                />
                <div class="invalid-feedback">
                  {{ updatePasswordForm.oldPasswordErrorText }}
                </div>
              </div>

              <div class="form-group">
                <label for="updatePasswordFormNewPassword">設定新密碼</label>
                <input
                  v-model="updatePasswordForm.newPassword"
                  type="password"
                  id="updatePasswordFormNewPassword"
                  class="form-control"
                  :class="
                    updatePasswordForm.newPasswordError ? 'is-invalid' : ''
                  "
                  @keyup="updatePasswordNewPasswordLengthCheck()"
                />
                <div class="invalid-feedback">
                  {{ updatePasswordForm.newPasswordErrorText }}
                </div>
              </div>

              <div class="form-group">
                <label for="updatePasswordFormCheckNewPassword"
                  >確認新密碼</label
                >
                <input
                  v-model="updatePasswordForm.checkNewPassword"
                  type="password"
                  id="updatePasswordFormCheckNewPassword"
                  class="form-control"
                  :class="
                    updatePasswordForm.checkNewPasswordError ? 'is-invalid' : ''
                  "
                  @keyup="updatePasswordCheckNewPasswordSameCheck()"
                />
                <div class="invalid-feedback">
                  {{ updatePasswordForm.checkNewPasswordErrorText }}
                </div>
              </div>

              <div v-if="updatePasswordLoading">
                <div
                  class="spinner-border text-secondary float-right"
                  role="status"
                >
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <div v-else>
                <b-button type="submit" variant="primary" class="float-right"
                  >修改密碼</b-button
                >
              </div>
            </form>
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
      //account-setting
      accountSettingLoading: true,
      accountSettingForm: {
        account: "",
        email: "",
      },
      //account-updatePassword
      updatePasswordLoading: false,
      updatePasswordForm: {
        oldPassword: "",
        oldPasswordError: false,
        oldPasswordErrorText: "",
        newPassword: "",
        newPasswordError: false,
        newPasswordErrorText: "",
        checkNewPassword: "",
        checkNewPasswordError: false,
        checkNewPasswordErrorText: "",
      },

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
    modalSetting() {
      this.accountModalShow = !this.accountModalShow;
      this.accountModalTitle = "設定";
      this.accountSettingLoading = true;
      this.setting();
    },
    modalUpdatePassword() {
      this.accountModalTitle = "修改密碼";
      this.updatePasswordLoading = false;
      this.updatePasswordForm = {
        oldPassword: "",
        oldPasswordError: false,
        oldPasswordErrorText: "",
        newPassword: "",
        newPasswordError: false,
        newPasswordErrorText: "",
        checkNewPassword: "",
        checkNewPasswordError: false,
        checkNewPasswordErrorText: "",
      };
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
      if (this.$router.currentRoute.path != "/") {
        this.$router.push({ path: "/" });
      } else {
        this.$router.go(0);
      }
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
    setting() {
      let vm = this;
      this.axios
        .get(process.env.VUE_APP_ROOT_API + "/api/user", {
          params: {
            token: this.$store.state.auth.token,
          },
        })
        .then((response) => {
          this.accountSettingForm = response.data;
          this.accountSettingLoading = false;
        })
        .catch(function (error) {
          vm.accountSettingLoading = false;
          if (error.response) {
            if (
              error.response.status === 401 ||
              error.response.status === 400
            ) {
              vm.accountSettingForm.account = error.response.data;
            } else {
              vm.accountSettingForm.account = "獲取資料發生錯誤";
            }
          } else {
            vm.accountSettingForm.account = "獲取資料發生錯誤";
          }
        });
    },
    updatePassword() {
      let vm = this;
      let isValid = true;
      if (this.updatePasswordForm.oldPassword.length == 0) {
        this.updatePasswordForm.oldPasswordError = true;
        this.updatePasswordForm.oldPasswordErrorText = "舊密碼輸入為空";
        isValid = false;
      }
      if (
        this.updatePasswordForm.newPassword ==
        this.updatePasswordForm.oldPassword
      ) {
        this.updatePasswordForm.newPasswordError = true;
        this.updatePasswordForm.checkNewPasswordError = true;
        this.updatePasswordForm.newPasswordErrorText = "新密碼與舊密碼相同";
        isValid = false;
      }
      if (this.updatePasswordForm.newPassword.length == 0) {
        this.updatePasswordForm.newPasswordError = true;
        this.updatePasswordForm.newPasswordErrorText = "新密碼輸入為空";
        isValid = false;
      } else if (this.updatePasswordForm.newPassword.length < 8) {
        this.updatePasswordForm.newPasswordError = true;
        this.updatePasswordForm.newPasswordErrorText =
          "新密碼過短。密碼長度請 >= 8";
        isValid = false;
      }
      if (this.updatePasswordForm.checkNewPassword.length == 0) {
        this.updatePasswordForm.checkNewPasswordError = true;
        this.updatePasswordForm.checkNewPasswordErrorText =
          "確認新密碼輸入為空";
        isValid = false;
      } else if (
        this.updatePasswordForm.newPassword !=
        this.updatePasswordForm.checkNewPassword
      ) {
        this.updatePasswordForm.checkNewPasswordError = true;
        this.updatePasswordForm.checkNewPasswordErrorText =
          "密碼不相符。請再試一次";
        isValid = false;
      }
      if (isValid) {
        this.updatePasswordLoading = true;
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/user/updatePassword ", {
            token: this.$store.state.auth.token,
            account: this.accountSettingForm.account,
            old_password: this.updatePasswordForm.oldPassword,
            new_password: this.updatePasswordForm.newPassword,
          })
          .then(() => {
            window.alert("修改成功");
            this.accountModalTitle = "設定";
          })
          .catch(function (error) {
            if (error.response) {
              vm.updatePasswordLoading = false;
              if (
                error.response.status === 401 ||
                error.response.status === 400
              ) {
                if (error.response.data == "更新失敗 密碼錯誤") {
                  vm.updatePasswordForm.oldPasswordError = true;
                  vm.updatePasswordForm.oldPasswordErrorText = "舊密碼輸入錯誤";
                } else if (error.response.data == "更新失敗 密碼重複") {
                  vm.updatePasswordForm.newPasswordError = true;
                  vm.updatePasswordForm.newPasswordErrorText = "密碼重複";
                  vm.updatePasswordForm.checkNewPasswordError = true;
                }
              } else {
                vm.accountSettingForm.account = "獲取資料發生錯誤";
              }
            } else {
              vm.accountSettingForm.account = "獲取資料發生錯誤";
            }
          });
      }
    },
    updatePasswordNewPasswordLengthCheck() {
      if (this.updatePasswordForm.newPassword.length == 0) {
        this.updatePasswordForm.newPasswordError = true;
        this.updatePasswordForm.newPasswordErrorText = "新密碼輸入為空";
      } else if (this.updatePasswordForm.newPassword.length < 8) {
        this.updatePasswordForm.newPasswordError = true;
        this.updatePasswordForm.newPasswordErrorText =
          "新密碼過短。密碼長度請 >= 8";
      } else {
        this.updatePasswordForm.newPasswordError = false;
        this.updatePasswordForm.newPasswordErrorText = "";
      }
    },
    updatePasswordCheckNewPasswordSameCheck() {
      if (
        this.updatePasswordForm.newPassword !=
        this.updatePasswordForm.checkNewPassword
      ) {
        this.updatePasswordForm.checkNewPasswordError = true;
        this.updatePasswordForm.checkNewPasswordErrorText =
          "密碼不相符。請再試一次";
      } else {
        this.updatePasswordForm.checkNewPasswordError = false;
        this.updatePasswordForm.checkNewPasswordErrorText = "";
      }
    },
  },
  computed: {
    isLogin: function () {
      return this.$store.state.auth.isLogin;
    },
  },
  watch: {
    $route() {
      if (this.$route.name == "NewPassword") {
        // this.modalLogin();
        // this.$router.push({ path: "/" });
        console.log("NewPassword");
      }
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
