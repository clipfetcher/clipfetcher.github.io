<template>
  <div class="container">
    <div class="my-2">
      <div
        v-if="highlightPage === 'Loading'"
        class="d-flex justify-content-center my-4"
      >
        <div class="spinner-border text-secondary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else-if="highlightPage === 'Find'">
        <div class="row">
          <div class="col-12">
            <div
              v-if="highlightVideo.status === 'FINISHED'"
              class="embed-responsive embed-responsive-16by9 mb-4"
            >
              <iframe
                class="embed-responsive-item"
                :src="youtube_embed"
                allowfullscreen
              ></iframe>
            </div>
            <div
              v-else
              class="alert alert-info"
              :class="[isFailed ? 'alert-danger' : 'alert-info']"
              role="alert"
            >
              <p class="text-center my-4 py-4">
                <span>{{ highlightStatusText }}</span>
              </p>
            </div>
          </div>
          <div class="col-12">
            <h4>
              {{ highlightVideo.memo }}
            </h4>
            <small>分析狀態：{{ highlightStatusText }}</small>
            <a
              :href="'https://www.twitch.tv/videos/' + highlightVideo.vod_id"
              target="_blank"
              class="card-link float-right"
            >
              <i
                class="fas fa-link fa-lg my-3"
                data-toggle="tooltip"
                title="VOD網址"
              ></i>
            </a>
          </div>
          <div class="col-12">
            <p class="text-left m-0">
              實況主：
              <b-link
                :to="'/results?channel_id=' + highlightVideo.channel_id"
                >{{ highlightVideo.streamerName }}</b-link
              >
            </p>
            <p class="text-left m-0">
              遊戲分類：
              <b-link :to="'/results?game=' + highlightVideo.game">{{
                highlightVideo.game
              }}</b-link>
            </p>
            <p class="text-left m-0">
              目前分數：{{ highlightVideo.avg_score }}
            </p>
            <p class="text-left m-0">
              建立者：<b-link
                :to="'/results?author=' + highlightVideo.author"
                >{{ highlightVideo.author }}</b-link
              >
            </p>
            <p class="text-left m-0">分析方式：{{ analysis }}</p>
            <b-button
              @click="appraiseModalShow = !appraiseModalShow"
              variant="outline-info"
              class="float-right m-1"
              >我要評價</b-button
            >

            <b-modal v-model="appraiseModalShow" title="精華評價" hide-footer>
              <form @submit.prevent="appraise">
                <div class="form-group">
                  <label for="validationText">評論：</label>
                  <br />
                  <button
                    type="button"
                    class="btn m-1"
                    :class="
                      notAccurate ? 'btn-secondary' : 'btn-outline-secondary'
                    "
                    @click="textButton('notAccurate')"
                  >
                    影片不精準
                  </button>
                  <button
                    type="button"
                    class="btn m-1"
                    :class="
                      videoLong ? 'btn-secondary' : 'btn-outline-secondary'
                    "
                    @click="textButton('videoLong')"
                  >
                    影片長度過長
                  </button>
                  <button
                    type="button"
                    class="btn m-1"
                    :class="
                      analysisLong ? 'btn-secondary' : 'btn-outline-secondary'
                    "
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
                <button type="submit" class="btn btn-primary float-right">
                  送出
                </button>
              </form>
            </b-modal>
          </div>
        </div>
      </div>
      <div v-else class="row justify-content-center my-2">
        <div class="alert alert-danger" role="alert">
          <p class="text-center my-2 py-2">
            <span>很抱歉！找不到您的精華影片！</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Highlight",
  props: ["highlight_id"],
  data() {
    return {
      highlightPage: "Loading",
      highlightVideo: null,
      analysisComplete: false,

      temp_starRating: 4,
      starRating: 4,
      text: "",
      appraiseModalShow: false,

      notAccurate: false,
      videoLong: false,
      analysisLong: false,
      validationText: false,
      fetchContent: "",
    };
  },
  mounted() {
    this.highlightPage = "Loading";
    this.getContent();
    this.fetchContent = setInterval(() => {
      this.getContent();
    }, 60000);
  },
  methods: {
    getContent() {
      let vm = this;
      this.axios
        .get(process.env.VUE_APP_ROOT_API + "/api/vod/highlight", {
          params: {
            highlight_id: this.highlight_id,
          },
        })
        .then((response) => {
          this.highlightVideo = response.data[0];
          if (this.isFailed || this.highlightVideo.status === "FINISHED") {
            clearInterval(this.fetchContent);
          }
          if (this.highlightVideo == "" || this.highlightVideo == null) {
            this.highlightPage = "Error";
            clearInterval(this.fetchContent);
          } else {
            this.highlightPage = "Find";
          }
        })
        .catch(() => {
          vm.highlightPage = "Error";
          clearInterval(this.fetchContent);
        });
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
        this.axios
          .post(process.env.VUE_APP_ROOT_API + "/api/vod/appraise", {
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
  watch: {
    $route() {
      this.getContent();
    },
  },
  computed: {
    youtube_embed: function () {
      let vodData = this.highlightVideo.youtube_url;
      vodData = vodData.split("=");
      let url = vodData[1];
      return "https://www.youtube.com/embed/" + url + "?rel=0";
    },
    highlightStatusText() {
      let text;
      switch (this.highlightVideo.status) {
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
      switch (this.highlightVideo.status) {
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
      switch (this.highlightVideo.analyzeType) {
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
  },
};
</script>