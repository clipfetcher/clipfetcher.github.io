<template>
  <div class="container">
    <h1>This is an player page</h1>
    <ul class="list-group">
      <li class="list-group-item">編號：{{ detail.uid }}</li>
      <li class="list-group-item">名稱：{{ detail.name }}</li>
      <li class="list-group-item">分數：{{ detail.score }}</li>
    </ul>
    <br />
    <h3>
      <router-link :to="profile">Profile</router-link>
    </h3>
    <hr />
    <router-view />
  </div>
</template>

<script>
export default {
  name: "Player",
  data() {
    return {
      detail: {},
      profile: ""
    };
  },
  mounted() {
    this.detail = this.getPlayer(this.$route.params.uid);
    this.profile = "/player/" + this.$route.params.uid + "/profile";
  },
  beforeRouteUpdate(to, from, next) {
    this.detail = this.getPlayer(to.params.uid);
    this.profile = "/player/" + to.params.uid + "/profile";
    next();
  },
  methods: {
    getPlayer(uid) {
      switch (uid.toString()) {
        case "1":
          return { uid: 1, name: "一號", score: 100 };
        case "2":
          return { uid: 2, name: "二號", score: 60 };
        default:
          return { uid: -1 };
      }
    }
  }
};
</script>