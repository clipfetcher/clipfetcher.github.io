<template>
  <div class="container">
    <div
      v-if="verifyState === 'initialize'"
      class="alert alert-primary"
      role="alert"
    >
      <p class="text-center my-2 py-2">
        <span>驗證中 請稍後!</span>
      </p>
    </div>
    <div
      v-else-if="verifyState === 'error'"
      class="alert alert-danger"
      role="alert"
    >
      <p class="text-center my-2 py-2">
        <span>驗證失敗!</span>
      </p>
    </div>
    <div v-else class="alert alert-success" role="alert">
      <p class="text-center my-2 py-2">
        <span>驗證成功! 畫面將在5秒後跳轉至首頁</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountVerify",
  props: ["verify_token"],
  data() {
    return {
      verifyState: "initialize",
    };
  },
  mounted() {
    this.verify();
  },
  methods: {
    verify() {
      let vm = this;
      this.axios
        .get(
          process.env.VUE_APP_ROOT_API + "/api/user/verify/" + this.verify_token
        )
        .then(() => {
          this.verifyState = "success";
          setTimeout(() => {
            this.$router.push({ path: "/" });
          }, 5000);
        })
        .catch(() => {
          vm.verifyState = "error";
        });
    },
  },
};
</script>