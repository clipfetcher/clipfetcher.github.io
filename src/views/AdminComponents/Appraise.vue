<template>
  <div>
    <br />
    <b-table striped hover :items="appraiseList" :fields="fields">
      <template v-slot:cell(manage)>
        <b-button size="sm" class="mr-2">
          <i class="fas fa-mail-bulk"></i> 聯繫用戶
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "appraise",
  data() {
    return {
      fields: ["mail", "content", "manage"],
      appraiseList: null,
    };
  },
  mounted() {
    this.getContent();
  },
  methods: {
    getContent: function () {
      this.axios
        .get(process.env.VUE_APP_ROOT_API + "/api/opinion")
        .then((response) => {
          this.appraiseList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style>
</style>