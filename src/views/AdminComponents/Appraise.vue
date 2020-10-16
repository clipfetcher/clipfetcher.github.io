<template>
  <div>
    <br />
    <div
      v-if="appraiseList === 'Loading'"
      class="d-flex justify-content-center my-5"
    >
      <div class="spinner-grow text-secondary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else-if="appraiseList === 'Finish'">
      <b-table
        striped
        hover
        :items="appraises"
        :fields="fields"
        responsive="sm"
      >
        <template v-slot:cell(manage)>
          <b-button size="sm" class="mr-2">
            <i class="fas fa-mail-bulk"></i> 聯繫用戶
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
  name: "appraise",
  data() {
    return {
      fields: [
        { key: "mail", label: "電子信箱" },
        { key: "content", label: "回饋內容" },
        { key: "manage", label: "回饋管理" },
      ],
      appraiseList: "Loading",
      appraises: null,
    };
  },
  mounted() {
    this.getContent();
  },
  methods: {
    getContent: function () {
      let vm = this;
      this.axios
        .get(process.env.VUE_APP_ROOT_API + "/api/opinion")
        .then((response) => {
          this.appraises = response.data;
          this.appraiseList = "Finish";
        })
        .catch(function (error) {
          console.log(error);
          vm.appraiseList = "Error";
        });
    },
  },
};
</script>

<style>
</style>