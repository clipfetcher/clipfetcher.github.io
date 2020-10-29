<template>
  <div class="container">
    <div class="card my-2">
      <h5 class="card-header">精華影片列表</h5>
      <HighlightList
        vod_id="highlight.vod_id"
        highlight_id="highlight.highlight_id"
        channel_id="highlight.channel_id"
        streamerName="searchVideo.streamerName"
        game="highlight.game"
        youtube_url
        avg_score="highlight.avg_score"
        memo="highlight.memo"
      ></HighlightList>
    </div>
    <input type="text" class="form-control" v-model="video" />
    <button class="btn btn-primary m-1" @click="getTime">Time</button>
    <button class="btn btn-primary m-1" @click="createTwitchPlayer">New</button>
    <button class="btn btn-primary m-1" @click="setTwitchPlayer">Set</button>
    <button class="btn btn-primary m-1" @click="removeTwitchPlayer">
      Remove
    </button>
    <p>{{ time }}</p>
    <div class="embed-responsive embed-responsive-16by9 my-1">
      <div ref="twitchVideo"></div>
    </div>
    <br />
  </div>
</template>

<!-- Load the Twitch embed script -->
<script src= "https://player.twitch.tv/js/embed/v1.js"></script>

<script>
import HighlightList from "@/components/HighlightList.vue";

export default {
  name: "test",
  data() {
    return {
      options: {
        width: 1260,
        height: 720,
        video: "767275669",
        parent: ["clipfetcher.com", "127.0.0.1"],
        autoplay: false,
        allowfullscreen: true,
      },
      player: null,
      time: "",
      video: "",
    };
  },
  mounted() {
    this.createTwitchPlayer();
  },
  methods: {
    getTime() {
      let diff = this.player.getCurrentTime();
      diff = diff.toFixed();
      let hour = Math.floor(diff / 60 / 60);
      hour = hour >= 10 ? hour : "0" + hour;
      let minute = Math.floor(diff / 60) % 60;
      minute = minute >= 10 ? minute : "0" + minute;
      let second = diff % 60;
      second = second >= 10 ? second : "0" + second;
      this.time = hour + ":" + minute + ":" + second;
    },
    createTwitchPlayer() {
      if (this.player != null) this.player.destroy();
      this.player = new Twitch.Player(this.$refs.twitchVideo, this.options);
    },
    setTwitchPlayer() {
      if (this.video != "") {
        if (this.player != null) this.player.destroy();
        this.options.video = this.video;
        this.player = new Twitch.Player(this.$refs.twitchVideo, this.options);
      }
    },
    removeTwitchPlayer() {
      this.player.destroy();
    },
  },
  components: { HighlightList },
};
</script>