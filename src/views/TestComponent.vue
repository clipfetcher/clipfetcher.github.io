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
    <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
      <highlight-grid
        vod_id="searchVideo.vod_id"
        highlight_id="searchVideo.highlight_id"
        channel_id="searchVideo.channel_id"
        streamerName="searchVideo.streamerName"
        game="searchVideo.game"
        youtube_url="searchVideo.youtube_url"
        start_at="searchVideo.start_at"
        duration="searchVideo.duration"
        avg_score="searchVideo.avg_score"
        memo="searchVideo.memo"
        author="searchVideo.author"
        status="searchVideo.status"
        analyzeType="searchVideo.analyzeType"
        video_link="https://iframe.videodelivery.net/1a682d14d284e6d8941c29d23e836004"
      ></highlight-grid>
      <highlight-grid
        vod_id="searchVideo.vod_id"
        highlight_id="searchVideo.highlight_id"
        channel_id="searchVideo.channel_id"
        streamerName="searchVideo.streamerName"
        game="searchVideo.game"
        youtube_url="searchVideo.youtube_url"
        start_at="searchVideo.start_at"
        duration="searchVideo.duration"
        avg_score="searchVideo.avg_score"
        memo="searchVideo.memo"
        author="searchVideo.author"
        status="FINISHED"
        analyzeType="searchVideo.analyzeType"
        video_link="https://iframe.videodelivery.net/1a682d14d284e6d8941c29d23e836004"
      ></highlight-grid>
      <highlight-grid
        video_link="https://www.youtube.com/watch?v=IqkQcQxWcAA"
      ></highlight-grid>
      <highlight-grid
        video_link="https://www.youtube.com/watch?v=IqkQcQxWcAA"
      ></highlight-grid>
    </div>
    <input type="text" class="form-control" v-model="vod_id" />
    <p>Time:{{ time }}</p>
    <button class="btn btn-primary" @click="showEmbeded = !showEmbeded">
      {{ showEmbeded ? "關閉" : "開啟" }}
    </button>
    <div
      class="embed-responsive embed-responsive-16by9 my-1"
      v-if="showEmbeded"
    >
      <twitch-embeded
        :vod_id="vod_id"
        :seek_time="seek_time"
        v-on:getVODTime="getVODTime"
      ></twitch-embeded>
    </div>
    <br />
  </div>
</template>

<!-- Load the Twitch embed script -->
<script src= "https://player.twitch.tv/js/embed/v1.js"></script>

<script>
import HighlightList from "@/components/HighlightList.vue";
import TwitchEmbeded from "@/components/TwitchEmbeded.vue";
import HighlightGrid from "@/components/HighlightGrid.vue";

export default {
  name: "test",
  data() {
    return {
      vod_id: "767275669",
      time: "",
      showEmbeded: true,
      seek_time: 0.0,
    };
  },
  mounted() {},
  methods: {
    getVODTime(value) {
      this.time = value;
    },
  },
  components: { HighlightList, TwitchEmbeded, HighlightGrid },
};
</script>