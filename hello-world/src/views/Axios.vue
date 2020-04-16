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
      <br />
      <button class="btn btn-primary m-1" type="submit">test_api</button>
    </form>
    <p>{{ api_test_2 }}</p>
    <h2>analysis_status</h2>
    <button class="btn btn-primary m-1" @click="tryApi_3()">test_api</button>
    <p>{{ api_test_3 }}</p>
    <h2>highlight_browse</h2>
    <button class="btn btn-primary m-1" @click="tryApi_4()">test_api</button>
    <p>{{ api_test_4 }}</p>
    <h2>highlight_feedback</h2>
    <form action="javascript:void(0)" @submit="tryApi_5()">
      <div class="form-group">
        <label>highlight_id:</label>
        <br />
        <input type="text" name="highlight_id" v-model="highlight_id" />
      </div>
      <div class="form-group">
        <label>text:</label>
        <br />
        <input type="text" name="text" v-model="text" />
      </div>
      <div class="form-group">
        <label>score:</label>
        <br />
        <input type="text" name="score" v-model="score" />
      </div>
      <button class="btn btn-primary m-1" type="submit">test_api</button>
    </form>
    <p>{{ api_test_5 }}</p>
    <h2>problem_feedback</h2>
    <form action="javascript:void(0)" @submit="tryApi_6()">
      <div class="form-group">
        <label>mail:</label>
        <br />
        <input type="text" name="mail" v-model="mail" />
      </div>
      <div class="form-group">
        <label>content:</label>
        <br />
        <input type="text" name="content" v-model="content" />
      </div>
      <button class="btn btn-primary m-1" type="submit">test_api</button>
    </form>
    <p>{{ api_test_6 }}</p>
    <h2>highlight_search</h2>
    <form action="javascript:void(0)" @submit="tryApi_7()">
      <div class="form-group">
        <label>search:</label>
        <br />
        <input type="text" name="search" v-model="search" />
      </div>
      <button class="btn btn-primary m-1" type="submit">test_api</button>
    </form>
    <p>{{ api_test_7 }}</p>
    <h2>highlight_list</h2>
    <button class="btn btn-primary m-1" @click="tryApi_8()">test_api</button>
    <p>{{ api_test_8 }}</p>
  </div>
</template>

<script>
let ip = "http://192.168.100.102";
export default {
  name: "Axios",
  data() {
    return {
      info: null,
      vod: "",
      highlight_id: "",
      text: "",
      score: "",
      mail: "",
      content: "",
      search: "",
      api_test_1: null,
      api_test_2: null,
      api_test_3: null,
      api_test_4: null,
      api_test_5: null,
      api_test_6: null,
      api_test_7: null,
      api_test_8: null
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
        .get(ip + ":3000/api/vod_create")
        .then(response => (this.api_test_1 = response.data.highlight_id))
        .catch(function(error) {
          console.log(error);
        });
    },
    tryApi_2() {
      let vm = this;
      this.axios
        .post(ip + ":3000/api/vod_check", {
          vod: this.vod
        })
        .then(response => (this.api_test_2 = response.data))
        .catch(function(error) {
          console.log(error.response);
          vm.api_test_2 = error.response.data;
        });
    },
    tryApi_3() {
      this.axios
        .get(ip + ":3000/api/analysis_status")
        .then(response => (this.api_test_3 = response.data.status))
        .catch(function(error) {
          console.log(error);
        });
    },
    tryApi_4() {
      this.axios
        .get(ip + ":3000/api/highlight_browse")
        .then(response => (this.api_test_4 = response.data.data))
        .catch(function(error) {
          console.log(error);
        });
    },
    tryApi_5() {
      let vm = this;
      this.axios
        .post(ip + ":3000/api/highlight_feedback", {
          highlight_id: this.highlight_id,
          text: this.text,
          score: this.score
        })
        .then(response => (this.api_test_5 = response.data.data))
        .catch(function(error) {
          console.log(error.response);
          vm.api_test_5 = error.response.data;
        });
    },
    tryApi_6() {
      let vm = this;
      this.axios
        .post(ip + ":3000/api/problem_feedback", {
          mail: this.mail,
          content: this.content
        })
        .then(response => (this.api_test_6 = response.data.data))
        .catch(function(error) {
          console.log(error.response);
          vm.api_test_6 = error.response.data;
        });
    },
    tryApi_7() {
      let vm = this;
      this.axios
        .get(ip + ":3000/api/highlight_search", {
          params: {
            search: this.search
          }
        })
        .then(response => (this.api_test_7 = response.data.data))
        .catch(function(error) {
          console.log(error.response);
          vm.api_test_7 = error.response.data;
        });
    },
    tryApi_8() {
      this.axios
        .get(ip + ":3000/api/highlight_list")
        .then(response => (this.api_test_8 = response.data.data))
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>