<template>
  <div class="container">
    <h1>axios test</h1>
    <!--
    <p
      class="text-left"
      v-for="site in info"
      :key="site.index"
    >{{ site.id }}> name:{{ site.employee_name }} salary:{{ site.employee_salary }} age:{{ site.employee_age }}</p>
    -->
    <h2>vod_create</h2>
    <button class="btn btn-primary m-1" @click="tryApi_1()">test_api</button>
    <p>{{ api_test_1 }}</p>
    <h2>vod_check</h2>
    <p>{{ vod }}</p>
    <form action="javascript:void(0)" @submit="tryApi_2()">
      <input type="text" name="vod" v-model="vod" />
      <button class="btn btn-primary m-1" type="submit">test_api</button>
    </form>
    <p>{{ api_test_2 }}</p>
  </div>
</template>

<script>
export default {
  name: "Axios",
  data() {
    return {
      info: null,
      vod: "",
      api_test_1: null,
      api_test_2: null
    };
  },
  /*
  mounted() {
    this.axios
      .get("http://dummy.restapiexample.com/api/v1/employees")
      .then(response => (this.info = response.data.data))
      .catch(function(error) {
        console.log(error);
      });
  },
  */
  methods: {
    tryApi_1() {
      this.axios
        .get("http://192.168.1.109:3000/api/vod_create")
        .then(response => (this.api_test_1 = response.data.highlight_id))
        .catch(function(error) {
          console.log(error);
        });
    },
    tryApi_2() {
      let vm = this;
      this.axios
        .post("http://192.168.1.109:3000/api/vod_check", {
          vod: this.vod
        })
        .then(response => (this.api_test_2 = response.data))
        .catch(function(error) {
          console.log(error.response);
          vm.api_test_2 = error.response.data;
        });
    }
  }
};
</script>