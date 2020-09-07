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
          <b-nav-item>
            <b-button
              @click="accountModalShow = !accountModalShow;accountModalTitle = '登入'"
              size="sm"
              class="my-2 my-sm-0"
              variant="info"
            >Login</b-button>
          </b-nav-item>
          <b-nav-item to="/home">Vue Home</b-nav-item>
          <b-nav-item to="/axios">Axios</b-nav-item>
          <b-nav-item to="/test">TestComponent</b-nav-item>
          <b-nav-item to="/admin">Admin</b-nav-item>
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
          <form v-if="accountModalTitle==='登入'" @submit.prevent="login">
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
                type="text"
                class="form-control"
                :class="loginPasswordError?'is-invalid':''"
                id="loginPassword"
                v-model="loginPassword"
                aria-describedby="loginPasswordHelp"
              />
              <div class="invalid-feedback">{{ loginPasswordErrorText }}</div>
              <small id="loginPasswordHelp" class="form-text">
                <b-link @click="accountModalTitle='忘記密碼'">忘記密碼</b-link>
              </small>
            </div>
            <div class="form-group">
              <span>
                還沒有帳號嗎？
                <b-link @click="accountModalTitle='註冊'">註冊帳號</b-link>
              </span>
              <button type="submit" class="btn btn-primary float-right">登入</button>
            </div>
          </form>

          <!--註冊-->
          <form v-else-if="accountModalTitle==='註冊'" @submit.prevent="signup">
            <div class="form-group">
              <span>
                已經有帳號了嗎？
                <b-link @click="accountModalTitle='登入'">登入帳號</b-link>
              </span>
            </div>
            <div class="form-group">
              <label for="signupAccount">帳號：</label>
              <input
                type="text"
                class="form-control"
                :class="signupAccountError?'is-invalid':''"
                id="signupAccount"
                v-model="signupAccount"
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
                type="text"
                class="form-control"
                :class="signupPasswordError?'is-invalid':''"
                id="signupPassword"
                v-model="signupPassword"
              />
              <div class="invalid-feedback">{{ signupPasswordErrorText }}</div>
            </div>
            <div class="form-group">
              <label for="signupCheckPassword">確認密碼</label>
              <input
                type="text"
                class="form-control"
                :class="signupCheckPasswordError?'is-invalid':''"
                id="signupCheckPassword"
                v-model="signupCheckPassword"
              />
              <div class="invalid-feedback">{{ signupCheckPasswordErrorText }}</div>
            </div>
            <div class="form-group">
              <p class="text-center">
                點擊註冊及代表您已閱讀並了解
                <b-link>服務條款</b-link>及
                <b-link>隱私權聲明</b-link>
              </p>
              <p class="text-center">
                <button type="submit" class="btn btn-primary">註冊</button>
              </p>
            </div>
          </form>

          <!--忘記密碼-->
          <form v-else-if="accountModalTitle==='忘記密碼'" @submit.prevent="forgotPassword">
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
              <button type="submit" class="btn btn-primary float-right">傳送驗證信件</button>
            </div>
          </form>
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
      //account-forgotPassword
      forgotPasswordId: "",
      forgotPasswordIdErrorText: "",
      forgotPasswordIdError: false,

      response: null,
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
    login: function () {},
    signup: function () {},
    forgotPassword: function () {},
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
