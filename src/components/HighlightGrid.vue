<template>
  <div class="col">
    <div class="card my-2">
      <div v-if="status === 'FINISHED'">
        <img
          @click="highlightPage"
          :src="embed_thumbnail"
          class="card-img-top"
          alt="video_thumbnail"
        />
        <p class="m-0 text-center text-secondary">
          <small>點擊上方圖片以檢視完整影片</small>
        </p>
      </div>
      <div v-else class="card-img-top">
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
        <div class="row">
          <div class="col-10">
            <h5 class="card-title mb-1 p-0 text-truncate">{{ memo }}</h5>
            <p class="m-0">
              <small class="text-muted"
                ><b-link
                  :to="'/results?channel_id=' + channel_id"
                  @click.prevent="channelSearch"
                  class="text-secondary"
                  >{{ streamerName }}</b-link
                >・<b-link
                  :to="'/results?game=' + game"
                  @click.prevent="gameSearch"
                  class="text-secondary"
                >
                  {{ game }}
                </b-link></small
              >
            </p>
          </div>
          <b-dropdown
            v-if="showManualEdit"
            variant="link"
            class="col-2 p-0"
            toggle-class="text-decoration-none"
            right
            no-caret
          >
            <template #button-content>
              <i class="fas fa-ellipsis-h text-secondary"></i>
            </template>
            <b-dropdown-item
              @click="manualEditor"
              v-b-tooltip.hover
              title="建立自己專屬的手動編輯"
              ><i class="fas fa-user-edit mr-2"></i>手動編輯</b-dropdown-item
            >
          </b-dropdown>
        </div>
        <div class="card-text py-0"></div>
      </div>
      <div class="card-footer py-1">
        <p class="m-0">
          <small class="text-muted"
            >建立者：<b-link
              :to="'/results?author=' + author"
              @click.prevent="authorSearch"
              class="text-info"
              >{{ author }}</b-link
            >
            使用{{ analysis }}</small
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "highlight-grid",
  props: [
    "vod_id",
    "highlight_id",
    "channel_id",
    "streamerName",
    "game",
    "video_link",
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
        case "RUNALGO":
        case "FMVODDL":
        case "FMVODCB":
        case "YTVODUL":
        case "FINISHED":
          bool = false;
          break;
        case "NEWANALF":
        case "GETINFOF":
        case "RUNALGOF":
        case "FMVODDLF":
        case "FMVODCBF":
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