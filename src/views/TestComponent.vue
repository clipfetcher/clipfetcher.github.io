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
    <div class="row">
      <div class="col-4">
        <highlight-grid></highlight-grid>
      </div>
      <div class="col-4">
        <highlight-grid></highlight-grid>
      </div>
      <div class="col-4">
        <highlight-grid></highlight-grid>
      </div>
      <div class="col-4">
        <highlight-grid></highlight-grid>
      </div>
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