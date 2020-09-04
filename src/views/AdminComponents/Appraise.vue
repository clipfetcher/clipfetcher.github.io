<template>
  <div>
    <span>this is appraise</span>
    <b-table striped hover :items="appraiseList"></b-table>
  </div>
</template>

<script>
export default {
  name: "appraise",
  data() {
    return {
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