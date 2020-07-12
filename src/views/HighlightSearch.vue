<template>
  <div class="container">
    <h1>搜尋結果</h1>
    <div v-if="highlightSearch === 'Loading'" class="d-flex justify-content-center my-2">
      <div class="spinner-border text-secondary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else-if="highlightSearch === 'Find'" class="card my-2">
      <HighlightList
        v-for="searchVideo in searchVideos"
        :key="searchVideo.index"
        :vod_id="searchVideo.vod_id"
        :highlight_id="searchVideo.highlight_id"
        :channel_id="searchVideo.channel_id"
        :streamerName="searchVideo.streamerName"
        :game="searchVideo.game"
        :youtube_url="searchVideo.youtube_url"
        :avg_score="searchVideo.avg_score"
        :memo="searchVideo.memo"
      ></HighlightList>
    </div>
    <div v-else class="alert alert-danger" role="alert">
      <p class="text-center my-2 py-2">
        <span>很抱歉！找不到您要搜尋的精華影片！</span>
      </p>
    </div>
  </div>
</template>

<script>
import HighlightList from "@/components/HighlightList.vue";

export default {
  name: "results",
  data() {
    return {
      query: this.$route.query,
      highlightSearch: "Loading",
      searchVideos: null
    };
  },
  mounted() {
    let query = this.query;
    let vm = this;
    vm.searchVideos = null;
    this.axios
      .get(process.env.VUE_APP_ROOT_API + "/api/vod/highlight", {
        params: {
          vod_id: query.vod_id,
          highlight_id: query.highlight_id,
          game: query.game,
          channel_id: query.channel_id
        }
      })
      .then(response => {
        vm.searchVideos = response.data;
        if (vm.searchVideos == "") vm.highlightSearch = "Error";
        else vm.highlightSearch = "Find";
      })
      .catch(function(error) {
        console.log(error);
        vm.highlightSearch = "Error";
      });
  },
  components: { HighlightList }
};
</script>

