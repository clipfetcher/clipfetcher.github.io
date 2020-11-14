<template>
  <div class="col">
    <div class="card my-2">
      <img
        v-if="status === 'FINISHED'"
        :src="embed_thumbnail"
        @click="highlightPage"
        class="card-img-top img-fluid"
        alt="video_thumbnail"
      />
      <div v-else class="card-img-top" style="height: auto">
        <div
          class="alert alert-info"
          :class="[isFailed ? 'alert-danger' : 'alert-info']"
          role="alert"
        >
          <p class="text-center my-4 py-4">
            <span>{{ highlightStatusText }}</span>
          </p>
        </div>
      </div>

      <div class="card-body py-1">
        <h5 class="card-title mb-1">{{ memo }}</h5>
        <b-button
          v-if="showManualEdit"
          @click="manualEditor"
          variant="link"
          class="float-right p-0"
          ><i
            class="fas fa-user-edit m-1"
            v-b-tooltip.hover
            title="手動剪輯"
          ></i>
        </b-button>
        <div class="card-text py-0">
          <p class="m-0">
            <small
              >實況主：
              <b-link
                :to="'/results?channel_id=' + channel_id"
                @click.prevent="channelSearch"
                >{{ streamerName }}</b-link
              ></small
            >
          </p>
          <p class="m-0">
            <small
              >遊戲分類：
              <b-link :to="'/results?game=' + game" @click.prevent="gameSearch">
                {{ game }}
              </b-link></small
            >
          </p>
          <p class="m-0">
            <small
              >建立者：
              <b-link
                :to="'/results?author=' + author"
                @click.prevent="authorSearch"
                >{{ author }}</b-link
              ></small
            >
          </p>
        </div>
      </div>
      <div class="card-footer py-1">
        <small class="text-muted">{{ analysis }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "highlight-grid",
  props: [
    "video_link",
    "vod_id",
    "highlight_id",
    "channel_id",
    "streamerName",
    "game",
    "youtube_url",
    "start_at",
    "duration",
    "avg_score",
    "memo",
    "author",
    "status",
    "analyzeType",
  ],
  //https://videodelivery.net/{id}/thumbnails/thumbnail.jpg
  //https://videodelivery.net/{id}}/thumbnails/thumbnail.gif?time=10s&fps=3&duration=2s
  //https://img.youtube.com/vi/{id}/hqdefault.jpg
  methods: {
    channelSearch: function () {
      this.$router.push({
        name: "HighlightSearch",
        query: { channel_id: this.channel_id },
      });
      if (this.$router.currentRoute.name === "HighlightSearch") {
        this.$router.go(0);
      }
    },
    gameSearch: function () {
      this.$router.push({
        name: "HighlightSearch",
        query: { game: this.game },
      });
      if (this.$router.currentRoute.name === "HighlightSearch") {
        this.$router.go(0);
      }
    },
    authorSearch() {
      this.$router.push({
        name: "HighlightSearch",
        query: { author: this.author },
      });
      if (this.$router.currentRoute.name === "HighlightSearch") {
        this.$router.go(0);
      }
    },
    highlightPage() {
      const highlight_id = this.highlight_id;
      this.$router.push({
        name: "Highlight",
        params: { highlight_id },
      });
    },
    manualEditor() {
      this.$emit("manual", this.vod_id, this.start_at, this.duration);
    },
  },
  computed: {
    embed_thumbnail: function () {
      let video_url = this.video_link;
      let video_hostname = new URL(video_url).hostname;
      let video_id = "";
      // if youtube link
      if (video_hostname === "www.youtube.com") {
        video_url = video_url.split("=");
        video_id = video_url[1];
        return "https://i.ytimg.com/vi/" + video_id + "/maxresdefault.jpg";
      } else {
        // other video link
        video_url = video_url.split("=");
        video_url = video_url[0];
        video_url = video_url.split("/");
        video_id = video_url[video_url.length - 1];
        return (
          "https://videodelivery.net/" + video_id + "/thumbnails/thumbnail.jpg"
        );
      }
    },
    highlightStatusText() {
      let text;
      switch (this.status) {
        case "GETINFO":
          text = "獲取資訊中";
          break;
        case "RUNALGO":
          text = "影片分析中";
          break;
        case "FMVODDL":
          text = "影片下載中";
          break;
        case "FMVODCB":
          text = "影片合併中";
          break;
        case "YTVODUL":
          text = "YT上傳中";
          break;
        case "FINISHED":
          text = "已完成";
          break;
        case "NEWANALF":
          text = "建立分析失敗";
          break;
        case "GETINFOF":
          text = "獲取資訊失敗";
          break;
        case "RUNALGOF":
          text = "影片分析失敗";
          break;
        case "FMVODDLF":
          text = "影片下載失敗";
          break;
        case "FMVODCBF":
          text = "影片合併失敗";
          break;
        case "YTVODULF":
          text = "YT上傳失敗";
          break;
        default:
          text = "獲取資訊中";
      }
      return text;
    },
    isFailed() {
      let bool = false;
      switch (this.status) {
        case "GETINFO":
          bool = false;
          break;
        case "RUNALGO":
          bool = false;
          break;
        case "FMVODDL":
          bool = false;
          break;
        case "FMVODCB":
          bool = false;
          break;
        case "YTVODUL":
          bool = false;
          break;
        case "FINISHED":
          bool = false;
          break;
        case "NEWANALF":
          bool = true;
          break;
        case "GETINFOF":
          bool = true;
          break;
        case "RUNALGOF":
          bool = true;
          break;
        case "FMVODDLF":
          bool = true;
          break;
        case "FMVODCBF":
          bool = true;
          break;
        case "YTVODULF":
          bool = true;
          break;
        default:
          bool = false;
      }
      return bool;
    },
    analysis() {
      let text;
      switch (this.analyzeType) {
        case "freq":
          text = "自動頻率分析";
          break;
        case "manual":
          text = "手動剪輯";
          break;
        case "machine":
          text = "機器學習";
          break;
        default:
          text = "";
      }
      return text;
    },
    showManualEdit() {
      if (this.$router.currentRoute.name === "Demo") {
        return true;
      }
      return false;
    },
  },
};
</script>