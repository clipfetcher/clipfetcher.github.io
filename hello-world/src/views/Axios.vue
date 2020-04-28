<template>
  <div class="axios container">
    <h1>Axios test</h1>
    <div class="form-group">
      <label>vod_id:</label>
      <br />
      <input type="text" name="vod" v-model="vod" />
    </div>
    <p>{{ vod }}</p>
    <h2>vod_post</h2>
    <button class="btn btn-primary m-1" @click="tryApi_1()">Test</button>
    <p>{{ api_test_1 }}</p>
    <h2>vod_get</h2>
    <button class="btn btn-primary m-1" @click="tryApi_2()">Test</button>
    <p>{{ api_test_2 }}</p>
    <h2>vod/check_post</h2>
    <button class="btn btn-primary m-1" @click="tryApi_3()">Test</button>
    <p>{{ api_test_3 }}</p>
    <h2>vod/status_get</h2>
    <button class="btn btn-primary m-1" @click="tryApi_4()">Test</button>
    <p>{{ api_test_4 }}</p>
    <h2>vod/highlight_get</h2>
    <button class="btn btn-primary m-1" @click="tryApi_5()">Test</button>
    <p>{{ api_test_5 }}</p>
    <h2>vod/appraise_post</h2>
    <form action="javascript:void(0)" @submit="tryApi_6()">
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
      <button class="btn btn-primary m-1" type="submit">Test</button>
    </form>
    <p>{{ api_test_6 }}</p>
    <h2>vod/opinion_post</h2>
    <form action="javascript:void(0)" @submit="tryApi_7()">
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
      <button class="btn btn-primary m-1" type="submit">Test</button>
    </form>
    <p>{{ api_test_7 }}</p>
  </div>
</template>

<script>
//var ip = "http://192.168.1.109:3000";
var ip = "https://clip-fetcher.herokuapp.com";
export default {
  name: "Axios",
  data() {
    return {
      vod: "",
      highlight_id: "",
      text: "",
      score: "",
      mail: "",
      content: "",
      api_test_1: null,
      api_test_2: null,
      api_test_3: null,
      api_test_4: null,
      api_test_5: null,
      api_test_6: null,
      api_test_7: null
    };
  },
  methods: {
    tryApi_1() {
      this.axios
        .post(ip + "/api/vod", {
          vod_id: this.vod
        })
        .then(response => (this.api_test_1 = response))
        .catch(function(error) {
          console.log(error);
        });
    },
    tryApi_2() {
      this.axios
        .get(ip + "/api/vod")
        .then(response => (this.api_test_2 = response.data))
        .catch(function(error) {
          console.log(error.response);
        });
    },
    tryApi_3() {
      this.axios
        .post(ip + "/api/vod/check", {
          vod_id: this.vod
        })
        .then(response => (this.api_test_3 = response))
        .catch(function(error) {
          console.log(error);
        });
    },
    tryApi_4() {
      this.axios
        .get(ip + "/api/vod/status", {
          params: {
            vod_id: this.vod
          }
        })
        .then(response => (this.api_test_4 = response.data))
        .catch(function(error) {
          console.log(error);
        });
    },
    tryApi_5() {
      this.axios
        .get(ip + "/api/vod/highlight", {
          params: {
            vod_id: this.vod
          }
        })
        .then(response => (this.api_test_5 = response.data))
        .catch(function(error) {
          console.log(error);
        });
    },
    tryApi_6() {
      this.axios
        .post(ip + "/api/vod/appraise", {
          highlight_id: this.vod,
          text: this.text,
          score: this.score
        })
        .then(response => (this.api_test_6 = response))
        .catch(function(error) {
          console.log(error);
        });
    },
    tryApi_7() {
      this.axios
        .post(ip + "/api/vod/opinion", {
          mail: this.mail,
          content: this.content
        })
        .then(response => (this.api_test_7 = response))
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style scope>
.axios {
  font-family: "Noto Sans TC", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>