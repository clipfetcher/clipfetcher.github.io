<template>
  <div class="container">
    <h1>意見回饋</h1>
    <br />
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
          autocomplete="email"
          required
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
          required
        />
        <div class="invalid-feedback">建議內容不得為空</div>
      </div>
      <button
        type="submit"
        class="btn btn-primary float-right"
        :disabled="validating"
      >
        送出
      </button>
    </form>
    <div
      v-if="opinionStatus == 'success'"
      class="alert alert-success"
      role="alert"
    >
      <p class="text-center my-2 py-2">
        <span>我們已收到您的回饋 謝謝! 頁面將在2秒後返回首頁</span>
      </p>
    </div>
    <div
      v-else-if="opinionStatus == 'fail'"
      class="alert alert-danger"
      role="alert"
    >
      <p class="text-center my-2 py-2">
        <span>送出失敗!</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Opinion",
  data() {
    return {
      mail: "",
      content: "",
      emailErrorText: "",
      emailError: false,
      contentError: false,
      opinionStatus: "",
      validating: false,
    };
  },
  methods: {
    opinion: function () {
      let vm = this;
      let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.validating = true;
      this.emailError = false;
      this.contentError = false;
      this.emailErrorText = "";

      if (this.mail == "" || this.mail == null) {
        this.emailError = true;
        this.emailErrorText = "信箱未填寫";
        if (this.content == "" || this.content == null) {
          this.contentError = true;
        }
        this.validating = false;
      } else if (reg.test(this.mail) == false) {
        this.emailError = true;
        this.emailErrorText = "信箱格式不正確";
        if (this.content == "" || this.content == null) {
          this.contentError = true;
        }
        this.validating = false;
      } else if (this.content == "" || this.content == null) {
        this.contentError = true;
        this.validating = false;
      } else {
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/opinion", {
            mail: this.mail,
            content: this.content,
          })
          .then((response) => {
            vm.response = response.status;
            vm.opinionStatus = "success";
            setTimeout(() => {
              vm.$router.push({ path: "/" });
            }, 2000);
          })
          .catch(() => {
            vm.opinionStatus = "fail";
            vm.validating = false;
          });
      }
    },
  },
};
</script>