<template>
  <div class="container">
    <div v-if="certificateState === 'initialize'" class="alert alert-primary" role="alert">
      <p class="text-center my-2 py-2">
        <span>驗證中 請稍後!</span>
      </p>
    </div>
    <div v-else-if="certificateState === 'error'" class="alert alert-danger" role="alert">
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
  name: "Certificate",
  props: ["certificate_token"],
  data() {
    return {
      certificateState: "initialize",
    };
  },
  mounted() {
    this.certificate();
  },
  methods: {
    certificate() {
      let vm = this;
      this.axios
        .get(
          process.env.VUE_APP_ROOT_API +
            "/api/user/certificate/" +
            this.certificate_token
        )
        .then(() => {
          this.certificateState = "success";
          setTimeout(() => {
            this.$router.push({ path: "/" });
          }, 5000);
        })
        .catch(function (error) {
          console.log(error);
          vm.certificateState = "error";
        });
    },
  },
};
</script>