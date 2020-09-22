<template>
  <div class="container">
    <div v-if="certificate==='initialize'" class="alert alert-primary" role="alert">
      <p class="text-center my-2 py-2">
        <span>驗證中 請稍後!</span>
      </p>
    </div>
    <div v-else-if="certificate==='error'" class="alert alert-danger" role="alert">
      <p class="text-center my-2 py-2">
        <span>驗證失敗!</span>
      </p>
    </div>
    <div v-else class="alert alert-success" role="alert">
      <p class="text-center my-2 py-2">
        <span>驗證成功!</span>
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
      certificate: "initialize",
    };
  },
  mounted() {
    this.getContent();
  },
  methods: {
    getContent() {
      let vm = this;
      this.axios
        .get(
          process.env.VUE_APP_ROOT_API +
            "/api/user/certificate/" +
            this.certificate_token
        )
        .then(() => {
          this.certificate = "success";
        })
        .catch(function (error) {
          console.log(error);
          vm.certificate = "error";
        });
    },
  },
};
</script>