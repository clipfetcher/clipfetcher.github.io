<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-dark">
      <a class="navbar-brand" href="#">
        <img
          src="./assets/ClipFetcher.png"
          width="30"
          height="30"
          class="d-inline-block align-top"
          alt="ClipFetcher Logo"
        />
        {{ title }}
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <!--
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/news">News</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Player', params: { uid: 1 }}">Player_1</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/player/2">Player_2</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/player/2/profile' }">Player_2_profile</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/player/3">Player_3</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/first">First</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/multiple">MultiRoute</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/User/1/USA">User1</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/User/2/Taiwan">User2</router-link>
          </li>
          -->
          <li class="nav-item">
            <router-link class="nav-link" to="/demo">Demo</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/test">Test</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/axios">Axios</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <br />
    <!--
    <button class="btn btn-primary m-1" @click="btnPlayer(1)">Player_1</button>
    <button class="btn btn-primary m-1" @click="btnPlayer(2)">Player_2</button>
    <hr />
    -->
    <router-view />

    <footer class="mt-3">
      <div class="container">
        <b-button
          @click="opinionModalShow = !opinionModalShow"
          pill
          variant="info"
          class="mx-4 my-2"
        >提供建議</b-button>

        <b-modal v-model="opinionModalShow" title="建議提供" hide-footer>
          <form @submit.prevent="opinion">
            <div class="form-group">
              <label for="mail">電子信箱：</label>
              <input
                type="email"
                class="form-control"
                id="mail"
                v-model="mail"
                aria-describedby="emailHelp"
                required
              />
              <small id="emailHelp" class="form-text text-muted">我們將會使用這個信箱作為聯絡您的方式</small>
            </div>
            <div class="form-group">
              <label for="mail">建議內容：</label>
              <input
                type="text"
                class="form-control"
                placeholder="想要給本系統改善的建議"
                id="content"
                v-model="content"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary float-right">送出</button>
          </form>
        </b-modal>
        {{ response }}
      </div>
    </footer>
  </div>
</template>

<script>
var ip = "https://clip-fetcher.herokuapp.com";

export default {
  name: "App",
  data() {
    return {
      title: "Highlight Clip Fetcher",
      mail: "",
      content: "",
      opinionModalShow: false,
      response: null
    };
  },
  methods: {
    /*
    btnPlayer(uid) {
      this.$router.push({ path: `/player/${uid}` });
      //this.$router.push({ path: `/player/${uid}/profile` });
      //this.$router.push({ name: "Player", params: { uid: uid } });
      //this.$router.push({ name: "Player", query: { uid: uid } });
      //this.$router.go(-1);
    }
    */
    opinion: function() {
      let vm = this;
      this.axios
        .post(ip + "/api/vod/opinion", {
          mail: this.mail,
          content: this.content
        })
        .then(response => {
          vm.response = response;
        })
        .catch(function(error) {
          console.log(error);
        });
      this.mail = "";
      this.content = "";
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#app {
  font-family: "Noto Sans TC", Avenir, Helvetica, Arial, sans-serif;
}
</style>
