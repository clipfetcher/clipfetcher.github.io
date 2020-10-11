<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="newPassword()">
          <div v-show="state != 'success'">
            <div class="form-group">
              <label for="newPassword">設定新密碼：</label>
              <input
                type="password"
                class="form-control"
                :class="
                  newPasswordForm.newPasswordPasswordError ? 'is-invalid' : ''
                "
                id="newPassword"
                v-model="newPasswordForm.newPasswordPassword"
                @keyup="newPasswordPasswordLengthCheck()"
              />
              <div class="invalid-feedback">
                {{ newPasswordForm.newPasswordPasswordErrorText }}
              </div>
            </div>
            <div class="form-group">
              <label for="newCheckPassword">確認新密碼：</label>
              <input
                type="password"
                class="form-control"
                :class="
                  newPasswordForm.newPasswordCheckPasswordError
                    ? 'is-invalid'
                    : ''
                "
                id="newCheckPassword"
                v-model="newPasswordForm.newPasswordCheckPassword"
                @keyup="newPasswordCheckPasswordSameCheck()"
              />
              <div class="invalid-feedback">
                {{ newPasswordForm.newPasswordCheckPasswordErrorText }}
              </div>
            </div>
          </div>
          <div class="form-group">
            <div v-if="state === 'init'">
              <button type="submit" class="btn btn-primary float-right">
                確認
              </button>
            </div>
            <div v-else-if="state === 'loading'">
              <div
                class="spinner-border text-secondary float-right"
                role="status"
              >
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <div
              v-else-if="state === 'fail'"
              class="alert alert-danger"
              role="alert"
            >
              <p class="text-center my-2 py-2">
                <span>{{ newPasswordFailText }}</span>
              </p>
            </div>
            <div
              v-else-if="state === 'success'"
              class="alert alert-info"
              role="alert"
            >
              <p class="text-center my-2 py-2">
                <span>密碼更新成功 請重新登入嘗試 將在5秒後自動跳轉至首頁</span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewPassword",
  props: ["forgetPassword_token"],
  data() {
    return {
      state: "init",
      newPasswordForm: {
        newPasswordPassword: "",
        newPasswordPasswordError: false,
        newPasswordPasswordErrorText: "",
        newPasswordCheckPassword: "",
        newPasswordCheckPasswordError: false,
        newPasswordCheckPasswordErrorText: "",
      },
      newPasswordFailText: "",
    };
  },
  methods: {
    newPassword() {
      let vm = this;
      this.newPasswordPasswordLengthCheck();
      this.newPasswordCheckPasswordSameCheck();
      if (
        !(
          this.newPasswordForm.newPasswordPasswordError ||
          this.newPasswordForm.newPasswordCheckPasswordError
        )
      ) {
        this.state = "loading";
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/user/newPassword", {
            token: this.forgetPassword_token,
            password: this.newPasswordForm.newPasswordPassword,
          })
          .then(() => {
            this.newPasswordForm.newPasswordPassword = "";
            this.newPasswordForm.newPasswordCheckPassword = "";
            this.state = "success";
            setTimeout(() => {
              this.$router.push({ path: "/" });
            }, 5000);
          })
          .catch(function (error) {
            console.log(error);
            vm.newPasswordForm.newPasswordPassword = "";
            vm.newPasswordForm.newPasswordCheckPassword = "";
            vm.state = "fail";
            if (error.response.data === "tokenExpired") {
              vm.newPasswordFailText = "驗證已過期 請重新嘗試";
            } else if (error.response.data === "tokenInvalid") {
              vm.newPasswordFailText = "驗證錯誤 請重新嘗試";
            } else {
              vm.newPasswordFailText = "發生未預期的錯誤 請重新嘗試";
            }
          });
      }
    },
    newPasswordPasswordLengthCheck() {
      if (this.newPasswordForm.newPasswordPassword.length == 0) {
        this.newPasswordForm.newPasswordPasswordError = true;
        this.newPasswordForm.newPasswordPasswordErrorText = "密碼輸入為空";
      } else if (this.newPasswordForm.newPasswordPassword.length < 8) {
        this.newPasswordForm.newPasswordPasswordError = true;
        this.newPasswordForm.newPasswordPasswordErrorText =
          "密碼過短。密碼長度請 >= 8";
      } else {
        this.newPasswordForm.newPasswordPasswordError = false;
        this.newPasswordForm.newPasswordPasswordErrorText = "";
      }
    },
    newPasswordCheckPasswordSameCheck() {
      if (
        this.newPasswordForm.newPasswordPassword !=
        this.newPasswordForm.newPasswordCheckPassword
      ) {
        this.newPasswordForm.newPasswordCheckPasswordError = true;
        this.newPasswordForm.newPasswordCheckPasswordErrorText = "密碼不相符";
      } else {
        this.newPasswordForm.newPasswordCheckPasswordError = false;
        this.newPasswordForm.newPasswordCheckPasswordErrorText = "";
      }
    },
  },
};
</script>