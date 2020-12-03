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
              v-if="showManualEdit"
              @click="manualEditor"
              v-b-tooltip.hover.bottomleft="'建立自己專屬的手動編輯'"
              ><i class="fas fa-user-edit mr-2"></i>手動編輯</b-dropdown-item
            >
            <b-dropdown-item
              @click="appraiseModalShow = !appraiseModalShow"
              v-b-tooltip.hover.bottomleft="'對此影片做出評價'"
              ><i class="fas fa-user-check mr-2"></i>精華評價</b-dropdown-item
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

    <b-modal v-model="appraiseModalShow" title="精華評價" hide-footer>
      <form @submit.prevent="appraise">
        <div class="form-group">
          <label for="validationText">評論：</label>
          <br />
          <button
            type="button"
            class="btn m-1"
            :class="notAccurate ? 'btn-secondary' : 'btn-outline-secondary'"
            @click="textButton('notAccurate')"
          >
            影片不精準
          </button>
          <button
            type="button"
            class="btn m-1"
            :class="videoLong ? 'btn-secondary' : 'btn-outline-secondary'"
            @click="textButton('videoLong')"
          >
            影片長度過長
          </button>
          <button
            type="button"
            class="btn m-1"
            :class="analysisLong ? 'btn-secondary' : 'btn-outline-secondary'"
            @click="textButton('analysisLong')"
          >
            影片分析太久
          </button>
          <br />
          <input
            type="text"
            class="form-control"
            :class="validationText ? 'is-invalid' : ''"
            id="validationText"
            @change="checkText"
            @keyup="checkText"
            maxlength="50"
            v-model="text"
          />
          <div class="invalid-feedback">評論不得為空</div>
        </div>
        <div class="form-group">
          <label for="starRating">分數：</label>
          <br />
          <template v-for="index in 5">
            <i
              v-if="index <= starRating"
              :key="index.id"
              class="text-warning fas fa-star"
              @click="clickRating(index)"
              @mouseover="mouseOverRrating(index)"
              @touchstart="mouseOverRrating(index)"
              @mouseout="mouseOutRrating"
              @touchend="mouseOutRrating"
            ></i>
            <i
              v-else
              :key="index.id"
              class="text-warning far fa-star"
              @click="clickRating(index)"
              @mouseover="mouseOverRrating(index)"
              @touchstart="mouseOverRrating(index)"
              @mouseout="mouseOutRrating"
              @touchend="mouseOutRrating"
            ></i>
          </template>
          {{ starRating }}
        </div>
        <button type="submit" class="btn btn-primary float-right">送出</button>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { apiHighlightAppraise } from "@/api/vod.js";

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
  data() {
    return {
      appraiseModalShow: false,
      temp_starRating: 4,
      starRating: 4,
      text: "",
      notAccurate: false,
      videoLong: false,
      analysisLong: false,
      validationText: false,
    };
  },
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
    mouseOverRrating: function (val) {
      this.temp_starRating = this.starRating;
      this.starRating = val;
    },
    mouseOutRrating: function () {
      if (!this.isRating) this.starRating = 4;
      else this.starRating = this.temp_starRating;
      this.temp_starRating = 0;
    },
    clickRating: function (val) {
      this.starRating = this.temp_starRating = val;
      this.isRating = true;
    },
    textButton: function (button) {
      let output = "";
      if (button == "notAccurate") {
        this.notAccurate = !this.notAccurate;
      } else if (button == "videoLong") {
        this.videoLong = !this.videoLong;
      } else if (button == "analysisLong") {
        this.analysisLong = !this.analysisLong;
      }
      if (this.notAccurate) {
        output += " 影片不精準 ";
      }
      if (this.videoLong) {
        output += " 影片長度過長 ";
      }
      if (this.analysisLong) {
        output += " 影片分析太久 ";
      }
      this.text = output;
    },
    checkText: function () {
      if (this.text == "" || this.text == null) {
        this.validationText = true;
      } else {
        this.validationText = false;
      }
    },
    appraise: function () {
      let vm = this;
      if (this.text == "" || this.text == null) {
        this.validationText = true;
      } else {
        this.validationText = false;
        apiHighlightAppraise({
          highlight_id: this.highlight_id,
          text: this.text,
          score: this.starRating,
        })
          .then((response) => {
            vm.response = response;
          })
          .catch(function (error) {
            console.log(error);
          });
        this.appraiseModalShow = !this.appraiseModalShow;
      }
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