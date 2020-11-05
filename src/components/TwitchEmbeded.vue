<template>
  <div ref="twitchVideo"></div>
</template>

<!-- Load the Twitch embed script -->
<script src= "https://player.twitch.tv/js/embed/v1.js"></script>

<script>
export default {
  name: "twitch-embeded",
  props: ["vod_id"],
  data() {
    return {
      options: {
        width: 1260,
        height: 720,
        video: this.vod_id,
        parent: ["clipfetcher.com", "127.0.0.1"],
        autoplay: false,
        allowfullscreen: true,
      },
      player: null,
    };
  },
  mounted() {
    this.createTwitchPlayer();
  },
  methods: {
    createTwitchPlayer() {
      if (this.player != null) this.player.destroy();
      this.player = new Twitch.Player(this.$refs.twitchVideo, this.options);
    },
    setTwitchPlayer() {
      if (this.vod_id != "") {
        if (this.player != null) this.player.destroy();
        this.options.video = this.vod_id;
        this.player = new Twitch.Player(this.$refs.twitchVideo, this.options);
      }
    },
    removeTwitchPlayer() {
      this.player.destroy();
    },
  },
  watch: {
    vod_id() {
      this.setTwitchPlayer();
    },
    time() {
      this.$emit("getVODTime", this.time);
    },
  },
  computed: {
    time() {
      if (this.player != null) {
        let diff = this.player.getCurrentTime();
        diff = diff.toFixed();
        let hour = Math.floor(diff / 60 / 60);
        hour = hour >= 10 ? hour : "0" + hour;
        let minute = Math.floor(diff / 60) % 60;
        minute = minute >= 10 ? minute : "0" + minute;
        let second = diff % 60;
        second = second >= 10 ? second : "0" + second;
        return hour + ":" + minute + ":" + second;
      }
    },
  },
  beforeDestroy() {
    this.removeTwitchPlayer();
  },
};
</script>