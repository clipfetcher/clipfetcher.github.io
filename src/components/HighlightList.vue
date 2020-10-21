<template>
  <!-- 精華影片顯示 -->
  <div class="m-4">
    <div class="row">
      <div class="col-12 col-md-4 my-2">
        <div
          v-if="status === 'FINISHED' || highlightStatusText === 'Empty'"
          class="embed-responsive embed-responsive-16by9"
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
      <div class="col-12 col-md-8">
        <b-dropdown
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          class="float-right"
          right
          no-caret
        >
          <template v-slot:button-content>
            <i class="fas fa-chevron-circle-down"></i>
          </template>
          <b-dropdown-item
            :href="'https://www.twitch.tv/videos/' + vod_id"
            target="_blank"
          >
            <i
              class="fas fa-link fa-lg m-1"
              data-toggle="tooltip"
              title="原始鏈結"
            ></i>
            原始鏈結
          </b-dropdown-item>
          <b-dropdown-item :to="'/highlight/' + highlight_id" target="_blank">
            <i
              class="fas fa-share-square fa-lg m-1"
              data-toggle="tooltip"
              title="精華頁面"
            ></i>
            精華頁面
          </b-dropdown-item>
          <b-dropdown-item v-if="showManualEdit" @click="manualEditor">
            <i
              class="fas fa-user-edit fa-lg m-1"
              data-toggle="tooltip"
              title="手動剪輯"
            ></i>
            手動剪輯
          </b-dropdown-item>
        </b-dropdown>
        <p class="text-left m-0">標題：{{ memo }}</p>
        <p class="text-left m-0">
          實況主：
          <b-link
            :to="'/results?channel_id=' + channel_id"
            @click.prevent="channelSearch"
            >{{ streamerName }}</b-link
          >
        </p>
        <p class="text-left m-0">
          遊戲分類：
          <b-link :to="'/results?game=' + game" @click.prevent="gameSearch">
            {{ game }}
          </b-link>
        </p>
        <p class="text-left m-0">目前分數：{{ avg_score }}</p>
        <p class="text-left m-0">
          建立者：
          <b-link
            :to="'/results?author=' + author"
            @click.prevent="authorSearch"
            >{{ author }}</b-link
          >
        </p>
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
    <hr class="my-4" />
  </div>
</template>

<script>
export default {
  name: "HighlightList",
  props: [
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
    "analysis",
  ],
  data() {
    return {
      temp_starRating: 4,
      starRating: 4,
      text: "",
      appraiseModalShow: false,

      notAccurate: false,
      videoLong: false,
      analysisLong: false,
      validationText: false,
    };
  },
  methods: {
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
    manualEditor() {
      this.$emit("manual", this.vod_id, this.start_at, this.duration);
    },
  },
  computed: {
    youtube_embed: function () {
      let vodData = this.youtube_url;
      vodData = vodData.split("=");
      let url = vodData[1];
      return "https://www.youtube.com/embed/" + url + "?rel=0";
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
          text = "Empty";
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
    showManualEdit() {
      if (this.$router.currentRoute.name === "Demo") {
        return true;
      }
      return false;
    },
  },
};
</script>