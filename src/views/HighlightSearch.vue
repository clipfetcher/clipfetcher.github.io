<template>
  <div class="container">
    <h2>搜尋結果</h2>
    <div
      v-if="highlightSearch === 'Loading'"
      class="d-flex justify-content-center my-2"
    >
      <div class="spinner-border text-secondary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else-if="highlightSearch === 'Find'" class="my-2">
      <highlight-shelf
        v-for="searchVideo in searchVideos"
        :key="searchVideo.index"
        :vod_id="searchVideo.vod_id"
        :highlight_id="searchVideo.highlight_id"
        :channel_id="searchVideo.channel_id"
        :streamerName="searchVideo.streamerName"
        :game="searchVideo.game"
        :video_link="searchVideo.youtube_url"
        :start_at="searchVideo.start_at"
        :duration="searchVideo.duration"
        :avg_score="searchVideo.avg_score"
        :memo="searchVideo.memo"
        :author="searchVideo.author"
        :status="searchVideo.status"
        :analyzeType="searchVideo.analyzeType"
      ></highlight-shelf>
    </div>
    <div v-else class="alert alert-danger" role="alert">
      <p class="text-center my-2 py-2">
        <span>很抱歉！找不到您要搜尋的精華影片！</span>
      </p>
    </div>
  </div>
</template>

<script>
import HighlightShelf from "@/components/HighlightShelf.vue";

export default {
  name: "results",
  data() {
    return {
      query: this.$route.query,
      highlightSearch: "Loading",
      searchVideos: null,
    };
  },
  components: { HighlightShelf },
  mounted() {
    this.getContent();
  },
  methods: {
    getContent() {
      let query = this.query;
      let vm = this;
      vm.highlightSearch = "Loading";
      vm.searchVideos = null;
      this.axios
        .get(process.env.VUE_APP_ROOT_API + "/api/vod/highlight", {
          params: {
            vod_id: query.vod_id,
            highlight_id: query.highlight_id,
            game: query.game,
            channel_id: query.channel_id,
            streamerName: query.streamerName,
            author: query.author,
          },
        })
        .then((response) => {
          vm.searchVideos = response.data.reverse();
          if (vm.searchVideos == "") vm.highlightSearch = "Error";
          else vm.highlightSearch = "Find";
        })
        .catch(function (error) {
          console.log(error);
          vm.highlightSearch = "Error";
        });
    },
  },
  watch: {
    $route() {
      this.query = this.$route.query;
      this.getContent();
    },
  },
};
</script>

