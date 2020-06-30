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
  </div>
</template>

<script>
import HighlightList from "@/components/HighlightList.vue";

export default {
  name: "test",
  data() {
    return {};
  },
  components: { HighlightList }
};
</script>