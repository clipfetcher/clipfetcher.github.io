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
    <button @click="getTime">Time</button>
    <p>{{ time }}</p>
    <div class="embed-responsive embed-responsive-16by9 my-1">
      <div ref="twitchVideo" class=""></div>
    </div>
    <br />
  </div>
</template>

<!-- Load the Twitch embed script -->
<script src="https://embed.twitch.tv/embed/v1.js"></script>
<script src= "https://player.twitch.tv/js/embed/v1.js"></script>

<script>
import HighlightList from "@/components/HighlightList.vue";

export default {
  name: "test",
  data() {
    return {
      options: {
        width: 856,
        height: 480,
        video: "767275669",
        // only needed if your site is also embedded on embed.example.com and othersite.example.com
        parent: [window.location.hostname],
        autoplay: false,
      },
      player: null,
      time: "",
    };
  },
  mounted() {
    this.player = new Twitch.Player(this.$refs.twitchVideo, this.options);
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
  },
  components: { HighlightList },
};
</script>