<template>
  <div id="app">
    <h1 class="myClass">Vue.js</h1>
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>|
      <router-link to="/news">News</router-link>|
      <router-link to="/axios">Axios</router-link>|
      <router-link :to="{ name: 'Player', params: { uid: 1 }}">Player_1</router-link>|
      <router-link to="/player/2">Player_2</router-link>|
      <router-link :to="{ path: '/player/2/profile' }">Player_2_profile</router-link>|
      <router-link to="/player/3">Player_3</router-link>|
      <router-link to="/first">First</router-link>|
      <router-link to="/multiple">MultiRoute</router-link>|
      <router-link to="/User/1/USA">User1</router-link>|
      <router-link to="/User/2/Taiwan">User2</router-link>
    </div>
    <br />
    <button class="btn btn-primary m-1" @click="btnPlayer(1)">Player_1</button>
    <button class="btn btn-primary m-1" @click="btnPlayer(2)">Player_2</button>
    <hr />
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    btnPlayer(uid) {
      this.$router.push({ path: `/player/${uid}` });
      //this.$router.push({ path: `/player/${uid}/profile` });
      //this.$router.push({ name: "Player", params: { uid: uid } });
      //this.$router.push({ name: "Player", query: { uid: uid } });
      //this.$router.go(-1);
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
