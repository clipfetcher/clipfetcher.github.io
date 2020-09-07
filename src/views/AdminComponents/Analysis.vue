<template>
  <div>
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
</template>

<script>
import AdminHighlightList from "@/components/AdminHighlightList.vue";

export default {
  name: "appraise",
  data() {
    return {
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
        })
        .catch(function (error) {
          console.log(error.response);
        });
    },
  },
};
</script>

<style>
</style>