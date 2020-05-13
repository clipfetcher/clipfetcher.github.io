<template>
  <div id="app">
    <b-navbar toggleable type="dark" variant="dark">
      <b-navbar-brand to="/">
        <img
          src="./assets/ClipFetcher.png"
          width="30"
          height="30"
          class="d-inline-block align-top"
          alt="ClipFetcher Logo"
        />
        {{ title }}
      </b-navbar-brand>

      <b-navbar-toggle target="navbar-toggle-collapse">
        <span class="navbar-toggler-icon"></span>
      </b-navbar-toggle>

      <b-collapse id="navbar-toggle-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/demo">Demo</b-nav-item>
          <b-nav-item to="/axios">Axios</b-nav-item>
          <b-nav-item to="/test">TestComponent</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <br />
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
                type="text"
                class="form-control"
                :class="emailError?'is-invalid':''"
                id="mail"
                v-model="mail"
                aria-describedby="emailHelp"
              />
              <div class="invalid-feedback">{{ emailErrorText }}</div>
              <small id="emailHelp" class="form-text text-muted">我們將會使用這個信箱作為聯絡您的方式</small>
            </div>
            <div class="form-group">
              <label for="content">建議內容：</label>
              <input
                type="text"
                class="form-control"
                :class="contentError?'is-invalid':''"
                placeholder="想要給本系統改善的建議"
                id="content"
                v-model="content"
              />
              <div class="invalid-feedback">建議內容不得為空</div>
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
      response: null,

      emailErrorText: "",
      emailError: false,
      contentError: false
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
      let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.emailError = false;
      this.contentError = false;
      this.emailErrorText = "";

      if (this.mail == "" || this.mail == null) {
        this.emailError = true;
        this.emailErrorText = "信箱未填寫";
        if (this.content == "" || this.content == null) {
          this.contentError = true;
        }
      } else if (reg.test(this.mail) == false) {
        this.emailError = true;
        this.emailErrorText = "信箱格式不正確";
        if (this.content == "" || this.content == null) {
          this.contentError = true;
        }
      } else if (this.content == "" || this.content == null) {
        this.contentError = true;
      } else {
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
        this.opinionModalShow = !this.opinionModalShow;
        this.mail = "";
        this.content = "";
      }
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
