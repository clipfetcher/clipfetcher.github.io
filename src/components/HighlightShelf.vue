<template>
  <div class="card mb-3 px-1 py-2">
    <div class="row no-gutters">
      <div class="col-md-4">
        <div v-if="status === 'FINISHED'" style="width: 100%; height: 12em">
          <img
            @click="highlightPage"
            :src="embed_thumbnail"
            class="card-img"
            style="width: 100%; height: 100%; object-fit: cover"
            alt="video_thumbnail"
          />
        </div>
        <div v-else class="card-img">
          <div
            class="alert alert-info p-4"
            :class="[isFailed ? 'alert-danger' : 'alert-info']"
            role="alert"
          >
            <p class="text-center my-4 py-4">
              <span>{{ highlightStatusText }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <p
            v-if="status === 'FINISHED'"
            class="m-0 text-center text-secondary"
          >
            <small>點擊圖片以檢視完整影片</small>
          </p>
          <h5 class="card-title mb-1 text-truncate">{{ memo }}</h5>
          <div class="card-text py-0">
            <p class="m-0">
              <b-link
                :to="'/results?channel_id=' + channel_id"
                @click.prevent="channelSearch"
                >{{ streamerName }}</b-link
              >・<b-link
                :to="'/results?game=' + game"
                @click.prevent="gameSearch"
              >
                {{ game }}
              </b-link>
            </p>
            <p class="m-0">
              建立者：
              <b-link
                :to="'/results?author=' + author"
                @click.prevent="authorSearch"
                >{{ author }}</b-link
              >
              使用{{ analysis }}
            </p>
            <p class="mx-0 my-2">
              <b-button
                v-if="showManualEdit"
                @click="manualEditor"
                variant="outline-info"
                v-b-tooltip.hover
                title="建立自己專屬的手動剪輯"
                class="float-right"
                ><i class="fas fa-user-edit mr-2"></i>手動編輯
              </b-button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "highlight-shelf",
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
        return "https://i.ytimg.com/vi/" + video_id + "/sddefault.jpg";
      } else {
        // other video link
        video_url = video_url.split("?");
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