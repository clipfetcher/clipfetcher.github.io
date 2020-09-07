<template>
  <div>
    <br />
    <div v-if="videoList === 'Loading'" class="d-flex justify-content-center my-5">
      <div class="spinner-grow text-secondary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else-if="videoList === 'Finish'">
      <AdminHighlightList
        v-for="highlight in highlightVideos"
        :key="highlight.index"
        :vod_id="highlight.vod_id"
        :highlight_id="highlight.highlight_id"
        :channel_id="highlight.channel_id"
        :streamerName="highlight.streamerName"
        :game="highlight.game"
        :youtube_url="highlight.youtube_url"
        :avg_score="highlight.avg_score"
        :memo="highlight.memo"
      ></AdminHighlightList>
    </div>
    <div v-else-if="videoList === 'Empty'" class="alert alert-info" role="alert">
      <p class="text-center my-2 py-2">
        <span>目前還沒有精華影片！！</span>
      </p>
    </div>
    <div v-else class="alert alert-danger" role="alert">
      <p class="text-center my-2 py-2">
        <span>系統連線發生錯誤 請等待問題排除或重新整理頁面嘗試 感謝！</span>
      </p>
    </div>
  </div>
</template>

<script>
import AdminHighlightList from "@/components/AdminHighlightList.vue";

export default {
  name: "appraise",
  data() {
    return {
      videoList: "Loading",
      highlightVideos: null,
    };
  },
  components: { AdminHighlightList },
  mounted() {
    this.getContent();
  },
  methods: {
    getContent: function () {
      this.axios
        .get(process.env.VUE_APP_ROOT_API + "/api/vod/highlight")
        .then((response) => {
          this.highlightVideos = response.data.reverse();
          if (this.highlightVideos.length == 0) this.videoList = "Empty";
          else this.videoList = "Finish";
        })
        .catch(function (error) {
          console.log(error.response);
          this.videoList = "Error";
        });
    },
  },
};
</script>

<style>
</style>