<template>
  <div>
    <br />
    <div
      v-if="accountList === 'Loading'"
      class="d-flex justify-content-center my-5"
    >
      <div class="spinner-grow text-secondary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else-if="accountList === 'Finish'">
      <b-table striped hover :items="accounts" :fields="fields" responsive="sm">
        <template v-slot:cell(manage)>
          <b-button size="sm" class="mr-2">
            <i class="fas fa-ban"></i> 封鎖用戶
          </b-button>
        </template>
      </b-table>
    </div>
    <div v-else class="alert alert-danger" role="alert">
      <p class="text-center my-2 py-2">
        <span>系統連線發生錯誤 請等待問題排除或重新整理頁面嘗試 感謝！</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "account",
  data() {
    return {
      fields: [
        { key: "account", label: "帳號名稱", sortable: true },
        { key: "email", label: "電子信箱" },
        { key: "verification", label: "帳號驗證" },
        { key: "role", label: "帳號等級" },
        { key: "manage", label: "帳號管理" },
      ],
      accountList: "Loading",
      accounts: null,
    };
  },
  mounted() {
    this.getContent();
  },
  methods: {
    getContent: function () {
      let vm = this;
      this.axios
        .get(process.env.VUE_APP_ROOT_API + "/api/admin/users", {
          params: {
            token: this.$store.state.auth.token,
          },
        })
        .then((response) => {
          this.accounts = response.data;
          this.accountList = "Finish";
        })
        .catch(function (error) {
          console.log(error);
          vm.accountList = "Error";
        });
    },
  },
};
</script>