<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-dark">
      <a class="navbar-brand" href="#">{{ title }}</a>
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
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/news">News</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/axios">Axios</router-link>
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
          <li class="nav-item">
            <router-link class="nav-link" to="/demo">Demo</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/test">Test</router-link>
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
        <a class="nav-link float-right" href="mailto:">聯絡我們</a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      title: "Highlight Clip Fetcher"
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
